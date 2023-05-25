import {
  RESTGetAPIApplicationCommandsResult,
  RESTPutAPIApplicationCommandsJSONBody,
} from "discord-api-types/v10";

export class DiscordRestService {
  private async fetch<T = any>(request: {
    path: string;
    method: "PUT" | "GET";
    body?: any;
  }) {
    const { TOKEN } = process.env;
    const res = await fetch(
      `https://discord.com/api/v10/applications${request.path}`,
      {
        headers: {
          Authorization: `Bot ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request.body),
        method: request.method,
      }
    );
    return await res.json<T>();
  }

  private async put<T>(path: string, body: any) {
    return await this.fetch<T>({ path, body, method: "PUT" });
  }

  private async get<T>(path: string) {
    return await this.fetch<T>({ path, method: "GET" });
  }

  async bulkOverwriteGuildApplicationCommands(
    commands: RESTPutAPIApplicationCommandsJSONBody
  ) {
    const { APPLICATION_ID, GUILD_ID } = process.env;
    return await this.put(
      `/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      commands
    );
  }

  async getGuildApplicationCommands() {
    const { APPLICATION_ID, GUILD_ID } = process.env;
    return await this.get<RESTGetAPIApplicationCommandsResult>(
      `/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`
    );
  }
}
