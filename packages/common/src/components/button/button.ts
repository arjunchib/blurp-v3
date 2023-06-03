import {
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  ButtonStyle,
  ComponentType,
} from "discord-api-types/v10";
import { BaseButton, BaseButtonOptions } from "./base_button";

interface ButtonOptions extends BaseButtonOptions {
  /** Developer-defined identifier for the button; max 100 characters */
  customId: string;
}

export class Button extends BaseButton implements ButtonOptions {
  customId: string;
  declare style: "primary" | "secondary" | "success" | "danger";

  constructor(options: ButtonOptions) {
    super(options);
    this.customId = options.customId;
  }

  get raw(): APIButtonComponentWithCustomId {
    const style = this.rawStyle as
      | ButtonStyle.Primary
      | ButtonStyle.Secondary
      | ButtonStyle.Success
      | ButtonStyle.Danger;
    return {
      type: ComponentType.Button,
      custom_id: this.customId,
      label: this.label,
      style,
      disabled: this.disabled,
    };
  }
}
