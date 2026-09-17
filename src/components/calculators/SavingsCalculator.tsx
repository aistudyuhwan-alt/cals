'use client';

import React, { useState } from 'react';
import { calculateSavings } from '@/services/calculators/savings-interest';
import { SavingsType, TaxType } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PiggyBank, ArrowRight, ShieldCheck } from 'lucide-react';

export function SavingsCalculator() {
  const [type, setType] = useState<SavingsType>('deposit');
  const [principal, setPrincipal] = useState<number>(10000000);
  const [annualRate, setAnnualRate] = useState<number>(3.5);
  const [months, setMonths] = useState<number>(12);
  const [taxType, setTaxType] = useState<TaxType>('normal');

  const result = React.useMemo(() => {
    try {
      return calculateSavings({
        type,
        principal,
        annualRate,
        months,
        taxType,
      });
    } catch {
      return null;
    }
  }, [type, principal, annualRate, months, taxType]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">예·적금 만기 이자 계산기</CardTitle>
            <CardDescription>
              정기예금(일시납)과 정기적금(월 복합납입)의 세전/세후 실수령액 비교
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 상품 종류 선택 */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={type === 'deposit' ? 'default' : 'outline'}
            onClick={() => {
              setType('deposit');
              if (principal < 1000000) setPrincipal(10000000);
            }}
          >
            정기예금 (목돈 굴리기)
          </Button>
          <Button
            type="button"
            variant={type === 'savings' ? 'default' : 'outline'}
            onClick={() => {
              setType('savings');
              if (principal > 5000000) setPrincipal(500000);
            }}
          >
            정기적금 (목돈 모으기)
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>{type === 'deposit' ? '예치 금액 (원금)' : '월 납입 금액'}</Label>
            <FormattedNumberInput
              value={principal}
              onChange={setPrincipal}
              unitSuffix="원"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>연이율</Label>
            <FormattedNumberInput
              value={annualRate}
              onChange={setAnnualRate}
              allowDecimal={true}
              unitSuffix="%"
              placeholder="0.0"
            />
          </div>

          <div className="space-y-2">
            <Label>가입 기간</Label>
            <FormattedNumberInput
              value={months}
              onChange={setMonths}
              unitSuffix="개월"
              placeholder="12"
            />
          </div>
        </div>

        {/* 과세 구분 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">과세 조건</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: '일반과세 (15.4%)' },
              { id: 'preferential', label: '세금우대 (9.5%)' },
              { id: 'free', label: '비과세 (0%)' },
            ].map((t) => (
              <Button
                key={t.id}
                type="button"
                variant={taxType === t.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTaxType(t.id as TaxType)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div>
              <span className="text-sm text-neutral-500">만기 총 실수령액</span>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {result.netAmount.toLocaleString()}
                <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                  원
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-sm">
              <div>
                <span className="text-neutral-500 block text-xs">총 납입원금</span>
                <span className="font-semibold">{result.totalPrincipal.toLocaleString()}원</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">세전 이자</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  +{result.preTaxInterest.toLocaleString()}원
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">
                  이자소득세 ({(result.taxRate * 100).toFixed(1)}%)
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
