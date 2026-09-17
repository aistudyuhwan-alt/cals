'use client';

import React, { useState } from 'react';
import { calculateDiscount, calculateReverseDiscount } from '@/services/calculators/discount';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tag, Percent, Plus, X } from 'lucide-react';

export function DiscountCalculator() {
  const [tab, setTab] = useState<'standard' | 'reverse'>('standard');

  // 표준 할인 모드 상태
  const [originalPrice, setOriginalPrice] = useState<number>(50000);
  const [discountRates, setDiscountRates] = useState<number[]>([20]);
  const [couponAmount, setCouponAmount] = useState<number>(3000);

  // 역할인 모드 상태
  const [revOriginalPrice, setRevOriginalPrice] = useState<number>(50000);
  const [revFinalPrice, setRevFinalPrice] = useState<number>(35000);

  const addDiscountRate = () => {
    if (discountRates.length >= 3) return;
    setDiscountRates([...discountRates, 10]);
  };

  const removeDiscountRate = (idx: number) => {
    if (discountRates.length <= 1) return;
    setDiscountRates(discountRates.filter((_, i) => i !== idx));
  };

  const updateDiscountRate = (idx: number, val: number) => {
    const next = [...discountRates];
    next[idx] = val;
    setDiscountRates(next);
  };

  const standardResult = React.useMemo(() => {
    return calculateDiscount({
      originalPrice,
      discountRates,
      couponAmount,
    });
  }, [originalPrice, discountRates, couponAmount]);

  const reverseResult = React.useMemo(() => {
    return calculateReverseDiscount({
      originalPrice: revOriginalPrice,
      finalPrice: revFinalPrice,
    });
  }, [revOriginalPrice, revFinalPrice]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">할인율 및 역할인 계산기</CardTitle>
            <CardDescription>
              순차 복합 할인율/쿠폰 적용 계산 및 판매가 기준 실질 할인율 역산
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={tab === 'standard' ? 'default' : 'outline'}
            onClick={() => setTab('standard')}
          >
            기본 할인율 계산 (할인가 구하기)
          </Button>
          <Button
            type="button"
            variant={tab === 'reverse' ? 'default' : 'outline'}
            onClick={() => setTab('reverse')}
          >
            역할인 계산 (실제 할인율 역산)
          </Button>
        </div>

        {tab === 'standard' ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>정상가 (원가)</Label>
                <FormattedNumberInput
                  value={originalPrice}
                  onChange={setOriginalPrice}
                  unitSuffix="원"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>추가 정액 할인 쿠폰</Label>
                <FormattedNumberInput
                  value={couponAmount}
                  onChange={setCouponAmount}
                  unitSuffix="원"
                  placeholder="0"
                />
              </div>
            </div>

            {/* 순차 퍼센트 할인율 목록 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">퍼센트(%) 할인율 (순차 중복 적용 가능)</Label>
                {discountRates.length < 3 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-pink-600 hover:text-pink-700 h-7"
                    onClick={addDiscountRate}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> 할인 추가
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {discountRates.map((rate, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400">{idx + 1}차 할인:</span>
                    <div className="w-28">
                      <FormattedNumberInput
                        value={rate}
                        onChange={(v) => updateDiscountRate(idx, Math.min(100, Math.max(0, v)))}
                        unitSuffix="%"
                        placeholder="0"
                      />
                    </div>
                    {discountRates.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-neutral-400 hover:text-red-500"
                        onClick={() => removeDiscountRate(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 결과 */}
            {standardResult && (
              <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div>
                  <span className="text-sm text-neutral-500">최종 결제 금액</span>
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {standardResult.finalPrice.toLocaleString()}
                    <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                      원
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t text-sm">
                  <div>
                    <span className="text-neutral-500 block text-xs">총 할인된 금액</span>
                    <span className="font-semibold text-emerald-600">
                      -{standardResult.totalDiscountAmount.toLocaleString()}원
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-xs">실질 복합 할인율</span>
                    <span className="font-semibold text-pink-600">
                      {standardResult.effectiveDiscountRate}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 역할인 모드 */
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>원래 가격 (정상가)</Label>
                <FormattedNumberInput
                  value={revOriginalPrice}
                  onChange={setRevOriginalPrice}
                  unitSuffix="원"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>실제 지불 금액 (판매가)</Label>
                <FormattedNumberInput
                  value={revFinalPrice}
                  onChange={setRevFinalPrice}
                  unitSuffix="원"
                  placeholder="0"
                />
              </div>
            </div>

            {reverseResult && (
              <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div>
                  <span className="text-sm text-neutral-500">실질 할인율</span>
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {reverseResult.discountRate}%
                    <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                      할인
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t text-sm">
                  <span className="text-neutral-500 block text-xs">절약한 금액</span>
                  <span className="font-semibold text-emerald-600">
                    {reverseResult.discountAmount.toLocaleString()}원
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
