import { ChatInputInteraction, Controller } from "@blurp/common";
import { MultiplyModel } from "../blurp.gen";

export class MultiplyController extends Controller<MultiplyModel> {
  chatInput(interaction: ChatInputInteraction<MultiplyModel>) {
    interaction.respondWith(interaction.options.a * interaction.options.b);
  }
}
