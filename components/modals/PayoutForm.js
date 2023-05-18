import React, { useState } from "react";
import {
  GenericModal,
  Button,
  Dropdown,
  Input,
  TextFieldInput,
  Select,
} from "../GnosisReact";

import filecoin from "../../assets/filecoin.png";
import avalanche from "../../assets/avalanche.png";
import polygon from "../../assets/polygon.png";
import ethereum from "../../assets/ethereum.png";

const PayoutForm = ({ handleCloseModal }) => {
  const [network, setNetwork] = useState("Filecoin");
  const [amount, setAmount] = useState("");

  const handleNetworkChange = (e) => {
    setNetwork(e);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    console.log("Submitting payout to:", network, amount);
    handleCloseModal();
  };

  return (
    <GenericModal
      isOpen={true}
      onClose={handleCloseModal}
      title={"Payout to: Team Name"}
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
              size="md"
              onChange={handleAmountChange}
            />
          </div>
          <div>
            <Button size="md" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </>
      }
    />
  );
};

export default PayoutForm;
