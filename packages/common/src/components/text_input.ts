import {
  APITextInputComponent,
  ComponentType,
  TextInputStyle,
} from "discord-api-types/v10";

export interface TextInputOptions {
  /** Developer-defined identifier for the input; max 100 characters */
  customId: string;
  /** The Text Input Style */
  style: "short" | "paragraph";
  /** Label for this component; max 45 characters */
  label: string;
  /** Minimum input length for a text input; min 0, max 4000 */
  minLength?: number;
  /** Maximum input length for a text input; min 1, max 4000 */
  maxLength?: number;
  /** Whether this component is required to be filled (defaults to true) */
  required?: boolean;
  /** Pre-filled value for this component; max 4000 characters */
  value?: string;
  /** Custom placeholder text if the input is empty; max 100 characters */
  placeholder?: string;
}

export class TextInput implements TextInputOptions {
  customId: string;
  style: "short" | "paragraph";
  label: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  value?: string;
  placeholder?: string;

  constructor(options: TextInputOptions) {
    this.customId = options.customId;
    this.style = options.style;
    this.label = options.label;
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;
    this.required = options.required;
    this.value = options.value;
    this.placeholder = options.placeholder;
  }

  get raw(): APITextInputComponent {
    return {
      type: ComponentType.TextInput,
      custom_id: this.customId,
      style: this.rawStyle,
      label: this.label,
      min_length: this.minLength,
      max_length: this.maxLength,
      required: this.required,
      value: this.value,
      placeholder: this.placeholder,
    };
  }

  protected get rawStyle(): TextInputStyle {
    switch (this.style) {
      case "short":
        return TextInputStyle.Short;
      case "paragraph":
        return TextInputStyle.Paragraph;
    }
  }
}
