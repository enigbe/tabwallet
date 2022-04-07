import axios from 'axios'; 

import {
  Address,
  BlockstreamAPITransactionResponse,
  BlockstreamAPIUtxoResponse,
} from "src/types";

export const getTransactionsFromAddress = async (
  address: Address
): Promise<BlockstreamAPITransactionResponse[]> => {

  const BASE_URL = 'https://blockstream.info/testnet/api';
  const { data } = await axios.get(`${BASE_URL}/${address}/txs`);

  console.log('data')
  return data;
};

export const getUtxosFromAddress = async (
  address: Address
): Promise<BlockstreamAPIUtxoResponse[]> => {
  throw new Error("Function not implemented yet");
};

export const getFeeRates = async () => {
  throw new Error("Function not implemented yet");
};

export const broadcastTx = async (txHex: string) => {
  throw new Error("Function not implemented yet");
};
