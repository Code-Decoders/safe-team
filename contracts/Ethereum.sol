// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract LiquidityPool is Ownable, AxelarExecutable {
    IERC20 public USDC;
    IERC20 public aUSDC;

    address private constant gateway_ =
        0xe432150cce91c13a887f7D836923d5597adD8E31;

    constructor(address USDCAddress)
        AxelarExecutable(gateway_)
    {
        USDC = IERC20(USDCAddress);
        aUSDC = IERC20(gateway.tokenAddresses("aUSDC"));
    }

    function addUSDC(uint256 amount) public onlyOwner {
        USDC.transferFrom(msg.sender, address(this), amount);
    }

    function addAUSDC(uint256 amount) public onlyOwner {
        aUSDC.transferFrom(msg.sender, address(this), amount);
    }

    function _executeWithToken(
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata,
        uint256 amount
    ) internal override {
        address recipient = abi.decode(payload, (address));
        // address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        USDC.transfer(recipient, amount);
    }
}