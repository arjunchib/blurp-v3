import { runtimeAdapter } from "./runtime";

interface WalletKV {
  amount: number;
}

export type WalletData = WalletKV & { key: string };

export class Wallet implements WalletData {
  key: string;
  amount: number;

  private static numberFormatter = new Intl.NumberFormat();

  /** Starting amount in every wallet */
  static DEFAULT_AMOUNT = 10_000;

  /** Find wallet matching key */
  static async find(key: string) {
    const walletData = await runtimeAdapter.env.WALLET.get<WalletKV>(key, {
      type: "json",
    });
    return walletData ? new Wallet({ ...walletData, key }) : null;
  }

  /** Build and save new wallet */
  static async create(data: WalletData) {
    const wallet = new Wallet(data);
    await wallet.save();
    return wallet;
  }

  /** Find a wallet matching key or create a new wallet with data */
  static async findOrCreate(data: WalletData) {
    const wallet = await Wallet.find(data.key);
    return wallet ?? (await Wallet.create(data));
  }

  static formatAmount(value: number) {
    return Wallet.numberFormatter.format(value);
  }

  constructor(data: WalletData) {
    this.key = data.key;
    this.amount = data.amount;
  }

  /** Upload wallet */
  async save() {
    return await runtimeAdapter.env.WALLET.put(
      this.key,
      JSON.stringify(this.toDataKV())
    );
  }

  get prettyAmount() {
    return Wallet.formatAmount(this.amount);
  }

  private toDataKV(): WalletKV {
    return {
      amount: this.amount,
    };
  }
}
