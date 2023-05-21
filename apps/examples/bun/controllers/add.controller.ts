import { ChatInputInteraction, Controller } from "@blurp/common";
import { Add } from "../blurp.gen";

export default class AddController extends Controller<Add> {
  chatInput(interaction: ChatInputInteraction<Add>) {
    interaction.respondWith({
      content: `${interaction.options.a + interaction.options.b}`,
    });
  }
}
