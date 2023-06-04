import { APIRoleSelectComponent, ComponentType } from "discord-api-types/v10";
import { Select } from "./select";

export class RoleSelect extends Select {
  get raw(): APIRoleSelectComponent {
    return {
      ...this.baseRaw,
      type: ComponentType.RoleSelect,
    };
  }
}
