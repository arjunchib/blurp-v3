import {
  APIButtonComponentBase,
  ButtonStyle,
  ComponentType,
} from "discord-api-types/v10";

export interface BaseButtonOptions {
  /** Text that appears on the button; max 80 characters */
  label: string;
  /** A {@link https://discord.com/developers/docs/interactions/message-components#button-object-button-styles button style }*/
  style?: "primary" | "secondary" | "success" | "danger" | "link";
  /** Whether the button is disabled (defaults to false) */
  disabled?: boolean;
}

export abstract class BaseButton implements BaseButtonOptions {
  label: string;
  style: "primary" | "secondary" | "success" | "danger" | "link";
  disabled?: boolean;

  constructor(options: BaseButtonOptions) {
    this.label = options.label;
    this.style = options.style || "primary";
    this.disabled = options.disabled;
  }

  get raw(): APIButtonComponentBase<ButtonStyle> {
    return {
      type: ComponentType.Button,
      label: this.label,
      style: this.rawStyle,
      disabled: this.disabled,
    };
  }

  protected get rawStyle(): ButtonStyle {
    switch (this.style) {
      case "primary":
        return ButtonStyle.Primary;
      case "secondary":
        return ButtonStyle.Secondary;
      case "success":
        return ButtonStyle.Success;
      case "danger":
        return ButtonStyle.Danger;
      case "link":
        return ButtonStyle.Link;
    }
  }
}
