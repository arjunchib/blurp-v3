import {
  APIMentionableSelectComponent,
  ComponentType,
} from "discord-api-types/v10";
import { Select } from "./select";

export class MentionableSelect extends Select {
  get raw(): APIMentionableSelectComponent {
    return {
      ...this.baseRaw,
      type: ComponentType.MentionableSelect,
    };
  }
}
