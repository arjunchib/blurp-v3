import {
  AutocompleteInteraction,
  ChatInputInteraction,
  MessageComponentInteraction,
  MessageInteraction,
  ModalSubmitInteraction,
  Model,
  UserInteraction,
} from "./types";

export interface Controller<M extends Model = Model> {
  chatInput?(interaction: ChatInputInteraction<M>): void;
  user?(interaction: UserInteraction): void;
  message?(interaction: MessageInteraction): void;
  messageComponent?(interaction: MessageComponentInteraction): void;
  autocomplete?(interaction: AutocompleteInteraction<M>): void;
  modalSubmit?(interaction: ModalSubmitInteraction): void;
}

export abstract class Controller<M extends Model> {}
