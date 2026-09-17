'use client';

import React, { useState } from 'react';
import { calculateLoan } from '@/services/calculators/loan-repayment';
import { RepaymentMethod } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Landmark, ChevronDown, ChevronUp } from 'lucide-react';

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<number>(50000000);
  const [annualRate, setAnnualRate] = useState<number>(4.2);
  const [months, setMonths] = useState<number>(24);
  const [method, setMethod] = useState<RepaymentMethod>('amortizing');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const result = React.useMemo(() => {
    return calculateLoan({
      principal,
      annualRate,
      months,
      method,
    });
  }, [principal, annualRate, months, method]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">대출 이자 및 상환액 계산기</CardTitle>
            <CardDescription>
              원리금균등 및 원금균등 방식별 월별 상환금과 총 이자 비교
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={method === 'amortizing' ? 'default' : 'outline'}
            onClick={() => setMethod('amortizing')}
          >
            원리금 균등분할상환
          </Button>
          <Button
            type="button"
            variant={method === 'equal_principal' ? 'default' : 'outline'}
            onClick={() => setMethod('equal_principal')}
          >
            원금 균등분할상환
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>대출 원금</Label>
            <FormattedNumberInput
              value={principal}
              onChange={setPrincipal}
              unitSuffix="원"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>연이자율</Label>
            <FormattedNumberInput
              value={annualRate}
              onChange={setAnnualRate}
              allowDecimal={true}
              unitSuffix="%"
              placeholder="0.0"
            />
          </div>

          <div className="space-y-2">
            <Label>상환 기간</Label>
            <FormattedNumberInput
              value={months}
              onChange={setMonths}
              unitSuffix="개월"
              placeholder="12"
            />
          </div>
        </div>

        {/* 결과 요약 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-neutral-500">
                  {method === 'amortizing' ? '매월 상환액' : '첫 달 상환액'}
                </span>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {result.firstMonthPayment.toLocaleString()}
                  <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                    원
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-neutral-500">총 납부 이자</span>
                <div className="text-2xl font-bold text-red-500">
                  {result.totalInterest.toLocaleString()}
                  <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                    원
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm text-neutral-500">총 상환 원리금</span>
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {result.totalRepayment.toLocaleString()}
                  <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                    원
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => setShowSchedule(!showSchedule)}
              >
                {showSchedule ? (
                  <>
                    <ChevronUp className="w-4 h-4" /> 월별 상환 스케줄 닫기
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" /> 월별 상환 스케줄 보기 ({months}개월)
                  </>
                )}
              </Button>
            </div>

            {showSchedule && (
              <div className="max-h-72 overflow-y-auto rounded-lg border bg-white dark:bg-neutral-950 mt-3">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center w-16">회차</TableHead>
                      <TableHead className="text-right">월 상환금</TableHead>
                      <TableHead className="text-right">납입 원금</TableHead>
                      <TableHead className="text-right">납입 이자</TableHead>
                      <TableHead className="text-right">대출 잔액</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.monthlyPayments.map((p) => (
                      <TableRow key={p.month}>
                        <TableCell className="text-center font-medium">{p.month}회</TableCell>
                        <TableCell className="text-right font-mono">
                          {p.totalPaid.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right font-mono text-neutral-600 dark:text-neutral-400">
                          {p.principalPaid.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right font-mono text-red-500">
                          {p.interestPaid.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right font-mono text-neutral-500">
                          {p.remainingBalance.toLocaleString()}원
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
