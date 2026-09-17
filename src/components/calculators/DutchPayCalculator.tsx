'use client';

import React, { useState } from 'react';
import { calculateDutchPay } from '@/services/calculators/dutch-pay';
import { RoundMode } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Users, Coins, Calculator, Check, Copy } from 'lucide-react';

export function DutchPayCalculator() {
  const [totalAmount, setTotalAmount] = useState<number>(53000);
  const [numPeople, setNumPeople] = useState<number>(4);
  const [roundUnit, setRoundUnit] = useState<number>(100);
  const [roundMode, setRoundMode] = useState<RoundMode>('round_down');
  const [copied, setCopied] = useState(false);

  const result = React.useMemo(() => {
    try {
      if (numPeople <= 0) return null;
      return calculateDutchPay({
        totalAmount,
        numPeople,
        roundUnit,
        roundMode,
      });
    } catch {
      return null;
    }
  }, [totalAmount, numPeople, roundUnit, roundMode]);

  const handleCopy = () => {
    if (!result) return;
    const text = `[더치페이 정산]\n총 금액: ${totalAmount.toLocaleString()}원\n인원: ${numPeople}명\n1인당: ${result.perPersonAmount.toLocaleString()}원${
      result.difference !== 0 ? `\n차액(잔여/추가): ${result.difference.toLocaleString()}원` : ''
    }`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">더치페이 / N빵 계산기</CardTitle>
              <CardDescription>
                인원수대로 깔끔하게 나누고, 100원·1,000원 단위 올림/버림 정산
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>총 결제 금액</Label>
            <FormattedNumberInput
              value={totalAmount}
              onChange={setTotalAmount}
              unitSuffix="원"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-neutral-500" /> 참여 인원수
            </Label>
            <FormattedNumberInput
              value={numPeople}
              onChange={(val) => setNumPeople(Math.max(1, val))}
              unitSuffix="명"
              placeholder="1"
            />
          </div>
        </div>

        {/* 절사/올림 단위 설정 */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">정산 단위 설정</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: '1원 (정밀)', value: 1 },
              { label: '10원 단위', value: 10 },
              { label: '100원 단위', value: 100 },
              { label: '1,000원 단위', value: 1000 },
            ].map((unit) => (
              <Button
                key={unit.value}
                type="button"
                variant={roundUnit === unit.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoundUnit(unit.value)}
              >
                {unit.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 처리 방식 (올림, 버림, 미적용) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">단위 처리 방식</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={roundMode === 'round_down' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoundMode('round_down')}
            >
              버림 (주최자 추가부담)
            </Button>
            <Button
              type="button"
              variant={roundMode === 'round_up' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoundMode('round_up')}
            >
              올림 (잔액 남김)
            </Button>
            <Button
              type="button"
              variant={roundMode === 'none' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoundMode('none')}
            >
              정밀 분할
            </Button>
          </div>
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="text-sm text-neutral-500">1인당 보낼 금액</span>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {result.perPersonAmount.toLocaleString()}
                  <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                    원
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="self-start sm:self-auto gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? '복사됨!' : '정산 내용 복사'}
              </Button>
            </div>

            <div className="text-xs sm:text-sm text-neutral-500 pt-2 border-t flex flex-wrap gap-x-6 gap-y-1">
              <div>정확한 1인 몫: {result.rawShare.toLocaleString()}원</div>
              {result.difference !== 0 && (
                <div className={result.difference > 0 ? 'text-amber-600' : 'text-blue-600'}>
                  {result.difference > 0
                    ? `잔여 차액: +${result.difference.toLocaleString()}원 (총무/주최자 부담)`
                    : `초과 수금액: ${Math.abs(result.difference).toLocaleString()}원`}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
