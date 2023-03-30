import { Divider } from "@mui/material";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import React, { useEffect } from "react";
import { Button, Icon } from "../../components/GnosisReact";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useRampKit from "../../hooks/useRampKit";
import useTransaction from "../../hooks/useTransaction";
import generateERC20Tx from "../../lib/erc20";
import styles from "../../styles/Wallet.module.css";

const Wallet = () => {
  const { openStripe } = useRampKit();

  const [uiLoading, setUILoading] = React.useState(false);

  const {
    getPendingTransactions,
    approveTransaction,
    proposeTransaction,
    loading,
    getEthSigner,
  } = useTransaction();

  const [members, setMembers] = React.useState([]);

  const [pendingTransactions, setPendingTransactions] = React.useState([
    {
      safe: "0xCB8eC99b9647c23C0F52D30f320bBf60a33D08B6",
      to: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
      value: "0",
      data: "0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000013200466595626333c55fa7d7ad6265d46ba5fdbbdd9900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000f96b7ffd86d10106e986ddafaefb02c6ef4424dd0000000000000000000000000000000000000000000000000de0b6b3a764000000466595626333c55fa7d7ad6265d46ba5fdbbdd9900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000004fd3d5db6691c94dbe26302a1b49de25410bccb50000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000",
      operation: 1,
      gasToken: "0x0000000000000000000000000000000000000000",
      safeTxGas: 0,
      baseGas: 0,
      gasPrice: "0",
      refundReceiver: "0x0000000000000000000000000000000000000000",
      nonce: 10,
      executionDate: null,
      submissionDate: "2023-03-30T03:20:10.754449Z",
      modified: "2023-03-30T03:20:11.549010Z",
      blockNumber: null,
      transactionHash: null,
      safeTxHash:
        "0x034024d60969f20f5f6e8ddf46f960206187a60ff1310514c51863ac28ad62de",
      executor: null,
      isExecuted: false,
      isSuccessful: null,
      ethGasPrice: null,
      maxFeePerGas: null,
      maxPriorityFeePerGas: null,
      gasUsed: null,
      fee: null,
      origin: "SafeTeam",
      dataDecoded: {
        method: "multiSend",
        parameters: [
          {
            name: "transactions",
            type: "bytes",
            value:
              "0x00466595626333c55fa7d7ad6265d46ba5fdbbdd9900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000f96b7ffd86d10106e986ddafaefb02c6ef4424dd0000000000000000000000000000000000000000000000000de0b6b3a764000000466595626333c55fa7d7ad6265d46ba5fdbbdd9900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000004fd3d5db6691c94dbe26302a1b49de25410bccb50000000000000000000000000000000000000000000000000de0b6b3a7640000",
            valueDecoded: [
              {
                operation: 0,
                to: "0x466595626333c55fa7d7Ad6265D46bA5fDbBDd99",
                value: "0",
                data: "0xa9059cbb000000000000000000000000f96b7ffd86d10106e986ddafaefb02c6ef4424dd0000000000000000000000000000000000000000000000000de0b6b3a7640000",
                dataDecoded: {
                  method: "transfer",
                  parameters: [
                    {
                      name: "to",
                      type: "address",
                      value: "0xF96b7fFd86d10106e986DdAfaefb02c6ef4424dd",
                    },
                    {
                      name: "value",
                      type: "uint256",
                      value: "1000000000000000000",
                    },
                  ],
                },
              },
              {
                operation: 0,
                to: "0x466595626333c55fa7d7Ad6265D46bA5fDbBDd99",
                value: "0",
                data: "0xa9059cbb0000000000000000000000004fd3d5db6691c94dbe26302a1b49de25410bccb50000000000000000000000000000000000000000000000000de0b6b3a7640000",
                dataDecoded: {
                  method: "transfer",
                  parameters: [
                    {
                      name: "to",
                      type: "address",
                      value: "0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5",
                    },
                    {
                      name: "value",
                      type: "uint256",
                      value: "1000000000000000000",
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      confirmationsRequired: 2,
      confirmations: [
        {
          owner: "0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5",
          submissionDate: "2023-03-30T03:20:11.549010Z",
          transactionHash: null,
          signature:
            "0x485aa10d099f4e3708aedaaeebc55289bfbb1ae19bf8e6f70975e310dae8c0870ef7a820a0b4b854e12d14b3e846c8cfec7528595cf4d952fa840f7324a1cd5c1f",
          signatureType: "ETH_SIGN",
        },
      ],
      trusted: true,
      signatures: null,
    },
  ]);

  const [user, setUser] = React.useState("");

  const stripeRootRef = React.useRef(null);

  const handleAddFunds = async () => {
    await openStripe("0x6e74CFeA3BC9A31656B1A212A7F905572c5B3ee3");
  };

  const handleSplitFunds = async () => {
    const signer = await getEthSigner();
    const data1 = await generateERC20Tx(
      "0xF96b7fFd86d10106e986DdAfaefb02c6ef4424dd",
      "1",
      signer
    );
    const data2 = await generateERC20Tx(
      "0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5",
      "1",
      signer
    );

    const safeTransactionData = [
      {
        to: data1.to,
        data: data1.data,
        value: "0",
        operation: OperationType.Call,
      },
      {
        to: data2.to,
        data: data2.data,
        value: "0",
        operation: OperationType.Call,
      },
    ];
    // await proposeTransaction(safeTransactionData);

    // const pdtxs = await getPendingTransactions();
    // console.log(pdtxs.results[0]);
    // approveTransaction(pdtxs.results[0].safeTxHash);
  };

  const getTransactions = async () => {
    if (loading) return;
    const signer = await getEthSigner();
    const address = await signer.getAddress();
    setUser(address);
    // const pdtxs = await getPendingTransactions();
    // setPendingTransactions(pdtxs.results);
    // console.log(pdtxs.results[0]);
  };

  async function getData() {
    // TODO: Fetch Transaction from backend and display them in the table
    setUILoading(true);
    await getTransactions();
    setUILoading(false);
  }

  function onTransactionApprove(hash) {
    approveTransaction(pdtxs.results[0].safeTxHash);
  }

  function onTransactionReject(hash) { }

  useEffect(() => {
    getData();
  }, [loading]);
  return (
    <div className={styles.container}>
      <div style={{ flex: 1 }}>
        <div className={styles.walletContainer}>
          <div className={styles.walletHeader}>Total Balance</div>

          <div className={styles.balance}>{
            // TODO: Fetch balance from backend @Maadhav
          }$10.00</div>
        </div>
        <div>
          <div className={styles.transaction}>Pending Transaction</div>
          <div className={styles.transactionHeader}>
            <div style={{ width: "100px" }}>Nonce</div>
            <div className={styles.tableDivider} />
            <div style={{ flex: 1 }}>Method</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "200px" }}>Confirmations</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "100px" }}>Actions</div>
          </div>
          {pendingTransactions.map((tx, index) => (
            <div className={styles.transactionMemberTable} key={index}>
              <div style={{ width: "100px" }}>{tx.nonce}</div>
              <div className={styles.tableDivider} />
              <div style={{ flex: 1 }}>{tx.dataDecoded.method}</div>
              <div className={styles.tableDivider} />
              <div style={{ width: "200px" }}>
                {tx.confirmations.length}
                {"/"}
                {tx.confirmationsRequired}
              </div>
              <div className={styles.tableDivider} />
              <div style={{ width: '100px', display: 'flex', gap: '0 10px' }}>
                {
                  tx.confirmations.find((c) => c.owner === '0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5') ?
                    <div><Icon type="awaitingConfirmations" size="md" color="pending" /></div> : <div onClick={onTransactionApprove}>
                      <Icon type='check' size='md' color='primary' />
                    </div>
                }
                {
                  tx.confirmations.find((c) => c.owner === '0x4FD3d5db6691c94DBe26302A1b49dE25410bCCb5') ? <></> :
                    <div onClick={onTransactionReject}>
                      <Icon type='cross' size='md' color='error' />
                    </div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.divider} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px 0" }}>
        <Button size="lg" onClick={handleAddFunds}>
          Add
        </Button>
        <Divider />
        <Button size="lg" onClick={handleSplitFunds}>
          Split
        </Button>
        <Divider />
        <Button size="lg">Stream</Button>
        <Divider />
        <Button size="lg">Stake</Button>
      </div>
      <div
        id="stripe-root"
        ref={stripeRootRef}
        style={{
          zIndex: 1000,
        }}
      ></div>
    </div>
  );
};

Wallet.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Wallet;
