import {
  DiscountInput,
  DiscountResult,
  ReverseDiscountInput,
  ReverseDiscountResult,
} from './types';

/**
 * 6. 할인율 및 역할인 계산기
 * - 순차 할인 (다중 퍼센트 할인) 및 추가 정액 쿠폰 할인 적용
 * - 역할인 모드: 정상가 대비 판매가로 실질 할인율 역산
 */
export function calculateDiscount(input: DiscountInput): DiscountResult {
  const { originalPrice, discountRates, couponAmount } = input;

  if (originalPrice < 0) {
    throw new Error('정상가는 0원 이상이어야 합니다.');
  }

  let currentPrice = originalPrice;

  // 순차 할인 적용
  for (const rate of discountRates) {
    if (rate > 0) {
      currentPrice = currentPrice * (1 - rate / 100);
    }
  }

  // 정액 쿠폰 적용
  if (couponAmount > 0) {
    currentPrice = currentPrice - couponAmount;
  }

  const finalPrice = Math.max(0, Math.round(currentPrice));
  const totalDiscountAmount = originalPrice - finalPrice;
  let effectiveDiscountRate = 0;

  if (originalPrice > 0) {
    effectiveDiscountRate = (totalDiscountAmount / originalPrice) * 100;
    effectiveDiscountRate = Math.round((effectiveDiscountRate + Number.EPSILON) * 100) / 100;
  }

  return {
    finalPrice,
    totalDiscountAmount,
    effectiveDiscountRate,
  };
}

/**
 * 역할인 (정상가 & 판매가 -> 실질 할인율 역산)
 */
export function calculateReverseDiscount(input: ReverseDiscountInput): ReverseDiscountResult {
  const { originalPrice, finalPrice } = input;

  if (originalPrice <= 0) {
    return { discountAmount: 0, discountRate: 0 };
  }

  const discountAmount = Math.max(0, originalPrice - finalPrice);
  let discountRate = (discountAmount / originalPrice) * 100;
  discountRate = Math.round((discountRate + Number.EPSILON) * 100) / 100;

  return {
    discountAmount,
    discountRate,
  };
}
