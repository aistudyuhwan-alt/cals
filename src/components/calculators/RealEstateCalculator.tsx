'use client';

import React, { useState } from 'react';
import { calculateRealEstateFee } from '@/services/calculators/real-estate-fee';
import { PropertyType, DealType } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Building2, Home, HelpCircle } from 'lucide-react';

export function RealEstateCalculator() {
  const [propertyType, setPropertyType] = useState<PropertyType>('housing');
  const [dealType, setDealType] = useState<DealType>('buy');
  const [dealAmount, setDealAmount] = useState<number>(300000000); // 3억원
  const [monthlyPay, setMonthlyPay] = useState<number>(500000); // 월세 50만원

  const result = React.useMemo(() => {
    return calculateRealEstateFee({
      propertyType,
      dealType,
      dealAmount,
      monthlyPay,
    });
  }, [propertyType, dealType, dealAmount, monthlyPay]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">부동산 중개보수(복비) 계산기</CardTitle>
            <CardDescription>
              공인중개사법 기준 상한요율/한도액 및 월세 환산보증금 보정 자동 계산
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 매물 종류 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">매물 종류</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'housing', label: '주택 (아파트/빌라)' },
              { id: 'officetel', label: '주거용 오피스텔' },
              { id: 'general', label: '토지 / 상가' },
            ].map((p) => (
              <Button
                key={p.id}
                type="button"
                variant={propertyType === p.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPropertyType(p.id as PropertyType)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 거래 유형 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">거래 유형</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'buy', label: '매매 / 교환' },
              { id: 'rent', label: '전세' },
              { id: 'monthly_rent', label: '월세' },
            ].map((d) => (
              <Button
                key={d.id}
                type="button"
                variant={dealType === d.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDealType(d.id as DealType)}
              >
                {d.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 금액 입력 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              {dealType === 'buy' ? '매매 대금' : dealType === 'rent' ? '전세 보증금' : '월세 보증금'}
            </Label>
            <FormattedNumberInput
              value={dealAmount}
              onChange={setDealAmount}
              unitSuffix="원"
              placeholder="0"
            />
          </div>

          {dealType === 'monthly_rent' && (
            <div className="space-y-2">
              <Label>월세액</Label>
              <FormattedNumberInput
                value={monthlyPay}
                onChange={setMonthlyPay}
                unitSuffix="원"
                placeholder="0"
              />
            </div>
          )}
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div>
              <span className="text-sm text-neutral-500">최대 중개보수 상한액 (부가세 별도)</span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {result.maxBrokerageFee.toLocaleString()}
                <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                  원
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-sm">
              <div>
                <span className="text-neutral-500 block text-xs">산정 거래금액</span>
                <span className="font-semibold">
                  {result.calculatedDealAmount.toLocaleString()}원
                </span>
                {dealType === 'monthly_rent' && (
                  <span className="text-[11px] text-neutral-400 block">
                    (환산보증금 산정 완료)
                  </span>
                )}
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">적용 상한 요율</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {result.appliedRate}%
                </span>
                <span className="text-[11px] text-neutral-400 block truncate">
                  {result.rateDescription}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">부가세 포함 (10%)</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {result.totalWithVat.toLocaleString()}원
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  (VAT {result.vat.toLocaleString()}원)
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
