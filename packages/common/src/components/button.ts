import {
  APIButtonComponent,
  ButtonStyle,
  ComponentType,
} from "discord-api-types/v10";

interface BaseButtonOptions {
  /** Developer-defined identifier for the button; max 100 characters */
  customId?: string;
  /** Text that appears on the button; max 80 characters */
  label: string;
  /** A {@link https://discord.com/developers/docs/interactions/message-components#button-object-button-styles button style }*/
  style: "primary" | "secondary" | "success" | "danger" | "link";
  /** Whether the button is disabled (defaults to false) */
  disabled?: boolean;
}

interface ButtonOptionsWithLink extends BaseButtonOptions {
  style: "link";
  /** URL for link-style buttons */
  url: string | URL;
}

interface ButtonOptionsWithoutLink extends BaseButtonOptions {
  style: "primary" | "secondary" | "success" | "danger";
}

type ButtonOptions = ButtonOptionsWithLink | ButtonOptionsWithoutLink;

export class Button implements BaseButtonOptions {
  customId?: string;
  label: string;
  style: "primary" | "secondary" | "success" | "danger" | "link";
  disabled?: boolean;
  url?: string | URL;

  constructor(options: ButtonOptions) {
    Object.assign(this, options);
  }

  get raw(): APIButtonComponent {
    return {
      type: ComponentType.Button,
      custom_id: this.customId,
      label: this.label,
      style: this.rawStyle,
      disabled: this.disabled,
      url: this.rawUrl,
    };
  }

  private get rawStyle(): ButtonStyle {
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

  private get rawUrl(): string {
    return this.url instanceof URL ? this.url.href : this.url;
  }
}
