import { abi as POOL_ABI } from '@ascentexchange/v3-core/artifacts/contracts/AscentV3Pool.sol/AscentV3Pool.json'
import { Contract, Wallet } from 'ethers'
import { IAscentV3Pool } from '../../typechain-types'

export default function poolAtAddress(address: string, wallet: Wallet): IAscentV3Pool {
  return new Contract(address, POOL_ABI, wallet) as IAscentV3Pool
}
