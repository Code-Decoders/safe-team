import { Divider } from "@mui/material";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import React, { useEffect } from "react";
import { Button, Icon } from "../../components/GnosisReact";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useRampKit from "../../hooks/useRampKit";
import useTransaction from "../../hooks/useTransaction";
import { generateERC20Tx, getBalance } from "../../lib/erc20";
import styles from "../../styles/Wallet.module.css";

const Wallet = () => {
  const { openStripe } = useRampKit();

  const [uiLoading, setUILoading] = React.useState(false);

  const {
    getPendingTransactions,
    approveTransaction,
    proposeTransaction,
    rejectTransaction,
    loading,
    getEthSigner,
  } = useTransaction();

  const [members, setMembers] = React.useState([]);

  const [pendingTransactions, setPendingTransactions] = React.useState([]);

  const [user, setUser] = React.useState("");

  const [balance, setBalance] = React.useState("");

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
    getBalance(signer).then((balance) =>
      setBalance((balance / 10 ** 18).toFixed(2).toString())
    );
    const address = await signer.getAddress();
    setUser(address);
    const pdtxs = await getPendingTransactions();
    setPendingTransactions(pdtxs.results);
    console.log(pdtxs.results[0]);
  };

  async function getData() {
    // TODO: Fetch Transaction from backend and display them in the table
    setUILoading(true);
    await getTransactions();
    setUILoading(false);
  }

  async function onTransactionApprove(hash) {
    await approveTransaction(hash);
    getData();
  }

  async function onTransactionReject(hash) {
    await rejectTransaction(hash);
    getData();
  }

  useEffect(() => {
    getData();
  }, [loading]);
  return (
    <div className={styles.container}>
      <div style={{ flex: 1 }}>
        <div className={styles.walletContainer}>
          <div className={styles.walletHeader}>Total Balance</div>

          <div className={styles.balance}>
            {"$ "}
            {balance}
          </div>
        </div>
        <div>
          <div className={styles.transaction}>Pending Transactions</div>
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
              <div style={{ width: "100px", display: "flex", gap: "0 10px" }}>
                {tx.confirmations.find((c) => c.owner === user) ? (
                  <div>
                    <Icon
                      type="awaitingConfirmations"
                      size="md"
                      color="pending"
                      tooltip="Awaiting Confirmations"
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => onTransactionApprove(tx.safeTxHash)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Icon
                      type="circleCheck"
                      size="md"
                      color="primary"
                      tooltip="Approve Transaction"
                    />
                  </div>
                )}
                {tx.confirmations.find((c) => c.owner === user) ? (
                  <></>
                ) : (
                  <div
                    onClick={() => onTransactionReject(tx.safeTxHash)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Icon
                      type="circleCross"
                      size="md"
                      color="error"
                      tooltip="Reject Transaction"
                    />
                  </div>
                )}
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
