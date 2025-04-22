import React, { useState } from 'react';
import styled from 'styled-components';
import { agents } from '../utils/mockData';
import {
  TxRaw,
  MsgSend,
  BaseAccount,
  TxRestClient,
  ChainRestAuthApi,
  createTransaction,
  CosmosTxV1Beta1Tx,
  BroadcastModeKeplr,
  ChainRestTendermintApi,
  getTxRawFromTxRawOrDirectSignResponse,
} from "@injectivelabs/sdk-ts";
import { getStdFee, DEFAULT_BLOCK_TIMEOUT_HEIGHT } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { BigNumberInBase } from "@injectivelabs/utils";
import { TransactionException } from "@injectivelabs/exceptions";
import { SignDoc } from "@keplr-wallet/types";

const AgentMVPContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  height: calc(100vh - 80px);
`;

const AgentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
`;

const TradingPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.card};
  border-radius: 1rem;
  padding: 2rem;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ type, theme }) => (type === 'buy' ? 'green' : theme.danger)};
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ExecuteButton = styled(Button)`
  width: 100%;
  padding: 0.75rem; // Same as Button
  margin-top: 1rem;
  align-self: stretch;
  height:3rem;
  min-height: 3rem;
  max-height: 3rem;
  line-height: 1.2;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  background: ${({ theme }) => theme.backgroundTertiary};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`;

const TokenSwitch = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const AmountButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
`;

const AmountButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
  }
`;

const alphaAgent = agents.find(agent => agent.name === 'AlphaAgent');

const getKeplr = async (chainId) => {
  await window.keplr.enable(chainId);

  const offlineSigner = window.keplr.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  const key = await window.keplr.getKey(chainId);

  return { offlineSigner, accounts, key, sendTx: window.keplr.sendTx };
};

const broadcastTx = async (chainId, txRaw) => {
  const keplr = await getKeplr(chainId);
  const result = await keplr.sendTx(
    chainId,
    CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
    BroadcastModeKeplr.Sync
  );

  if (!result || result.length === 0) {
    throw new TransactionException(
      new Error("Transaction failed to be broadcasted"),
      { contextModule: "Keplr" }
    );
  }
};

const AgentMVP = ({ walletConnected, walletAddress }) => {
  const [tokenType, setTokenType] = useState('INJ');
  const [amount, setAmount] = useState('');

  const handleTransaction = async (type) => {
    if (!walletConnected) {
      alert('Please connect your wallet to proceed.');
      return;
    }
    try {
      const contractAddress = 'inj12g9jfpjmd3xk2k3zel3hky75lve3w82u5hp5rq'; // TODO: Replace with actual contract address
      const chainId = 'injective-888';
      const feeAmount = '10000000000000000'; // 0.01 INJ in attoinj
      const gas = 20000000;
      const amountInAttoInj = '1000000000000000000'; // 1 INJ in attoinj

      // Connect Keplr wallet
      const keplrWallet = await getKeplr(chainId); // Fixed: await getKeplr
      const injAddress = keplrWallet.accounts[0].address; // Fixed: get address from accounts

      // Prepare message
      const msg = {
        sender: injAddress,
        contractAddress: contractAddress,
        msg: { buy: {} },
        funds: [
          {
            denom: 'inj',
            amount: amountInAttoInj,
          },
        ],
      };

      // Broadcast transaction
      const result = await broadcastTx(chainId, msg)
      
      console.log('Transaction result:', result);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    }
  };

  return (
    <AgentMVPContainer>
      <AgentInfo>
        <img src={alphaAgent.avatar} alt={alphaAgent.name} style={{ width: '150px', borderRadius: '50%' }} />
        <h2>{alphaAgent.name}</h2>
        <p>Token Value: ${alphaAgent.tokenValue.toFixed(2)}</p>
        <p>Wallet Balance: ${alphaAgent.walletBalance.toFixed(2)}</p>
        <p>Market Cap: ${alphaAgent.marketCap.toLocaleString()}</p>
      </AgentInfo>

      <TradingPanel>
        <ButtonGroup>
          <Button type="buy" onClick={() => setTokenType('INJ')}>
            Buy ALPHA
          </Button>
          <Button type="sell" onClick={() => setTokenType('ALPHA')}>
            Sell ALPHA
          </Button>
        </ButtonGroup>

        <InputGroup>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            style={{ flex: 1, border: 'none', background: 'transparent', color: 'white' }}
          />
          <span>{tokenType}</span>
        </InputGroup>

        <ExecuteButton
          type="connect"
          style={{ background: walletConnected ? 'green' : 'gray' }}
          onClick={() => walletConnected && handleTransaction('buy')}
          disabled={!walletConnected}
        >
          {walletConnected ? 'Execute Trade' : 'Connect Wallet to Trade'}
        </ExecuteButton>

        <div style={{ flex: 1 }}></div>
      </TradingPanel>
    </AgentMVPContainer>
  );
};

export default AgentMVP;