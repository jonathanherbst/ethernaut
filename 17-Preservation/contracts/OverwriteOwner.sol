// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract OverwriteOwner {

  // public library contracts 
  address public timeZone1Library;
  address public timeZone2Library;
  uint public owner; 
  
  function setTime(uint _time) public {
    owner = _time;
  }
}