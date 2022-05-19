import {
  Approval,
  ApprovalForAll,
  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,
  Transfer,
} from '../generated/NFTPositionsManager/NFTPositionsManager';
import { Position } from '../generated/schema';

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity == null) {
    entity = new Position(event.params.tokenId.toHex());
    entity.approved = null;
    entity.tokenId = event.params.tokenId;
    entity.owner = event.transaction.from;
    entity.staked = false;
    entity.oldOwner = null;
  }
  entity.liquidity = event.params.liquidity;
  entity.save();
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.liquidity = event.params.liquidity;
    entity.save();
  }
}

export function handleTransfer(event: Transfer): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.oldOwner = event.params.to;
    entity.owner = event.params.from;
    entity.approved = null;
    entity.save();
  }
}

export function handleApproval(event: Approval): void {
  let entity = Position.load(event.params.tokenId.toHex());
  if (entity != null) {
    entity.approved = event.params.approved;
    if ((event.params.approved).toHex() == "0x80b7859967d0e40a0cb87560ea120dcb93c56230") {
      entity.state="Approved";
    }
    entity.save();
  }
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleCollect(event: Collect): void {}
