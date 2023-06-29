# Solidity API

## AscentInterfaceMulticall

A fork of Multicall2 specifically tailored for the Ascent Interface

### Call

```solidity
struct Call {
  address target;
  uint256 gasLimit;
  bytes callData;
}
```

### Result

```solidity
struct Result {
  bool success;
  uint256 gasUsed;
  bytes returnData;
}
```

### getCurrentBlockTimestamp

```solidity
function getCurrentBlockTimestamp() public view returns (uint256 timestamp)
```

### getEthBalance

```solidity
function getEthBalance(address addr) public view returns (uint256 balance)
```

### multicall

```solidity
function multicall(struct AscentInterfaceMulticall.Call[] calls) public returns (uint256 blockNumber, struct AscentInterfaceMulticall.Result[] returnData)
```

