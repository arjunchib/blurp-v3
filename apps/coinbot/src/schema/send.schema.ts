import { Schema } from "@blurp/common";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

export const SendSchema = {
  name: "send",
  description: "send coins to someone",
  options: [
    {
      name: "amount",
      description: "number of coins to send",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "to",
      description: "user to send money to",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
} satisfies Schema;
