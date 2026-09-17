import { RealEstateInput, RealEstateResult } from './types';

/**
 * 10. 부동산 중개보수(복비) 및 취득세 간이 계산기
 * - 월세 환산보증금 공식:
 *   1차: 보증금 + (월세 * 100)
 *   1차 산정액이 5,000만 원 미만일 경우 2차: 보증금 + (월세 * 70)
 * - 주택 매매 요율:
 *   5천만원 미만: 0.6% (한도 25만)
 *   5천만 ~ 2억 미만: 0.5% (한도 80만)
 *   2억 ~ 9억 미만: 0.4% (한도 없음)
 *   9억 ~ 12억 미만: 0.5%
 *   12억 ~ 15억 미만: 0.6%
 *   15억 이상: 0.7%
 * - 주택 임대차(전/월세) 요율:
 *   5천만원 미만: 0.5% (한도 20만)
 *   5천만 ~ 1억 미만: 0.4% (한도 30만)
 *   1억 ~ 6억 미만: 0.3%
 *   6억 ~ 12억 미만: 0.4%
 *   12억 ~ 15억 미만: 0.5%
 *   15억 이상: 0.6%
 * - 오피스텔:
 *   주거용(전용 85㎡ 이하 & 부엌/화장실 등): 매매 0.5%, 임대차 0.4%
 * - 토지/상가 등 (일반):
 *   0.9% 이내 협의
 */
export function calculateRealEstateFee(input: RealEstateInput): RealEstateResult {
  const { propertyType, dealType, dealAmount, monthlyPay = 0 } = input;

  let calculatedDealAmount = dealAmount;

  // 월세일 경우 환산보증금 계산
  if (dealType === 'monthly_rent') {
    const primary = dealAmount + monthlyPay * 100;
    if (primary < 50000000) {
      calculatedDealAmount = dealAmount + monthlyPay * 70;
    } else {
      calculatedDealAmount = primary;
    }
  }

  let appliedRate = 0;
  let limitAmount = Infinity;
  let rateDescription = '';

  if (propertyType === 'housing') {
    if (dealType === 'buy') {
      if (calculatedDealAmount < 50000000) {
        appliedRate = 0.6;
        limitAmount = 250000;
        rateDescription = '5천만원 미만: 0.6% (한도 25만원)';
      } else if (calculatedDealAmount < 200000000) {
        appliedRate = 0.5;
        limitAmount = 800000;
        rateDescription = '5천만~2억원 미만: 0.5% (한도 80만원)';
      } else if (calculatedDealAmount < 900000000) {
        appliedRate = 0.4;
        rateDescription = '2억~9억원 미만: 0.4% (한도 없음)';
      } else if (calculatedDealAmount < 1200000000) {
        appliedRate = 0.5;
        rateDescription = '9억~12억원 미만: 0.5%';
      } else if (calculatedDealAmount < 1500000000) {
        appliedRate = 0.6;
        rateDescription = '12억~15억원 미만: 0.6%';
      } else {
        appliedRate = 0.7;
        rateDescription = '15억원 이상: 0.7%';
      }
    } else {
      // 전세 또는 월세 임대차
      if (calculatedDealAmount < 50000000) {
        appliedRate = 0.5;
        limitAmount = 200000;
        rateDescription = '5천만원 미만: 0.5% (한도 20만원)';
      } else if (calculatedDealAmount < 100000000) {
        appliedRate = 0.4;
        limitAmount = 300000;
        rateDescription = '5천만~1억원 미만: 0.4% (한도 30만원)';
      } else if (calculatedDealAmount < 600000000) {
        appliedRate = 0.3;
        rateDescription = '1억~6억원 미만: 0.3%';
      } else if (calculatedDealAmount < 1200000000) {
        appliedRate = 0.4;
        rateDescription = '6억~12억원 미만: 0.4%';
      } else if (calculatedDealAmount < 1500000000) {
        appliedRate = 0.5;
        rateDescription = '12억~15억원 미만: 0.5%';
      } else {
        appliedRate = 0.6;
        rateDescription = '15억원 이상: 0.6%';
      }
    }
  } else if (propertyType === 'officetel') {
    // 주거용 오피스텔
    if (dealType === 'buy') {
      appliedRate = 0.5;
      rateDescription = '주거용 오피스텔 매매: 0.5%';
    } else {
      appliedRate = 0.4;
      rateDescription = '주거용 오피스텔 임대차: 0.4%';
    }
  } else {
    // 상가, 토지 등 일반
    appliedRate = 0.9;
    rateDescription = '토지/상가 등: 0.9% 이내 협의';
  }

  const rawFee = Math.floor(calculatedDealAmount * (appliedRate / 100));
  const maxBrokerageFee = Math.min(rawFee, limitAmount);
  const vat = Math.floor(maxBrokerageFee * 0.1);
  const totalWithVat = maxBrokerageFee + vat;

  return {
    calculatedDealAmount,
    appliedRate,
    maxBrokerageFee,
    vat,
    totalWithVat,
    rateDescription,
  };
}
