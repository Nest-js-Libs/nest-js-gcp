import { registerAs } from '@nestjs/config';

export interface GcpConfig {
  projectId: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export default registerAs('gcp', () => ({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
}));
