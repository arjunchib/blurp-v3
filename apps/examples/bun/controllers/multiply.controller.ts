import { ChatInputInteraction, Controller } from "@blurp/common";
import { MultiplyModel } from "../blurp.gen";

export class MultiplyController extends Controller<MultiplyModel> {
  chatInput(interaction: ChatInputInteraction<MultiplyModel>) {
    interaction.defer();
    setTimeout(() => {
      interaction.followup(interaction.options.a * interaction.options.b);
    }, 1000);
  }
}
