import {
  signTransaction,
  setAllowed,
  getAddress,
  requestAccess,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org");
const networkPassphrase = StellarSdk.Networks.TESTNET;

export const connectWallet = async () => {
  await requestAccess();
  await setAllowed();
  const { address } = await getAddress();
  return address;
};

export const disconnectWallet = async () => {
  return true;
};

export const getWalletAddress = async () => {
  const { address } = await getAddress();
  return address;
};

export const fetchXlmBalance = async (address) => {
  try {
    const account = await server.loadAccount(address);
    const native = account.balances.find((b) => b.asset_type === "native");
    return native ? native.balance : "0";
  } catch (err) {
    return "0";
  }
};

export const sendXlm = async ({ sender, destination, amount }) => {
  const sourceAccount = await server.loadAccount(sender);

  const tx = new StellarSdk.TransactionBuilder(sourceAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination,
        asset: StellarSdk.Asset.native(),
        amount: String(amount),
      })
    )
    .setTimeout(180)
    .build();

  const signed = await signTransaction(tx.toXDR(), {
    networkPassphrase,
    address: sender,
  });

  if (signed?.error) {
    throw new Error(signed.error);
  }

  const txEnvelope = StellarSdk.TransactionBuilder.fromXDR(
    signed.signedTxXdr,
    networkPassphrase
  );

  const result = await server.submitTransaction(txEnvelope);
  return result;
};