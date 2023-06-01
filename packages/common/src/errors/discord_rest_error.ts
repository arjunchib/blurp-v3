export class DiscordRestError extends Error {
  static async create(res: Response) {
    const errorMessage = (await res.json<{ message?: string }>()).message;
    return new this(errorMessage || `${res.status} ${res.statusText}`);
  }

  constructor(message: string, ...args: any[]) {
    super(message, ...args);
    this.name = "DiscordRestError";
  }
}
