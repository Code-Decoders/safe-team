import { Divider } from "@mui/material";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Icon,
  GenericModal,
  TextFieldInput,
} from "../../components/GnosisReact";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PayoutForm from "../../components/modals/PayoutForm";
import styles from "../../styles/Wallet.module.css";
import { Polybase } from "@polybase/client";
import { ethers } from "ethers";
import useAxelar from "../../hooks/useAxelar";
import useSocialConnect from "../../hooks/useSocialConnect";
import { VerifyPhone } from "../../components/modals/VerifyPhone";
import { AuthContext } from "../../contexts/AuthContext";

const db = new Polybase({
  defaultNamespace:
    "pk/0x0a9f3867b6cd684ca2fbe94831396cbbfaf2a11d47f87ff8d49c6f5a58edf7e940cd0f4804294fa7b72b5a504711817f4a62681e6e9ff2be3f8a936bffdf312e/Safe4",
});

const Sponsor = () => {
  const safeAuth = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);
  const { registerIssuerAccountAndDEK, registerNumber, fetchAccounts } =
    useSocialConnect();
  const { execute } = useAxelar();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let result = [];
      const records = await db.collection("Team").get();
      console.log("Records", records);
      result = records.data;
      result = result.filter(
        (team) =>
          team.data.name == "CodeDecoders" ||
          team.data.name == "Nova" ||
          team.data.name == "test20"
      );
      //setTeams(records.data);
      setTeams(result);
    };

    fetchData();
  }, []);

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
          <div className={styles.tableContainer}>
            {teams.map((team, index) => (
              <div key={team.id} className={styles.transactionMemberTable}>
                <div style={{ width: "100px" }}>{index + 1}</div>
                <div className={styles.tableDivider} />
                <div style={{ width: "200px" }}>{team.data.name}</div>
                <div className={styles.tableDivider} />
                <div style={{ flex: 1 }}>{team.data.safew}</div>
                <div className={styles.tableDivider} />
                <div
                  style={{ width: "130px", display: "flex", gap: "0 10px" }}
                  onClick={() => {}}
                >
                  <Button
                    size="md"
                    variant="contained"
                    onClick={async () => {
                      setSelectedTeam(team);
                      setShowVerifyPhone(true);
                    }}
                  >
                    Pay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showModal && selectedTeam && (
        <PayoutForm
          size="md"
          variant="contained"
          onSubmit={async (amount) => {
            console.log("Submitting payout");
            const amountInWei = ethers.utils.parseUnits(amount, 18);
            console.log(
              `Amount: ${amountInWei}, Receiver: ${selectedTeam.data.safew}`
            );
            await execute({
              amount: amountInWei,
              receiver: selectedTeam.data.safew,
            });
          }}
          handleCloseModal={() => {
            setShowModal(false);
          }}
          teamName={selectedTeam.data.name}
        />
      )}
      {showVerifyPhone && (
        <VerifyPhone
          safeAuth={safeAuth}
          onClose={() => setShowVerifyPhone(false)}
          onVerified={() => {
            setShowVerifyPhone(false);
            setShowModal(true);
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
