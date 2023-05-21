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

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let result = [];
      const records = await db.collection("Team").get(); 
      console.log("Records", records)
      result = records.data;
      result = result.filter((team) => team.data.name == "CodeDecoders" || team.data.name == "Nova" || team.data.name == "test20");
      //setTeams(records.data);
      setTeams(result);
    };
    
    fetchData();
  }, []);


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
          <div className={styles.tableContainer}>
          {teams.map((team, index) => (
          <div key={team.id} className={styles.transactionMemberTable}>
            <div style={{ width: "100px" }}>{index + 1}</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "200px" }}>{team.data.name}</div>
            <div className={styles.tableDivider} />
            <div style={{ flex: 1 }}>
            {team.data.safew}
            </div>
            <div className={styles.tableDivider} />
            <div
              style={{ width: "130px", display: "flex", gap: "0 10px" }}
              onClick={() => {}}
            >
              <Button
                size="md"
                variant="contained"
                onClick={() => {setShowModal(true); setSelectedTeam(team);}}
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
            const amountInWei = ethers.utils.parseUnits(amount, 6);

            await executeTransfer({
              amount,
              amount: amountInWei,
              destionationAddress: selectedTeam.data.safew,
            });
          }}
          handleCloseModal={() => {
            setShowModal(false);
          }}
          teamName={selectedTeam.data.name}
        />
      )}
    </div>
  );
};

Sponsor.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Sponsor;
