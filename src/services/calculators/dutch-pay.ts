import { DutchPayInput, DutchPayResult } from './types';

/**
 * 1. 더치페이 / N빵 계산기
 * 총 결제 금액을 인원수대로 균등 분할하고, 올림/버림 단위(예: 100원 단위, 1,000원 단위)를 적용하여 정산합니다.
 */
export function calculateDutchPay(input: DutchPayInput): DutchPayResult {
  const { totalAmount, numPeople, roundUnit, roundMode } = input;

  if (numPeople <= 0) {
    throw new Error('인원수는 1명 이상이어야 합니다.');
  }

  if (totalAmount < 0) {
    throw new Error('총 금액은 0원 이상이어야 합니다.');
  }

  const rawShare = totalAmount / numPeople;
  const unit = roundUnit > 0 ? roundUnit : 1;

  let perPersonAmount = rawShare;

  if (roundMode === 'round_up') {
    perPersonAmount = Math.ceil(rawShare / unit) * unit;
  } else if (roundMode === 'round_down') {
    perPersonAmount = Math.floor(rawShare / unit) * unit;
  } else {
    // none (정밀 분할, 원 단위 반올림)
    perPersonAmount = Math.round(rawShare);
  }

  const difference = totalAmount - perPersonAmount * numPeople;

  return {
    perPersonAmount,
    difference,
    rawShare: Math.round((rawShare + Number.EPSILON) * 100) / 100,
  };
}
