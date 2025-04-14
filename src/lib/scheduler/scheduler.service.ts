import { Injectable } from '@nestjs/common';
import { CloudSchedulerClient } from '@google-cloud/scheduler';
import { GcpService } from '../gcp.service';

@Injectable()
export class SchedulerService {
  private scheduler: CloudSchedulerClient;
  private location: string;

  constructor(private readonly gcpService: GcpService) {
    this.scheduler = new CloudSchedulerClient({
      projectId: this.gcpService.getProjectId(),
      credentials: this.gcpService.getCredentials(),
    });
    this.location = 'us-central1'; // Default location
  }

  async createHttpJob({
    name,
    schedule,
    url,
    httpMethod = 'POST',
    headers = {},
    body,
  }: {
    name: string;
    schedule: string;
    url: string;
    httpMethod?: string;
    headers?: Record<string, string>;
    body?: any;
  }) {
    const parent = `projects/${this.gcpService.getProjectId()}/locations/${this.location}`;
    const job: any = {
      name: `${parent}/jobs/${name}`,
      schedule,
      timeZone: 'UTC',
      httpTarget: {
        uri: url,
        httpMethod,
        headers,
        body: body
          ? Buffer.from(JSON.stringify(body)).toString('base64')
          : undefined,
      },
    };

    const [response] = await this.scheduler.createJob({
      parent,
      job,
    });

    return response;
  }

  async createPubSubJob({
    name,
    schedule,
    topicName,
    data,
  }: {
    name: string;
    schedule: string;
    topicName: string;
    data?: any;
  }) {
    const parent = `projects/${this.gcpService.getProjectId()}/locations/${this.location}`;
    const job = {
      name: `${parent}/jobs/${name}`,
      schedule,
      timeZone: 'UTC',
      pubsubTarget: {
        topicName: `projects/${this.gcpService.getProjectId()}/topics/${topicName}`,
        data: data
          ? Buffer.from(JSON.stringify(data)).toString('base64')
          : undefined,
      },
    };

    const [response] = await this.scheduler.createJob({
      parent,
      job,
    });

    return response;
  }

  async deleteJob(name: string) {
    const jobPath = `projects/${this.gcpService.getProjectId()}/locations/${this.location}/jobs/${name}`;
    await this.scheduler.deleteJob({
      name: jobPath,
    });
  }

  async pauseJob(name: string) {
    const jobPath = `projects/${this.gcpService.getProjectId()}/locations/${this.location}/jobs/${name}`;
    const [response] = await this.scheduler.pauseJob({
      name: jobPath,
    });
    return response;
  }

  async resumeJob(name: string) {
    const jobPath = `projects/${this.gcpService.getProjectId()}/locations/${this.location}/jobs/${name}`;
    const [response] = await this.scheduler.resumeJob({
      name: jobPath,
    });
    return response;
  }

  async listJobs() {
    const parent = `projects/${this.gcpService.getProjectId()}/locations/${this.location}`;
    const [jobs] = await this.scheduler.listJobs({
      parent,
    });
    return jobs;
  }

  async runJob(name: string) {
    const jobPath = `projects/${this.gcpService.getProjectId()}/locations/${this.location}/jobs/${name}`;
    const [response] = await this.scheduler.runJob({
      name: jobPath,
    });
    return response;
  }

  setLocation(location: string) {
    this.location = location;
  }
}
