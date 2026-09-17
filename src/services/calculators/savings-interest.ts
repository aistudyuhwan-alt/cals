import { SavingsInput, SavingsResult } from './types';

/**
 * 3. 예·적금 만기 이자 계산기 (단리/복리/세금)
 * 정기예금(일시납) 및 정기적금(월 복합납입, 월초불 단리 공식)의 만기 시 세전/세후 이자와 실수령액을 계산합니다.
 */
export function calculateSavings(input: SavingsInput): SavingsResult {
  const { type, principal, annualRate, months, taxType } = input;

  if (principal < 0 || annualRate < 0 || months <= 0) {
    throw new Error('올바른 원금, 이율 및 개월 수를 입력해주세요.');
  }

  let totalPrincipal = 0;
  let preTaxInterest = 0;

  if (type === 'deposit') {
    // 정기예금 단리 공식: 원금 * (이율 / 100) * (개월 / 12)
    totalPrincipal = principal;
    preTaxInterest = principal * (annualRate / 100) * (months / 12);
  } else {
    // 정기적금 월초불 단리 공식: 월납입액 * (이율 / 100) * (n * (n + 1) / (2 * 12))
    totalPrincipal = principal * months;
    preTaxInterest = principal * (annualRate / 100) * ((months * (months + 1)) / (2 * 12));
  }

  preTaxInterest = Math.round(preTaxInterest);

  let taxRate = 0.154;
  if (taxType === 'preferential') {
    taxRate = 0.095;
  } else if (taxType === 'free') {
    taxRate = 0.0;
  }

  // 이자소득세는 원 단위 절사 (버림)
  const taxAmount = Math.floor(preTaxInterest * taxRate);
  const netAmount = totalPrincipal + (preTaxInterest - taxAmount);

  return {
    totalPrincipal,
    preTaxInterest,
    taxRate,
    taxAmount,
    netAmount,
  };
}
