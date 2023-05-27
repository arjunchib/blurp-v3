import { RuntimeAdapter } from "@blurp/runtime";
import { DiscordRestService } from "./discord_rest_service";
import { Schema } from "../types";
import { isMatch } from "lodash-es";

export class SchemaService {
  constructor(private discordRestService: DiscordRestService) {}

  async updateDiscord(schema: Schema[]) {
    const commands =
      await this.discordRestService.getGuildApplicationCommands();
    const hasMismatch = commands.some((command) => {
      const currentSchema = schema.find((s) => s.name === command.name);
      const isMismatch = !currentSchema || !isMatch(command, currentSchema);
      return isMismatch;
    });
    if (hasMismatch) {
      await this.discordRestService.bulkOverwriteGuildApplicationCommands(
        schema
      );
      console.log("Uploaded application commands");
    } else {
      console.log("Skipped uploading application commands");
    }
  }
}
