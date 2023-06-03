import {
  APIButtonComponentWithURL,
  ButtonStyle,
  ComponentType,
} from "discord-api-types/v10";
import { BaseButton, BaseButtonOptions } from "./base_button";

interface LinkButtonOptions extends BaseButtonOptions {
  /** URL for link-style buttons */
  url: string | URL;
}

export class LinkButton extends BaseButton implements LinkButtonOptions {
  url: string | URL;
  declare style: "link";

  constructor(options: LinkButtonOptions) {
    super({ ...options, style: "link" as const });
    this.url = options.url;
  }

  get raw(): APIButtonComponentWithURL {
    return {
      type: ComponentType.Button,
      label: this.label,
      style: this.rawStyle as ButtonStyle.Link,
      disabled: this.disabled,
      url: this.rawUrl,
    };
  }

  private get rawUrl(): string {
    return this.url instanceof URL ? this.url.href : this.url;
  }
}
