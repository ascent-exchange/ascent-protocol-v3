import { BigNumber } from 'ethers'
import { ethers } from 'hardhat'
import { MockTimeAscentV3Pool } from '../../typechain-types/contracts/test/MockTimeAscentV3Pool'
import { TestERC20 } from '../../typechain-types/contracts/test/TestERC20'
import { AscentV3Factory } from '../../typechain-types/contracts/AscentV3Factory'
import { AscentV3PoolDeployer } from '../../typechain-types/contracts/AscentV3PoolDeployer'
import { TestAscentV3Callee } from '../../typechain-types/contracts/test/TestAscentV3Callee'
import { TestAscentV3Router } from '../../typechain-types/contracts/test/TestAscentV3Router'
import { MockTimeAscentV3PoolDeployer } from '../../typechain-types/contracts/test/MockTimeAscentV3PoolDeployer'
import AscentV3LmPoolArtifact from '@ascentexchange/v3-lm-pool/artifacts/contracts/AscentV3LmPool.sol/AscentV3LmPool.json'

import { Fixture } from 'ethereum-waffle'

interface FactoryFixture {
  factory: AscentV3Factory
}

interface DeployerFixture {
  deployer: AscentV3PoolDeployer
}

async function factoryFixture(): Promise<FactoryFixture> {
  const { deployer } = await deployerFixture()
  const factoryFactory = await ethers.getContractFactory('AscentV3Factory')
  const factory = (await factoryFactory.deploy(deployer.address)) as AscentV3Factory
  return { factory }
}
async function deployerFixture(): Promise<DeployerFixture> {
  const deployerFactory = await ethers.getContractFactory('AscentV3PoolDeployer')
  const deployer = (await deployerFactory.deploy()) as AscentV3PoolDeployer
  return { deployer }
}

interface TokensFixture {
  token0: TestERC20
  token1: TestERC20
  token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
  const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

  const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
  )

  return { token0, token1, token2 }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface PoolFixture extends TokensAndFactoryFixture {
  swapTargetCallee: TestAscentV3Callee
  swapTargetRouter: TestAscentV3Router
  createPool(
    fee: number,
    tickSpacing: number,
    firstToken?: TestERC20,
    secondToken?: TestERC20
  ): Promise<MockTimeAscentV3Pool>
}

// Monday, October 5, 2020 9:00:00 AM GMT-05:00
export const TEST_POOL_START_TIME = 1601906400

export const poolFixture: Fixture<PoolFixture> = async function (): Promise<PoolFixture> {
  const { factory } = await factoryFixture()
  const { token0, token1, token2 } = await tokensFixture()

  const MockTimeAscentV3PoolDeployerFactory = await ethers.getContractFactory('MockTimeAscentV3PoolDeployer')
  const MockTimeAscentV3PoolFactory = await ethers.getContractFactory('MockTimeAscentV3Pool')

  const calleeContractFactory = await ethers.getContractFactory('TestAscentV3Callee')
  const routerContractFactory = await ethers.getContractFactory('TestAscentV3Router')

  const swapTargetCallee = (await calleeContractFactory.deploy()) as TestAscentV3Callee
  const swapTargetRouter = (await routerContractFactory.deploy()) as TestAscentV3Router

  const AscentV3LmPoolFactory = await ethers.getContractFactoryFromArtifact(AscentV3LmPoolArtifact)

  return {
    token0,
    token1,
    token2,
    factory,
    swapTargetCallee,
    swapTargetRouter,
    createPool: async (fee, tickSpacing, firstToken = token0, secondToken = token1) => {
      const mockTimePoolDeployer =
        (await MockTimeAscentV3PoolDeployerFactory.deploy()) as MockTimeAscentV3PoolDeployer
      const tx = await mockTimePoolDeployer.deploy(
        factory.address,
        firstToken.address,
        secondToken.address,
        fee,
        tickSpacing
      )

      const receipt = await tx.wait()
      const poolAddress = receipt.events?.[0].args?.pool as string

      const mockTimeAscentV3Pool = MockTimeAscentV3PoolFactory.attach(poolAddress) as MockTimeAscentV3Pool

      await (
        await factory.setLmPool(
          poolAddress,
          (
            await AscentV3LmPoolFactory.deploy(
              poolAddress,
              ethers.constants.AddressZero,
              Math.floor(Date.now() / 1000)
            )
          ).address
        )
      ).wait()

      return mockTimeAscentV3Pool
    },
  }
}
