import React, { useEffect, useState } from "react";
import styles from "../../styles/Navbar.module.css";
import { EthHashInfo, Identicon, Text } from "../GnosisReact";
import NavTab from "./NavTab";
import { ethers } from "ethers";
import { Masa } from "@masa-finance/masa-sdk";

const Navbar = ({ eoa, signer }) => {
  const [isSponsor, setIsSponsor] = useState(true);
  const [soulNames, setSoulNames] = useState([]);
  const [arweaveURLs, setArweaveURLs] = useState([]);

  const getSoulNames = async () => {
    const masa = new Masa({
      signer,
      apiUrl: "https://dev.middleware.masa.finance/",
      environment: "dev",
      networkName: "goerli",
    });
    const address = await signer.getAddress();
    console.log("MASA: ", masa.contracts.instances.SoulNameContract);
    const [soulNames, extension] = await Promise.all([
      // get all soul names by address
      masa.soulName.loadSoulNames(address),
      // get extension for this contract
      masa.contracts.instances.SoulNameContract.extension(),
    ]);

    if (soulNames.length > 0) {
      console.log("Soul names:", "\n");
      let urls = [];
      soulNames.forEach(async (soulName) =>
        urls.push(
          masa.contracts.instances.SoulNameContract["tokenURI(string)"](
            soulName
          )
        )
      );
      urls = await Promise.all(urls);
      setArweaveURLs(urls);
      console.log("URLS: ", urls);
      setSoulNames(soulNames.map((soulName) => `${soulName}${extension}`));
    } else {
      console.log(`No soul names for ${address}`);
    }
  };

  useEffect(() => {
    if (signer) {
      getSoulNames();
    }
  }, [signer]);
  return (
    <div className={styles.container}>
      <Identicon address={eoa} className={styles.avatar} />
      <EthHashInfo
        shortName="matic"
        hash={eoa}
        showCopyBtn
        shortenHash={4}
        className={styles.ethHashInfo}
      />
      <div>
        {soulNames.map((soulName, index) => (
          <EthHashInfo
            key={index}
            hash={soulName}
            showCopyBtn
            explorerUrl={() => ({
              url:
                "https://arweave.net/" + arweaveURLs[index].split("ar://")[1],
            })}
            className={styles.soulName}
          />
        ))}
      </div>
      <div
        style={{
          marginBottom: "20px",
        }}
      />
      {isSponsor ? (
        <>
          {/* <Label style={{ color: "white", fontSize: "20px", fontFamily: "sans-serif", border: "1px solid white", borderRadius: "5px" }}>Sponsor</Label> */}
          <NavTab
            label={"Payout"}
            active={location.pathname == "/dashboard/sponsor"}
            href="/dashboard/sponsor"
          />
          <NavTab
            label={"History"}
            active={location.pathname == "/dashboard/sponsor/history"}
            href="/dashboard/sponsor/history"
          />
        </>
      ) : (
        <>
          <NavTab
            label={"Manage"}
            active={location.pathname == "/dashboard"}
            href="/dashboard"
          />
          <NavTab
            label={"Wallet"}
            active={location.pathname == "/dashboard/wallet"}
            href="/dashboard/wallet"
          />
          <NavTab
            label={"Submit"}
            active={location.pathname == "/dashboard/submit"}
            href="/dashboard/submit"
          />
        </>
      )}
    </div>
  );
};

export default Navbar;
