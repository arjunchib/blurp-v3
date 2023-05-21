import {
  AutocompleteInteraction,
  ChatInputInteraction,
  MessageComponentInteraction,
  MessageInteraction,
  ModalSubmitInteraction,
  Model,
  UserInteraction,
} from "./types";

export interface Controller<M extends Model> {
  chatInput?(interaction: ChatInputInteraction<M>);
  user?(interaction: UserInteraction);
  message?(interaction: MessageInteraction);
  messageComponent?(interaction: MessageComponentInteraction);
  autocomplete?(interaction: AutocompleteInteraction<M>);
  modalSubmit?(interaction: ModalSubmitInteraction);
}

export abstract class Controller<M extends Model> {}
