import { APIUserSelectComponent, ComponentType } from "discord-api-types/v10";
import { Select } from "./select";

export class UserSelect extends Select {
  get raw(): APIUserSelectComponent {
    return {
      ...this.baseRaw,
      type: ComponentType.UserSelect,
    };
  }
}
