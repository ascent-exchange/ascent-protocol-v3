# Solidity API

## IAscentV3FlashCallback

Any contract that calls IAscentV3PoolActions#flash must implement this interface

### ascentV3FlashCallback

```solidity
function ascentV3FlashCallback(uint256 fee0, uint256 fee1, bytes data) external
```

Called to `msg.sender` after transferring to the recipient from IAscentV3Pool#flash.

_In the implementation you must repay the pool the tokens sent by flash plus the computed fee amounts.
The caller of this method must be checked to be a AscentV3Pool deployed by the canonical AscentV3Factory._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee0 | uint256 | The fee amount in token0 due to the pool by the end of the flash |
| fee1 | uint256 | The fee amount in token1 due to the pool by the end of the flash |
| data | bytes | Any data passed through by the caller via the IAscentV3PoolActions#flash call |

