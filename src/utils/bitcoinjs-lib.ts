import { BIP32Interface, fromSeed, fromBase58 } from "bip32";
import { payments, Psbt, networks } from "bitcoinjs-lib";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import coinselect from "coinselect";

import { Address, DecoratedUtxo } from "src/types";

export const getNewMnemonic = (): string => {
  const mnemonic = generateMnemonic(256);
  console.log("output: ", mnemonic);
  return mnemonic;
};

export const getMasterPrivateKey = async (
  mnemonic: string
): Promise<BIP32Interface> => {
  const seed = await mnemonicToSeed(mnemonic);
  const privateKey = fromSeed(seed, networks.testnet);

  console.log(privateKey.toBase58());
  return privateKey;
};

export const getXpubFromPrivateKey = (
  privateKey: BIP32Interface,
  derivationPath: string
): string => {
  const child = privateKey.derivePath(derivationPath).neutered();
  const xpub = child.toBase58();

  console.log(xpub);
  return xpub;
};

export const deriveChildPublicKey = (
  xpub: string,
  derivationPath: string
): BIP32Interface => {
  const node = fromBase58(xpub, networks.testnet);
  const child = node.derivePath(derivationPath);

  return child;
};

export const getP2wpkhAddressFromChildPubkey = (
  child: BIP32Interface
): payments.Payment => {
  /*
  wrapped segwit

  const addr = payments.p2sh({
    redeem: payments.p2wpkh({
      pubkey: child.publicKey,
      network: networks.bitcoin,
    })
  })
  */
 
  const address = payments.p2wpkh({
    pubkey: child.publicKey,
    network: networks.testnet,
  });

  return address;
};

export const createTransasction = async (
  utxos: DecoratedUtxo[],
  recipientAddress: string,
  amountInSatoshis: number,
  changeAddress: Address
): Promise<Psbt> => {
  const { inputs, outputs, fee } = coinselect(
    utxos,
    [{address: recipientAddress, value: amountInSatoshis},],
    1
  );

  if (!inputs || !outputs) throw new Error("Unable to construct transaction");
  if (fee > amountInSatoshis) throw new Error("Fee is too high");

  const psbt = new Psbt({network: networks.testnet});
  psbt.setVersion(2);
  psbt.setLocktime(0);

  inputs.forEach((input) => {
    psbt.addInput({
      hash: input.txid,
      index: input.vout,
      sequence: 0xfffffffd,
      witnessUtxo: {
        value: input.value,
        script: input.address.output!,
      },
      bip32Derivation: input.bip32Derivation,
    });
  });

  outputs.forEach((output) => {
    if (!output.address) {
      output.address = changeAddress.address!;
    }

    psbt.addOutput({
      address: output.address,
      value: output.value,
    });
  });

  return psbt;
};

export const signTransaction = async (
  psbt: any,
  mnemonic: string
): Promise<Psbt> => {
  const seed = await mnemonicToSeed(mnemonic);
  const root = fromSeed(seed, networks.testnet);

  psbt.signAllInputsHD(root);
  psbt.validateSignaturesOfAllInputs();
  psbt.finalizeAllInputs();
  return psbt;
};
