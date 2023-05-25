import { DiscordRestService } from "./discord_rest_service";
import { ModelGenerator } from "./model_generator";
import { Options } from "./types";
import { isMatch } from "lodash-es";

export class SchemaProcessor {
  constructor(
    private options: Options,
    private discordRestService: DiscordRestService,
    private modelGenerator: ModelGenerator
  ) {}

  async process() {
    const schema = Object.values(this.options.schema);
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
    }
    this.modelGenerator.generate(schema);
  }
}
