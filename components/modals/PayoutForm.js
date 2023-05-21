import React, { useState } from "react";
import { GenericModal, Button, TextFieldInput, Select } from "../GnosisReact";

import filecoin from "../../assets/filecoin.png";
import avalanche from "../../assets/avalanche.png";
import polygon from "../../assets/polygon.png";
import ethereum from "../../assets/ethereum.png";
import axelar from "../../assets/axelar.svg";
import circle from "../../assets/circle-dark.svg";


const PayoutForm = ({ handleCloseModal, onSubmit, teamName }) => {
  const [network, setNetwork] = useState("Filecoin");
  const [amount, setAmount] = useState("");

  const handleNetworkChange = (e) => {
    setNetwork(e);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Submitting payout to:", network, amount);
    await onSubmit(amount);
    handleCloseModal();
  };

  return (
    <GenericModal
      isOpen={true}
      onClose={handleCloseModal}
      title={`Payout to: ${teamName}`}
      body={
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px 0",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Select
              id="network-select"
              label="Select Network"
              name="network-select"
              fullWidth
              error={network != "Filecoin"}
              helperText={
                network != "Filecoin" && "Network not supported yet."
              }
              value={network}
              items={[
                {
                  id: "Filecoin",
                  label: "Filecoin",
                  iconUrl: filecoin.src,
                },
                {
                  id: "Avalanche",
                  label: "Avalanche",
                  iconUrl: avalanche.src,
                },
                {
                  id: "Polygon",
                  label: "Polygon",
                  iconUrl: polygon.src,
                },
                {
                  id: "Ethereum",
                  label: "Ethereum",
                  iconUrl: ethereum.src,
                },
              ]}
              activeItemId={"Filecoin"}
              onItemClick={(id) => {
                handleNetworkChange(id);
              }}
              fallbackImage={"https://via.placeholder.com/32x32"} // image source or URL
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px 0",
              marginBottom: "20px",
            }}
          >
            <label htmlFor="amount">Amount</label>
            <TextFieldInput
              hiddenLabel
              placeholder="USDC"
              type="number"
              id="amount"
              size="medium"
              onChange={handleAmountChange}
            />
          </div>
          <div>
            <Button size="md" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span>Powered By</span>
              <img src={axelar.src} width="100" height="auto" />
            </div>
          </div>
        </>
      }
    />
  );
};

export default PayoutForm;
