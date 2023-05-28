export interface Requestable {
  onRequest(request: Request): Promise<Response>;
}

export interface RuntimeAdapter<
  Env extends Record<string, any> = Record<string, any>
> {
  init?(): void;
  file?(path: string): Blob;
  write?(destination: string, input: string): Promise<any>;
  readDir?(path: string): Promise<string[]>;
  serve?(webhookAdapter: Requestable): any;
  env: Env;
}

export abstract class RuntimeAdapter<Env> {
  hasFilesystem(): boolean {
    return !!(this.file && this.write && this.readDir);
  }
}
