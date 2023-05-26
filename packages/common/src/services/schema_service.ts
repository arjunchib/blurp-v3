import { DiscordRestService } from "./discord_rest_service";
import { Options } from "../types";
import { isMatch } from "lodash-es";

export class SchemaService {
  constructor(private discordRestService: DiscordRestService) {}

  async updateDiscord(schema: Options["schema"]) {
    const schemaValues = Object.values(schema);
    const commands =
      await this.discordRestService.getGuildApplicationCommands();
    const hasMismatch = commands.some((command) => {
      const currentSchema = schemaValues.find((s) => s.name === command.name);
      const isMismatch = !currentSchema || !isMatch(command, currentSchema);
      return isMismatch;
    });
    if (hasMismatch) {
      await this.discordRestService.bulkOverwriteGuildApplicationCommands(
        schemaValues
      );
      console.log("Uploaded application commands");
    } else {
      console.log("Skipped uploading application commands");
    }
  }
}
