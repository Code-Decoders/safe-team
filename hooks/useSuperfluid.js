import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useSuperfluid = () => {
  const [sf, setSF] = useState();
  const [fUSDCx, setFUSDCx] = useState();
  const [signer, setSigner] = useState();
  const [sfLoaded, setSfLoaded] = useState(false);

  async function init(signer) {
    const provider = signer.provider;
    const chainId = await provider.getNetwork().then((res) => res.chainId);
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });

    const superSigner = sf.createSigner({ signer: signer });

    setFUSDCx(await sf.loadSuperToken("fUSDCx"));

    console.log("address", await signer.getAddress());

    setSigner(signer);
    setSF(sf);
    setSfLoaded(true);
    return { sf, superSigner };
  }

  const calculateFlowRate = (amount) => {
    let fr = amount / (86400 * 30);
    return Math.floor(fr);
  };

  const createApproveTx = async (amount) => {
    const fusdc = fUSDCx.underlyingToken.contract.connect(signer);
    return await fusdc.populateTransaction.approve(
      fUSDCx.address,
      ethers.utils.parseUnits(amount, 18)
    );
  };

  const createTransferTx = async (amount, to) => {
    const fusdc = fUSDCx.underlyingToken.contract.connect(signer);

    return await fusdc.populateTransaction.transfer(
      to,
      ethers.utils.parseUnits(amount, 18)
    );
  };

  const createFlowTx = async (amount, from, members) => {
    const txs = [
      fUSDCx.upgrade({
        amount: ethers.utils.parseUnits(amount, 18),
      }),
    ];

    for (let i = 0; i < members.length; i++) {
      txs.push(
        fUSDCx.createFlow({
          sender: from,
          receiver: members[i],
          flowRate: calculateFlowRate(
            ethers.utils.parseUnits((amount / members.length).toString(), 18)
          ),
        })
      );
    }

    const ops = await Promise.all(
      sf.batchCall(txs).getOperationStructArrayPromises
    );
    const host = sf.contracts.host.connect(signer);
    const calldata = await host.populateTransaction.batchCall(ops, {
      gasLimit: 2000000,
    });
    return calldata;
  };

  const createWithdrawTx = async (amount) => {
    const downgradeOperation = daix.downgrade({
      amount: amount
    });
  };

  async function getBalance(address) {
    const fusdc = fUSDCx.underlyingToken.contract.connect(signer);
    return await fusdc.balanceOf(address);
  }

  return {
    init,
    calculateFlowRate,
    sfLoaded,
    getBalance,
    createTransferTx,
    createApproveTx,
    createFlowTx,
  };
};

export default useSuperfluid;
