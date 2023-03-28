import { Divider } from "@mui/material";
import React, { useEffect } from "react";
import { Button, Icon } from "../../components/GnosisReact";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useRampKit from "../../hooks/useRampKit";
import styles from "../../styles/Wallet.module.css";

const Wallet = () => {
  const { openStripe } = useRampKit();

  const [members, setMembers] = React.useState([]);

  const [user, setUser] = React.useState("");

  const stripeRootRef = React.useRef(null);

  const handleAddFunds = async () => {
    await openStripe("0x6e74CFeA3BC9A31656B1A212A7F905572c5B3ee3");
  };

  function getData() {
    // TODO: Fetch Transaction from backend and display them in the table
    setMembers([
      {
        email: "jainkunal976@gmail.com",
        status: "Approved",
      },
      {
        email: "maadhav2001@gmail.com",
        status: "Pending",
      },
      {
        email: "abc@gmail.com",
        status: "Rejected",
      },
    ]);
    setUser("maadhav2001@gmail.com");
  }

  function onTransactionApprove() {}

  function onTransactionReject() {}

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={styles.container}>
      <div style={{ flex: 1 }}>
        <div className={styles.walletContainer}>
          <div className={styles.walletHeader}>Total Balance</div>
          <div className={styles.balance}>$10.00</div>
        </div>
        <div>
          <div className={styles.transaction}>Pending Transaction</div>
          <div className={styles.transactionHeader}>
            <div style={{ width: "100px" }}>ID</div>
            <div className={styles.tableDivider} />
            <div style={{ flex: 1 }}>Email</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "100px" }}>Status</div>
          </div>
          {members.map((member, index) => (
            <div className={styles.transactionMemberTable} key={index}>
              <div style={{ width: "100px" }}>{index + 1}</div>
              <div className={styles.tableDivider} />
              <div style={{ flex: 1 }}>{member.email}</div>
              <div className={styles.tableDivider} />
              <div style={{ width: "100px" }}>
                {member.status == "Approved" && (
                  <Icon type="circleCheck" size="md" color="primary" />
                )}
                {member.status == "Pending" &&
                  (member.email != user ? (
                    <Icon
                      type="awaitingConfirmations"
                      size="md"
                      color="pending"
                    />
                  ) : (
                    <div style={{ display: "flex", gap: "0 10px" }}>
                      <div
                        onClick={onTransactionApprove}
                        style={{ cursor: "pointer" }}
                      >
                        <Icon type="check" size="md" color="primary" />
                      </div>
                      <div
                        onClick={onTransactionReject}
                        style={{ cursor: "pointer" }}
                      >
                        <Icon type="cross" size="md" color="pending" />
                      </div>
                    </div>
                  ))}
                {member.status == "Rejected" && (
                  <Icon type="circleCross" size="md" color="error" />
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
        <Button size="lg">Split</Button>
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
