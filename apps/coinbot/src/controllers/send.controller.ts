import { ChatInputInteraction, Controller } from "@blurp/common";
import { SendModel } from "../../blurp.gen";
import { Wallet } from "../wallet";
import { AllowedMentionsTypes } from "discord-api-types/v10";

export class SendController extends Controller<SendModel> {
  async chatInput(interaction: ChatInputInteraction<SendModel>) {
    const { amount, to } = interaction.options;
    const fromUser = interaction.raw.member?.user || interaction.raw.user;
    const toUser = interaction.raw.data.resolved?.users?.[to];
    if (!fromUser || !toUser) {
      return interaction.respondWith("Cannot find users!");
    }
    if (fromUser.id === toUser.id) {
      return interaction.respondWith("Cannot send money to yourself!");
    }
    const [fromWallet, toWallet] = await Promise.all([
      Wallet.findOrCreate({
        key: fromUser.id,
        amount: Wallet.DEFAULT_AMOUNT,
      }),
      Wallet.findOrCreate({
        key: to,
        amount: Wallet.DEFAULT_AMOUNT,
      }),
    ]);
    fromWallet.amount -= amount;
    toWallet.amount += amount;
    await Promise.all([fromWallet.save(), toWallet.save()]);
    interaction.respondWith({
      content: `Sent ${Wallet.formatAmount(amount)} coins to <@${toUser.id}>`,
      allowed_mentions: {
        parse: [AllowedMentionsTypes.User],
      },
    });
  }
}
