// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor() ERC20("Native USDC", "USDC") {
        _mint(msg.sender, 100000000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint() public{
        _mint(msg.sender, 100000000);
    }
}