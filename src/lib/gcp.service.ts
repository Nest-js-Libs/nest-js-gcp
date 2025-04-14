import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GcpConfig } from './gcp.config';

@Injectable()
export class GcpService {
  private readonly config: GcpConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<GcpConfig>('gcp')!;
  }

  getProjectId(): string {
    return this.config.projectId;
  }

  getCredentials() {
    return this.config.credentials;
  }

  getConfig(): GcpConfig {
    return this.config;
  }
}
