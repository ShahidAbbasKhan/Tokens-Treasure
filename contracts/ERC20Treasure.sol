// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IERC20.sol";

contract ERC20Treasure  {
      IERC20 token;
    function getTokens(address[] calldata erc20s) external {
        for(uint i = 0; i < erc20s.length; i++) {
            token = IERC20(erc20s[i]);
            uint balance = token.balanceOf(address(this));
            token.transfer(msg.sender, balance);
        }
    }
}
