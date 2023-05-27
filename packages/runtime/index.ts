export interface Requestable {
  onRequest(request: Request): Promise<Response>;
}

export interface RuntimeAdapter {
  init?(): void;
  file?(path: string): Blob;
  write?(destination: string, input: string): Promise<any>;
  readDir?(path: string): Promise<string[]>;
  serve?(webhookAdapter: Requestable): any;
  env: Record<string, string>;
}

export abstract class RuntimeAdapter {
  hasFilesystem(): boolean {
    return !!(this.file && this.write && this.readDir);
  }
}
