import { DateCalcInput, DateCalcResult } from './types';

/**
 * 7. 날짜 및 D-Day / 전역일 / 배란일 계산기
 * - dday: 시작일과 목표일 간의 일수 차이
 * - add_days: 특정 일수 후(+N) 또는 전(-N) 날짜
 * - business_days: 주말(토/일)을 제외한 순수 영업일 수
 */
export function calculateDate(input: DateCalcInput): DateCalcResult {
  const { mode, startDate, targetDate, daysToAdd } = input;

  if (!startDate) {
    throw new Error('시작일을 입력해주세요.');
  }

  const [sY, sM, sD] = startDate.split('-').map(Number);
  const startUtc = Date.UTC(sY, sM - 1, sD);

  if (mode === 'dday') {
    if (!targetDate) throw new Error('목표일을 입력해주세요.');
    const [tY, tM, tD] = targetDate.split('-').map(Number);
    const targetUtc = Date.UTC(tY, tM - 1, tD);

    const diffTime = targetUtc - startUtc;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return {
      diffDays: Math.abs(diffDays),
      isPast: diffDays < 0,
    };
  }

  if (mode === 'add_days') {
    const days = daysToAdd || 0;
    const resultTime = startUtc + days * (1000 * 60 * 60 * 24);
    const resDateObj = new Date(resultTime);

    const rY = resDateObj.getUTCFullYear();
    const rM = String(resDateObj.getUTCMonth() + 1).padStart(2, '0');
    const rD = String(resDateObj.getUTCDate()).padStart(2, '0');

    return {
      diffDays: Math.abs(days),
      resultDate: `${rY}-${rM}-${rD}`,
    };
  }

  if (mode === 'business_days') {
    if (!targetDate) throw new Error('목표일을 입력해주세요.');
    const [tY, tM, tD] = targetDate.split('-').map(Number);
    const targetUtc = Date.UTC(tY, tM - 1, tD);

    const minUtc = Math.min(startUtc, targetUtc);
    const maxUtc = Math.max(startUtc, targetUtc);

    let businessDays = 0;
    const oneDay = 1000 * 60 * 60 * 24;

    for (let current = minUtc; current <= maxUtc; current += oneDay) {
      const d = new Date(current);
      const dayOfWeek = d.getUTCDay(); // 0: 일요일, 6: 토요일
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
    }

    return {
      diffDays: businessDays,
      isPast: targetUtc < startUtc,
    };
  }

  return { diffDays: 0 };
}
