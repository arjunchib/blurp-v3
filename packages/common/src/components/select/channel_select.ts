import {
  APIChannelSelectComponent,
  ChannelType,
  ComponentType,
} from "discord-api-types/v10";
import { Select, SelectOptions } from "./select";

export interface ChannelSelectOptions extends SelectOptions {
  /** List of channel types to include in the channel select component */
  channelTypes?: ChannelType | ChannelType[];
}

export class ChannelSelect extends Select implements ChannelSelectOptions {
  channelTypes?: ChannelType | ChannelType[];

  constructor(options: ChannelSelectOptions) {
    super(options);
    this.channelTypes = options.channelTypes;
  }

  get raw(): APIChannelSelectComponent {
    return {
      ...this.baseRaw,
      channel_types: this.rawChannelTypes,
      type: ComponentType.ChannelSelect,
    };
  }

  protected get rawChannelTypes() {
    if (this.channelTypes === undefined) return undefined;
    return Array.isArray(this.channelTypes)
      ? this.channelTypes
      : [this.channelTypes];
  }
}
