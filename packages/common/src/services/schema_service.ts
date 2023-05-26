import { DiscordRestService } from "./discord_rest_service";
import { Schema } from "../types";
import { isMatch } from "lodash-es";
import { RuntimeAdapter } from "../runtime_adapters/runtime_adapter";

export class SchemaService {
  constructor(
    private discordRestService: DiscordRestService,
    private runtimeAdapter: RuntimeAdapter
  ) {}

  async readSchemaFiles(): Promise<Schema[]> {
    const fileNames = await this.runtimeAdapter.readDir?.("schema");
    if (!fileNames) {
      return [];
    }
    return await Promise.all<Schema>(
      fileNames?.map(
        async (name) =>
          (
            await import(`${process.cwd()}/schema/${name}`)
          ).default
      )
    );
  }

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
