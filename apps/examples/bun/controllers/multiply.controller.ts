import {
  Button,
  ChannelSelect,
  ChatInputInteraction,
  Controller,
  StringSelect,
  ChannelType,
  RoleSelect,
  UserSelect,
  MentionableSelect,
} from "@blurp/common";
import { MultiplyModel } from "../blurp.gen";

export class MultiplyController extends Controller<MultiplyModel> {
  chatInput(interaction: ChatInputInteraction<MultiplyModel>) {
    interaction.respondWith({
      components: [
        [new RoleSelect({ customId: "as2" })],
        [new UserSelect({ customId: "asd" })],
        [new MentionableSelect({ customId: "asd2" })],
      ],
    });
  }
}
