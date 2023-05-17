import React, { useState } from 'react';
import { Modal, Button, Dropdown, Input } from "../GnosisReact";

const PayoutForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [network, setNetwork] = useState('Filecoin');
  const [amount, setAmount] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNetworkChange = (e) => {
    setNetwork(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    console.log('Submitting payout to:', network, amount);
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpenModal}>Pay</Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>Payout to: Team Name</h2>
        <div>
          <label htmlFor="network">Network</label>
          <Dropdown
            id="network"
            value={network}
            onChange={handleNetworkChange}
            options={[
              { value: 'Filecoin', label: 'Filecoin' },
              { value: 'Avalanche', label: 'Avalanche' },
              { value: 'Polygon', label: 'Polygon' },
            ]}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <Input
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            type="number"
            placeholder="USDC"
          />
        </div>
        <div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
};

export default PayoutForm;