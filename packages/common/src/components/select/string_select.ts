import {
  APISelectMenuComponent,
  APISelectMenuOption,
  APIStringSelectComponent,
  ComponentType,
} from "discord-api-types/v10";
import { Select, SelectOptions } from "./select";

export interface Emoji {
  /** {@link https://discord.com/developers/docs/reference#image-formatting emoji id} */
  id: string;
  /** emoji name */
  name: string;
  /** whether this emoji is animated */
  animated?: boolean;
}

export interface SelectOption {
  /** User-facing name of the option; max 100 characters */
  label: string;
  /** Dev-defined value of the option; max 100 characters */
  value: string;
  /** Additional description of the option; max 100 characters */
  description?: string;
  /** id, name, and animated */
  emoji?: Emoji;
  /** Will show this option as selected by default */
  default?: boolean;
}

export interface StringSelectOptions extends SelectOptions {
  /** Specified choices in a select menu (only required and available for string selects (type 3); max 25 */
  options: (SelectOption | string)[];
}

export class StringSelect extends Select implements StringSelectOptions {
  options: (SelectOption | string)[];

  constructor(options: StringSelectOptions) {
    super(options);
    this.options = options.options;
  }

  get raw(): APIStringSelectComponent {
    return {
      ...this.baseRaw,
      options: this.rawOptions,
      type: ComponentType.StringSelect,
    };
  }

  protected get rawOptions(): APISelectMenuOption[] {
    return this.options.map((opt) => {
      if (typeof opt === "string") {
        return {
          label: opt,
          value: opt,
        };
      }
      return opt;
    });
  }
}
