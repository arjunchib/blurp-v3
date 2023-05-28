export interface SendModel {
  options: {
    /** number of coins to send */
    amount: number,
    /** user to send money to */
    to: string,
  };
}

export interface WalletModel {}
