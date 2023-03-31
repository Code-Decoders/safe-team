import { Divider } from "@mui/material";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import React, { useEffect } from "react";
import { Button, Icon } from "../../components/GnosisReact";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useRampKit from "../../hooks/useRampKit";
import useTransaction from "../../hooks/useTransaction";
import { generateERC20Tx, getBalance } from "../../lib/erc20";
import styles from "../../styles/Wallet.module.css";
import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace:
    "pk/0x0a9f3867b6cd684ca2fbe94831396cbbfaf2a11d47f87ff8d49c6f5a58edf7e940cd0f4804294fa7b72b5a504711817f4a62681e6e9ff2be3f8a936bffdf312e/Safe5",
});

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

  const [safeAddress, setSafeAddress] = React.useState("");

  const handleAddFunds = async () => {
    await openStripe(safeAddress);
  };

  const handleSplitFunds = async () => {
    const signer = await getEthSigner();
    const safeTransactionData = [];
    for (let i = 0; i < members.length; i++) {
      const data = await generateERC20Tx(
        members[i],
        (balance / members.length).toString(),
        signer
      );
      safeTransactionData.push({
        to: data.to,
        data: data.data,
        value: "0",
        operation: OperationType.Call,
      });
    }
    await proposeTransaction(safeTransactionData);
    getTransactions();
  };

  const getTransactions = async () => {
    if (loading) return;
    const signer = await getEthSigner();
    const address = await signer.getAddress();

    let userData = await db.collection("User").record(address).get();
    let teamData = await db.collection("Team").record(userData.data.team).get();
    const safeAdd = teamData.data.safew;
    setSafeAddress(safeAdd);
    let i = 0;
    let len = teamData.data.members.length;
    console.log("Len", len);
    let d = [];
    while (i < len) {
      let member = teamData.data.members[i].id;
      const det = await db.collection("Details").record(member).get();
      d.push(det.data);
      i = i + 1;
    }
    const validMembers = d
      .filter((member) => member.status === "Approved")
      .map((member) => member.id);
    console.log("d", validMembers);
    setMembers(validMembers);

    console.log(safeAdd);

    getBalance(signer, safeAdd).then((balance) =>
      setBalance((balance / 10 ** 18).toFixed(2).toString())
    );
    setUser(address);
    const pdtxs = await getPendingTransactions(safeAdd);
    setPendingTransactions(pdtxs.results);
    console.log(pdtxs.results);
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
                  <div onClick={() => onTransactionApprove(tx.safeTxHash)}>
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
