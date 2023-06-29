// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.5.0;

import './pool/IAscentV3PoolImmutables.sol';
import './pool/IAscentV3PoolState.sol';
import './pool/IAscentV3PoolDerivedState.sol';
import './pool/IAscentV3PoolActions.sol';
import './pool/IAscentV3PoolOwnerActions.sol';
import './pool/IAscentV3PoolEvents.sol';

/// @title The interface for a AscentExchange V3 Pool
/// @notice A AscentExchange pool facilitates swapping and automated market making between any two assets that strictly conform
/// to the ERC20 specification
/// @dev The pool interface is broken up into many smaller pieces
interface IAscentV3Pool is
    IAscentV3PoolImmutables,
    IAscentV3PoolState,
    IAscentV3PoolDerivedState,
    IAscentV3PoolActions,
    IAscentV3PoolOwnerActions,
    IAscentV3PoolEvents
{

}
