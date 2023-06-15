import React, { useEffect, useState } from "react";
import styles from "../../styles/Dashboard.module.css";
import Navbar from "../Navbar/Navbar";
import useAuthKit from "../../hooks/useAuthKit";
import { ethers } from "ethers";
import { AuthContext } from "../../contexts/AuthContext";

const DashboardLayout = ({ children }) => {
  const { safeAuth, loading } = useAuthKit();
  const [eoa, setEoa] = useState();
  const [signer, setSigner] = useState();
  useEffect(() => {
    if (safeAuth && !loading) {
      safeAuth.signIn().then((response) => {
        setEoa(response.eoa);
        getSigner(safeAuth);
      });
    }
  }, [safeAuth]);

  const getSigner = async (safeAuth) => {
    const ethProvider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );
    setSigner(ethProvider.getSigner());
  };

  if (!eoa) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      <Navbar eoa={eoa} signer={signer} />
      <AuthContext.Provider value={safeAuth}>{children}</AuthContext.Provider>
    </div>
  );
};

export default DashboardLayout;
