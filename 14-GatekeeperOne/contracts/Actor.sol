// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./GatekeeperOne.sol";

contract Actor {
    uint a;
    uint b;

    function enter(address _gatekeeper) external {
        b = uint64(_gatekeeper);
        bytes32 upperBytes = keccak256(abi.encode(b));
        for(uint i = 0; i < 8; ++i) {
            upperBytes = keccak256(abi.encode(upperBytes));
        }
        int32 v = -1;
        uint64 upper = uint64(uint(upperBytes) + b + uint(blockhash(0)) + uint(_gatekeeper) + uint(int(v)) + 32 + 44);

        uint64 gatekey = uint64(uint16(tx.origin)) | (upper << 32);
        GatekeeperOne gatekeeper = GatekeeperOne(_gatekeeper);
        gatekeeper.enter(bytes8(gatekey));
    }

    function enter2(address _gatekeeper) external {
        uint64 gatekey = uint64(uint16(msg.sender)) | 0x100000000;
        GatekeeperOne gatekeeper = GatekeeperOne(_gatekeeper);
        gatekeeper.enter(bytes8(gatekey));
    }
}