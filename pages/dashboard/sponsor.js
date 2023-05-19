import { Divider } from "@mui/material";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import React, { useEffect, useState } from "react";
import {
  Button,
  Icon,
  GenericModal,
  TextFieldInput,
} from "../../components/GnosisReact";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PayoutForm from "../../components/modals/PayoutForm";
import useAuthKit from "../../hooks/useAuthKit";
import styles from "../../styles/Wallet.module.css";
import { Polybase } from "@polybase/client";
import useSuperfluid from "../../hooks/useSuperfluid";
import { ethers } from "ethers";
import useCCTP from "../../hooks/useCCTP";

const db = new Polybase({
  defaultNamespace:
    "pk/0x0a9f3867b6cd684ca2fbe94831396cbbfaf2a11d47f87ff8d49c6f5a58edf7e940cd0f4804294fa7b72b5a504711817f4a62681e6e9ff2be3f8a936bffdf312e/Safe4",
});

const Sponsor = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { executeTransfer } = useCCTP();
  

  // useEffect(() => {
  //   if (safeAuth) {
  //     getData();
  //   }
  // }, [safeAuth]);

  // const getData = async () => {
  //   const signInInfo = await safeAuth.signIn();
  //   console.log(signInInfo);
  //   const provider = new ethers.providers.Web3Provider(
  //     await safeAuth.getProvider()
  //   );
  //   const balance = await provider.getBalance(signInInfo.eoa);
  //   const chainId = await provider.getNetwork().then((res) => res.chainId);
  //   console.log("BALANCE", balance.toString(), "\nCHAIN ID", chainId);
  // };

  return (
    <div className={styles.container}>
      <div style={{ flex: 1 }}>
        <div>
          <div className={styles.transaction}>Eligible Teams</div>
          <div className={styles.transactionHeader}>
            <div style={{ width: "100px" }}>#</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "200px" }}>Team Name</div>
            <div className={styles.tableDivider} />
            <div style={{ flex: 1 }}>Address</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "130px" }}>Actions</div>
          </div>
          <div className={styles.transactionMemberTable}>
            <div style={{ width: "100px" }}>1</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "200px" }}>abcd</div>
            <div className={styles.tableDivider} />
            <div style={{ flex: 1 }}>
              0x4345dd3bf7c66f71f86b026336cc6c091730e0f4
            </div>
            <div className={styles.tableDivider} />
            <div
              style={{ width: "130px", display: "flex", gap: "0 10px" }}
              onClick={() => {}}
            >
              <Button
                size="md"
                variant="contained"
                onClick={() => setShowModal(true)}
              >
                Pay
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <PayoutForm
          size="md"
          variant="contained"
          onSubmit={async (amount) => {
            console.log("Submitting payout");

            await executeTransfer({
              amount,
              // todo: get this from the list of eligible teams
              destionationAddress: "0xf80F2427448c2E136F8bC608f02e0625ce5c9646",
            });
          }}
          handleCloseModal={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

Sponsor.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Sponsor;
