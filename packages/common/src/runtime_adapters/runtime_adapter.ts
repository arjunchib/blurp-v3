import { WebhookAdapter } from "../network_adapters/webhook_adapter";

export interface RuntimeAdapter {
  file?(path: string): Blob;
  write?(destination: string, input: string): Promise<any>;
  readDir?(path: string): Promise<string[]>;
  serve?(webhookAdapter: WebhookAdapter): any;
}

export abstract class RuntimeAdapter {}
