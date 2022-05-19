import { ethereum, crypto, EthereumBlock } from '@graphprotocol/graph-ts';
import {
  DepositTransferred,
  IncentiveCreated,
  IncentiveEnded,
  RewardClaimed,
  TokenStaked,
  TokenUnstaked,
} from '../generated/UniV3Staker/UniV3Staker';
import { Incentive, Position } from '../generated/schema';

export function handleIncentiveCreated(event: IncentiveCreated): void {
  let incentiveIdTuple: Array<ethereum.Value> = [
    ethereum.Value.fromAddress(event.params.rewardToken),
    ethereum.Value.fromAddress(event.params.pool),
    ethereum.Value.fromUnsignedBigInt(event.params.startTime),
    ethereum.Value.fromUnsignedBigInt(event.params.endTime),
    ethereum.Value.fromAddress(event.params.refundee),
  ];
  let incentiveIdEncoded = ethereum.encode(
    ethereum.Value.fromTuple(incentiveIdTuple as ethereum.Tuple)
  )!;
  let incentiveId = crypto.keccak256(incentiveIdEncoded);

  let entity = Incentive.load(incentiveId.toHex());
  if (entity == null) {
    entity = new Incentive(incentiveId.toHex());
  }

  entity.rewardToken = event.params.rewardToken;
  entity.pool = event.params.pool;
  entity.startTime = event.params.startTime;
  entity.endTime = event.params.endTime;
  entity.refundee = event.params.refundee;
  entity.reward = event.params.reward;
  entity.ended = false;

  entity.save();
}

export function handleIncentiveEnded(event: IncentiveEnded): void {
  let entity = Incentive.load(event.params.incentiveId.toHex());
  if (entity != null) {
    entity.ended = true;
    entity.save();
  }
}

export function handleRewardClaimed(event: RewardClaimed): void {}

export function handleTokenStaked(event: TokenStaked, block: EthereumBlock): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    let id = block.hash.toHex()
    let blockEntity = new Block(id);
    entity.staked = true;
    entity.liquidity = event.params.liquidity;
    entity.state="Staked";
    entity.incentiveId = event.params.incentiveId;
    entity.timestamp = block.timestamp;
    entity.save();
  }
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.staked = false;
    entity.state="Deposited"
    entity.incentiveId = null;
    entity.timestamp = null;
    entity.save();
  }
}

export function handleDepositTransferred(event: DepositTransferred): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.oldOwner = event.params.oldOwner;
    entity.owner = event.params.newOwner;
    if (event.params.newOwner.toHex()=="0x80b7859967d0e40a0cb87560ea120dcb93c56230") {
      entity.state="Deposited"
    }
    if (event.params.oldOwner.toHex() == "0x80b7859967d0e40a0cb87560ea120dcb93c56230") {
      entity.state=""
    }
    entity.save();
  }
}
