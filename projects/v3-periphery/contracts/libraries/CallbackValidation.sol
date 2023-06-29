// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity =0.7.6;

import '@ascentexchange/v3-core/contracts/interfaces/IAscentV3Pool.sol';
import './PoolAddress.sol';

/// @notice Provides validation for callbacks from AscentExchange V3 Pools
library CallbackValidation {
    /// @notice Returns the address of a valid AscentExchange V3 Pool
    /// @param deployer The contract address of the AscentExchange V3 Deployer
    /// @param tokenA The contract address of either token0 or token1
    /// @param tokenB The contract address of the other token
    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip
    /// @return pool The V3 pool contract address
    function verifyCallback(
        address deployer,
        address tokenA,
        address tokenB,
        uint24 fee
    ) internal view returns (IAscentV3Pool pool) {
        return verifyCallback(deployer, PoolAddress.getPoolKey(tokenA, tokenB, fee));
    }

    /// @notice Returns the address of a valid AscentExchange V3 Pool
    /// @param deployer The contract address of the AscentExchange V3 deployer
    /// @param poolKey The identifying key of the V3 pool
    /// @return pool The V3 pool contract address
    function verifyCallback(address deployer, PoolAddress.PoolKey memory poolKey)
        internal
        view
        returns (IAscentV3Pool pool)
    {
        pool = IAscentV3Pool(PoolAddress.computeAddress(deployer, poolKey));
        require(msg.sender == address(pool));
    }
}
