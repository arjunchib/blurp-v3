import { ChatInputInteraction, Controller } from "@blurp/common";
import { WalletModel } from "../../blurp.gen";
import { Wallet } from "../wallet";

export class WalletController extends Controller<WalletModel> {
  async chatInput(interaction: ChatInputInteraction<WalletModel>) {
    const user = interaction.raw.member?.user || interaction.raw.user;
    if (!user) {
      return interaction.respondWith("Cannot find user!");
    }
    const wallet = await Wallet.findOrCreate({ key: user.id, amount: 10_000 });
    interaction.respondWith(`Your wallet has ${wallet.prettyAmount} coins.`);
  }
}
