import { Divider } from "@mui/material";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import React, { useEffect } from "react";
import {
  Button,
  Icon,
  GenericModal,
  TextFieldInput,
} from "../../components/GnosisReact";
import DashboardLayout from "../../components/layout/DashboardLayout";
import useRampKit from "../../hooks/useRampKit";
import useTransaction from "../../hooks/useTransaction";
import styles from "../../styles/Wallet.module.css";
import { Polybase } from "@polybase/client";
import useSuperfluid from "../../hooks/useSuperfluid";
import { ethers } from "ethers";

const db = new Polybase({
  defaultNamespace:
    "pk/0x0a9f3867b6cd684ca2fbe94831396cbbfaf2a11d47f87ff8d49c6f5a58edf7e940cd0f4804294fa7b72b5a504711817f4a62681e6e9ff2be3f8a936bffdf312e/Safe4",
});

const Wallet = () => {
  return (
    <div className={styles.container}>
      <div style={{ flex: 1 }}>
        <div>
          <div className={styles.transaction}>Eligible Teams</div>
          <div className={styles.transactionHeader}>
            <div style={{ width: "100px" }}>#</div>
            <div className={styles.tableDivider} />
            <div style={{ flex: 1 }}>Team Name</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "200px" }}>Address</div>
            <div className={styles.tableDivider} />
            <div style={{ width: "100px" }}>Actions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Wallet.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Wallet;
