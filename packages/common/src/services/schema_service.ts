import { DiscordRestService } from "./discord_rest_service";
import { Schema } from "../types";
import { isMatch } from "../utils";

export class SchemaService {
  constructor(private discordRestService: DiscordRestService) {}

  async updateDiscord(schema: Schema[]) {
    const commands =
      await this.discordRestService.getGuildApplicationCommands();
    if (!this.schemasMatch(commands, schema)) {
      await this.discordRestService.bulkOverwriteGuildApplicationCommands(
        schema
      );
      console.log("Uploaded application commands");
    }
  }

  private schemasMatch(a: Schema[], b: Schema[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isMatch(a[i], b[i])) return false;
    }
    return true;
  }
}
