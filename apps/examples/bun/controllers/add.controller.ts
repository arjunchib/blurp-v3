import { ChatInputInteraction, Controller } from "@blurp/common";
import { AddModel } from "../blurp.gen";

export class AddController extends Controller<AddModel> {
  chatInput(interaction: ChatInputInteraction<AddModel>) {
    interaction.respondWith({
      content: `${interaction.options.a + interaction.options.b}`,
    });
  }
}
