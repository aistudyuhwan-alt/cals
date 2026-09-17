import { LoanInput, LoanResult, MonthlyPaymentDetail } from './types';

/**
 * 4. 대출 이자 및 상환액 계산기 (원리금균등 vs 원금균등)
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const { principal, annualRate, months, method } = input;

  if (principal <= 0 || months <= 0) {
    return {
      monthlyPayments: [],
      totalInterest: 0,
      totalRepayment: 0,
      firstMonthPayment: 0,
    };
  }

  // 월 이자율
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayments: MonthlyPaymentDetail[] = [];
  let remainingBalance = principal;
  let totalInterest = 0;

  if (monthlyRate === 0) {
    // 무이자 특수 케이스
    const monthlyPrincipal = Math.floor(principal / months);
    for (let m = 1; m <= months; m++) {
      const p = m === months ? remainingBalance : monthlyPrincipal;
      remainingBalance -= p;
      monthlyPayments.push({
        month: m,
        principalPaid: p,
        interestPaid: 0,
        totalPaid: p,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }
    return {
      monthlyPayments,
      totalInterest: 0,
      totalRepayment: principal,
      firstMonthPayment: monthlyPayments[0]?.totalPaid || 0,
    };
  }

  if (method === 'amortizing') {
    // 원리금균등분할상환: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const factor = Math.pow(1 + monthlyRate, months);
    const monthlyPayment = (principal * (monthlyRate * factor)) / (factor - 1);

    for (let m = 1; m <= months; m++) {
      const interestPaid = Math.round(remainingBalance * monthlyRate);
      let principalPaid = Math.round(monthlyPayment - interestPaid);

      if (m === months) {
        principalPaid = remainingBalance;
      }

      remainingBalance -= principalPaid;
      const totalPaid = principalPaid + interestPaid;
      totalInterest += interestPaid;

      monthlyPayments.push({
        month: m,
        principalPaid,
        interestPaid,
        totalPaid,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }
  } else {
    // 원금균등분할상환: 매월 균등 원금 = P / n
    const fixedPrincipal = Math.floor(principal / months);

    for (let m = 1; m <= months; m++) {
      let principalPaid = fixedPrincipal;
      if (m === months) {
        principalPaid = remainingBalance;
      }
      const interestPaid = Math.round(remainingBalance * monthlyRate);
      remainingBalance -= principalPaid;
      const totalPaid = principalPaid + interestPaid;
      totalInterest += interestPaid;

      monthlyPayments.push({
        month: m,
        principalPaid,
        interestPaid,
        totalPaid,
        remainingBalance: Math.max(0, remainingBalance),
      });
    }
  }

  return {
    monthlyPayments,
    totalInterest,
    totalRepayment: principal + totalInterest,
    firstMonthPayment: monthlyPayments[0]?.totalPaid || 0,
  };
}
