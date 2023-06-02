import {
  RESTGetAPIApplicationCommandsResult,
  RESTPutAPIApplicationCommandsJSONBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPatchAPIInteractionOriginalResponseResult,
} from "discord-api-types/v10";
import { DiscordRestError } from "../errors/discord_rest_error";

export class DiscordRestService {
  private async fetch<T = any>(request: {
    path: string;
    method: "PUT" | "GET" | "POST" | "PATCH";
    body?: any;
  }) {
    const { TOKEN } = process.env;
    const res = await fetch(`https://discord.com/api/v10${request.path}`, {
      headers: {
        Authorization: `Bot ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
      method: request.method,
    });
    if (!res.ok) {
      throw await DiscordRestError.create(res);
    }
    return await res.json<T>();
  }

  private async put<T>(path: string, body: any) {
    return await this.fetch<T>({ path, body, method: "PUT" });
  }

  private async post<T>(path: string, body: any) {
    return await this.fetch<T>({ path, body, method: "POST" });
  }

  private async patch<T>(path: string, body: any) {
    return await this.fetch<T>({ path, body, method: "PATCH" });
  }

  private async get<T>(path: string) {
    return await this.fetch<T>({ path, method: "GET" });
  }

  async bulkOverwriteGuildApplicationCommands(
    commands: RESTPutAPIApplicationCommandsJSONBody
  ) {
    const { APPLICATION_ID, GUILD_ID } = process.env;
    return await this.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      commands
    );
  }

  async getGuildApplicationCommands() {
    const { APPLICATION_ID, GUILD_ID } = process.env;
    return await this.get<RESTGetAPIApplicationCommandsResult>(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`
    );
  }

  async createFollowupMessage(
    interactionToken: string,
    message: RESTPostAPIInteractionFollowupJSONBody
  ) {
    const { APPLICATION_ID } = process.env;
    return await this.post<RESTPostAPIInteractionFollowupResult>(
      `/webhooks/${APPLICATION_ID}/${interactionToken}`,
      message
    );
  }

  async editOriginalInteractionResponse(
    interactionToken: string,
    message: RESTPatchAPIInteractionOriginalResponseJSONBody
  ) {
    const { APPLICATION_ID } = process.env;
    return await this.patch<RESTPatchAPIInteractionOriginalResponseResult>(
      `/webhooks/${APPLICATION_ID}/${interactionToken}/messages/@original`,
      message
    );
  }
}
