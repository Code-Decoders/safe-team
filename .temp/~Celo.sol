// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "/Users/maadhav/Documents/NextJSProjects/safe-hackathon/node_modules/@openzeppelin/contracts/access/Ownable.sol";
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract LiquidityPool is Ownable, AxelarExecutable {
    IERC20 public USDC;
    IERC20 public aUSDC;
    IAxelarGasService public immutable gasService;

    address private constant gateway_ =
        0xe432150cce91c13a887f7D836923d5597adD8E31;
    address private constant gasService_ =
        0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6;

    constructor(address USDCAddress)
        AxelarExecutable(gateway_)
    {
        USDC = IERC20(USDCAddress);
        aUSDC = IERC20(gateway.tokenAddresses("aUSDC"));
        gasService = IAxelarGasService(gasService_);
    }

    function addUSDC(uint256 amount) public onlyOwner {
        USDC.transferFrom(msg.sender, address(this), amount);
    }

    function addAUSDC(uint256 amount) public onlyOwner {
        aUSDC.transferFrom(msg.sender, address(this), amount);
    }

    function send(
        string memory destinationContract,
        address safeTeamWallet,
        uint256 amount
    ) public payable {
        string memory destinationChain = "ethereum-2";
        string memory symbol = "aUSDC";

        USDC.transferFrom(msg.sender, address(this), amount);
        aUSDC.approve(address(gateway), amount);
        bytes memory payload = abi.encode(safeTeamWallet);
        if (msg.value > 0) {
            gasService.payNativeGasForContractCallWithToken{ value: msg.value }(
                address(this),
                destinationChain,
                destinationContract,
                payload,
                symbol,
                amount,
                msg.sender
            );
        }
        gateway.callContractWithToken(destinationChain, destinationContract, payload, symbol, amount);

    }
}