import {
  APIBaseSelectMenuComponent,
  APISelectMenuComponent,
  ComponentType,
} from "discord-api-types/v10";

export interface SelectOptions {
  /** ID for the select menu; max 100 characters */
  customId: string;
  /** Placeholder text if nothing is selected; max 150 characters */
  placeholder?: string;
  /** Minimum number of items that must be chosen (defaults to 1); min 0, max 25 */
  minValues?: number;
  /** Maximum number of items that can be chosen (defaults to 1); max 25 */
  maxValues?: number;
  /** Whether select menu is disabled (defaults to false) */
  disabled?: boolean;
}

export abstract class Select implements SelectOptions {
  customId: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;

  constructor(options: SelectOptions) {
    this.customId = options.customId;
    this.placeholder = options.placeholder;
    this.minValues = options.minValues;
    this.maxValues = options.maxValues;
    this.disabled = options.disabled;
  }

  protected get baseRaw() {
    return {
      custom_id: this.customId,
      placeholder: this.placeholder,
      min_values: this.minValues,
      max_values: this.maxValues,
      disabled: this.disabled,
    };
  }

  abstract get raw(): APISelectMenuComponent;
}
