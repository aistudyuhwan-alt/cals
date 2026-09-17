import { SalaryInput, SalaryResult } from './types';

/**
 * 5. 급여 실수령액 및 시급/주휴수당 계산기
 * - 기본 시급과 주당 근무시간을 기반으로 주휴수당 포함 월급 및 실수령액 산출
 * - 주휴수당 조건: 주 15시간 이상 근무 시 (weeklyHours / 40) * 8 (최대 8시간)
 * - 월 환산 주수: 4.345주 (365 / 7 / 12)
 */
export function calculateSalary(input: SalaryInput): SalaryResult {
  const { hourlyWage, weeklyHours, taxRatePercent } = input;

  if (hourlyWage < 0 || weeklyHours < 0) {
    throw new Error('시급과 근무시간은 0 이상이어야 합니다.');
  }

  const hasHolidayAllowance = weeklyHours >= 15;
  let holidayAllowanceHours = 0;

  if (hasHolidayAllowance) {
    holidayAllowanceHours = Math.min((weeklyHours / 40) * 8, 8);
    holidayAllowanceHours = Math.round((holidayAllowanceHours + Number.EPSILON) * 100) / 100;
  }

  const weeklyTotalHours = weeklyHours + holidayAllowanceHours;
  // 월 환산 주수: 약 4.345주 (365 / 84)
  const averageWeeksPerMonth = 365 / 7 / 12;
  const monthlyPaidHours = Math.round((weeklyTotalHours * averageWeeksPerMonth + Number.EPSILON) * 10) / 10;

  const grossWage = Math.round(monthlyPaidHours * hourlyWage);
  const taxRate = Math.max(0, taxRatePercent) / 100;
  const taxAmount = Math.floor(grossWage * taxRate);
  const netMonthlyWage = grossWage - taxAmount;

  return {
    holidayAllowanceHours,
    weeklyTotalHours,
    monthlyPaidHours,
    grossWage,
    taxAmount,
    netMonthlyWage,
    hasHolidayAllowance,
  };
}
