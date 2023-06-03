import { Button, ChatInputInteraction, Controller } from "@blurp/common";
import { MultiplyModel } from "../blurp.gen";

export class MultiplyController extends Controller<MultiplyModel> {
  chatInput(interaction: ChatInputInteraction<MultiplyModel>) {
    interaction.defer();
    setTimeout(() => {
      interaction.followup({
        components: new Button({
          label: "Test",
          style: "primary",
          customId: "sdasd",
        }),
      });
    }, 1000);
  }
}
