'use client';

import React, { useState } from 'react';
import { calculateUnitPrice } from '@/services/calculators/unit-price';
import { ProductItem, WeightVolumeUnit } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, Plus, Trash2, Trophy, Sparkles } from 'lucide-react';

export function UnitPriceCalculator() {
  const [products, setProducts] = useState<ProductItem[]>([
    { id: '1', name: '상품 A', price: 8900, capacity: 750, unit: 'g' },
    { id: '2', name: '상품 B', price: 12000, capacity: 1.2, unit: 'kg' },
  ]);

  const addProduct = () => {
    const nextChar = String.fromCharCode(65 + products.length);
    const defaultUnit = products[0]?.unit || 'g';
    setProducts([
      ...products,
      {
        id: String(Date.now()),
        name: `상품 ${nextChar}`,
        price: 0,
        capacity: 0,
        unit: defaultUnit,
      },
    ]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= 2) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    setProducts(products.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const result = React.useMemo(() => {
    return calculateUnitPrice(products);
  }, [products]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl">단위 가격 비교 (가성비) 계산기</CardTitle>
              <CardDescription>
                무게/용량/개수별 단가를 100g, 100ml, 1개 기준으로 자동 환산 비교
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={addProduct} className="gap-1.5">
            <Plus className="w-4 h-4" /> 상품 추가
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          {products.map((product, idx) => {
            const normalized = result.products.find((p) => p.id === product.id);

            return (
              <div
                key={product.id}
                className={`p-4 rounded-xl border transition-all ${
                  normalized?.isBestDeal
                    ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{product.name}</span>
                    {normalized?.isBestDeal && (
                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs">
                        <Trophy className="w-3 h-3" /> 최저가 (가성비 1등)
                      </Badge>
                    )}
                  </div>
                  {products.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-neutral-400 hover:text-red-500"
                      onClick={() => removeProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-4 space-y-1">
                    <Label className="text-xs text-neutral-500">가격</Label>
                    <FormattedNumberInput
                      value={product.price}
                      onChange={(val) => updateProduct(product.id, { price: val })}
                      unitSuffix="원"
                      placeholder="0"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <Label className="text-xs text-neutral-500">용량 / 수량</Label>
                    <FormattedNumberInput
                      value={product.capacity}
                      onChange={(val) => updateProduct(product.id, { capacity: val })}
                      allowDecimal={true}
                      placeholder="0"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <Label className="text-xs text-neutral-500">단위</Label>
                    <div className="flex gap-1">
                      {(['g', 'kg', 'ml', 'L', 'count'] as WeightVolumeUnit[]).map((u) => (
                        <Button
                          key={u}
                          type="button"
                          variant={product.unit === u ? 'default' : 'secondary'}
                          size="sm"
                          className="flex-1 px-1 text-xs h-9"
                          onClick={() => updateProduct(product.id, { unit: u })}
                        >
                          {u === 'count' ? '개' : u}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {normalized && normalized.unitPrice100 > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-neutral-500">
                      기준 단가 ({result.baseUnitLabel}당):{' '}
                      <strong className="text-neutral-900 dark:text-neutral-100 font-mono">
                        {normalized.unitPrice100.toLocaleString()}원
                      </strong>
                    </span>
                    {!normalized.isBestDeal && normalized.priceDiffPercent > 0 && (
                      <span className="text-red-500 font-medium">
                        최저가 대비 +{normalized.priceDiffPercent}% 더 비쌈
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 종합 요약 */}
        {result.bestDealId && (
          <div className="p-4 rounded-xl bg-neutral-900 text-white dark:bg-neutral-800 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-sm">
              가장 가성비 좋은 선택은{' '}
              <span className="text-emerald-400 font-bold">
                {products.find((p) => p.id === result.bestDealId)?.name}
              </span>
              입니다!{' '}
              <span className="text-neutral-300">
                (기준단가 {result.products.find((p) => p.isBestDeal)?.unitPrice100.toLocaleString()}
                원/{result.baseUnitLabel})
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
