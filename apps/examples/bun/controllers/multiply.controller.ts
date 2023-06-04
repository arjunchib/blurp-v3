import {
  Button,
  ChatInputInteraction,
  Controller,
  StringSelect,
} from "@blurp/common";
import { MultiplyModel } from "../blurp.gen";

export class MultiplyController extends Controller<MultiplyModel> {
  chatInput(interaction: ChatInputInteraction<MultiplyModel>) {
    interaction.respondWith({
      components: new StringSelect({
        customId: "asd",
        options: ["one", "two", "three"],
      }),
    });
  }
}
