import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { RuntimeAdapter } from "@blurp/runtime";
import pascalcase from "pascalcase";
import { format } from "prettier";
import { Schema } from "..";

export class ModelService {
  constructor(private runtimeAdapter: RuntimeAdapter) {}

  async generateModels(schema: Schema[]) {
    const gen = schema.map((s) => this.createModel(s)).join("\n");
    const formattedGen = format(gen, { parser: "babel" });
    try {
      const file = await this.runtimeAdapter.file?.("blurp.gen.ts").text();
      if (file !== formattedGen) {
        await this.runtimeAdapter.write?.("blurp.gen.ts", formattedGen);
        console.log("Saved models");
      }
    } catch {
      await this.runtimeAdapter.write?.("blurp.gen.ts", formattedGen);
      console.log("Saved models");
    }
  }

  private createModel(schema: Schema) {
    const name = pascalcase(schema.name);
    const options = this.modelOptions(schema);
    return `
    export interface ${name}Model {
        ${options}
      }`;
  }

  private modelOptions(schema: Schema) {
    if (!schema.options) {
      return "";
    }
    const options = schema.options
      .map(
        (opt) =>
          `
          /** ${opt.description} */
          ${opt.name}${opt.required ? "" : "?"}: ${this.dataTypeFrom(opt.type)}`
      )
      .join(",");
    return `options: {
      ${options}
    }`;
  }

  private dataTypeFrom(type: ApplicationCommandOptionType) {
    switch (type) {
      case ApplicationCommandOptionType.Integer:
      case ApplicationCommandOptionType.Number:
        return "number";
      case ApplicationCommandOptionType.Boolean:
        return "boolean";
      default:
        return "string";
    }
  }
}
