'use client';

import React, { useState } from 'react';
import { calculateSalary } from '@/services/calculators/salary-wage';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Info } from 'lucide-react';

export function SalaryCalculator() {
  const [hourlyWage, setHourlyWage] = useState<number>(10030); // 2025년 기준
  const [weeklyHours, setWeeklyHours] = useState<number>(40);
  const [taxRatePercent, setTaxRatePercent] = useState<number>(3.3);

  const result = React.useMemo(() => {
    return calculateSalary({
      hourlyWage,
      weeklyHours,
      taxRatePercent,
    });
  }, [hourlyWage, weeklyHours, taxRatePercent]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">급여 및 시급 / 주휴수당 계산기</CardTitle>
            <CardDescription>
              주 15시간 이상 근무 시 발생하는 주휴수당 자동 산정 및 예상 월 실수령액
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>시급</Label>
              <button
                type="button"
                className="text-xs text-teal-600 hover:underline"
                onClick={() => setHourlyWage(10030)}
              >
                2025 최저시급 적용
              </button>
            </div>
            <FormattedNumberInput
              value={hourlyWage}
              onChange={setHourlyWage}
              unitSuffix="원"
              placeholder="10030"
            />
          </div>

          <div className="space-y-2">
            <Label>주당 정규 근무시간</Label>
            <FormattedNumberInput
              value={weeklyHours}
              onChange={setWeeklyHours}
              allowDecimal={true}
              unitSuffix="시간"
              placeholder="40"
            />
          </div>

          <div className="space-y-2">
            <Label>세금 공제율</Label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: '미공제(0%)', val: 0 },
                { label: '3.3%(원천)', val: 3.3 },
                { label: '4대보험(9.4%)', val: 9.4 },
              ].map((t) => (
                <Button
                  key={t.val}
                  type="button"
                  size="sm"
                  variant={taxRatePercent === t.val ? 'default' : 'outline'}
                  className="text-xs px-1"
                  onClick={() => setTaxRatePercent(t.val)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 주휴수당 인정 상태 */}
        <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-neutral-500" />
            <span>
              주휴수당 적용 여부 (주 15시간 이상 근무):{' '}
              {result.hasHolidayAllowance ? (
                <strong className="text-teal-600 font-semibold">
                  적용 대상 (주당 +{result.holidayAllowanceHours}시간 인정)
                </strong>
              ) : (
                <strong className="text-neutral-500">미적용 (주 15시간 미만)</strong>
              )}
            </span>
          </div>
          <Badge variant={result.hasHolidayAllowance ? 'default' : 'secondary'}>
            {result.hasHolidayAllowance ? '주휴 유급 포함' : '기본 근무만'}
          </Badge>
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div>
              <span className="text-sm text-neutral-500">예상 월 실수령액</span>
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                {result.netMonthlyWage.toLocaleString()}
                <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                  원
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-sm">
              <div>
                <span className="text-neutral-500 block text-xs">월 환산 유급시간 (월평균 4.345주)</span>
                <span className="font-semibold">{result.monthlyPaidHours}시간</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">세전 월 급여</span>
                <span className="font-semibold">{result.grossWage.toLocaleString()}원</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">
                  세금 공제 ({taxRatePercent}%)
                </span>
                <span className="font-semibold text-red-500">
                  -{result.taxAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
