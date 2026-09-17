'use client';

import React, { useState } from 'react';
import { calculateHealth } from '@/services/calculators/health-bmi';
import { Gender, BmiStatus } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Flame, HeartPulse } from 'lucide-react';

export function HealthCalculator() {
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<Gender>('male');

  const result = React.useMemo(() => {
    try {
      return calculateHealth({
        heightCm,
        weightKg,
        age,
        gender,
      });
    } catch {
      return null;
    }
  }, [heightCm, weightKg, age, gender]);

  const getStatusColor = (status: BmiStatus) => {
    switch (status) {
      case '저체중':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case '정상':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '비만전단계':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case '1단계비만':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case '2단계비만':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case '3단계비만':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">체질량지수(BMI) & 기초대사량(BMR) 계산기</CardTitle>
            <CardDescription>
              대한비만학회 기준 비만도 진단 및 미플린-세인트 지어 공식 기반 기초대사량
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={gender === 'male' ? 'default' : 'outline'}
            onClick={() => setGender('male')}
          >
            남성 (Male)
          </Button>
          <Button
            type="button"
            variant={gender === 'female' ? 'default' : 'outline'}
            onClick={() => setGender('female')}
          >
            여성 (Female)
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>신장 (키)</Label>
            <FormattedNumberInput
              value={heightCm}
              onChange={setHeightCm}
              allowDecimal={true}
              unitSuffix="cm"
              placeholder="175"
            />
          </div>

          <div className="space-y-2">
            <Label>체중 (몸무게)</Label>
            <FormattedNumberInput
              value={weightKg}
              onChange={setWeightKg}
              allowDecimal={true}
              unitSuffix="kg"
              placeholder="70"
            />
          </div>

          <div className="space-y-2">
            <Label>만 나이</Label>
            <FormattedNumberInput
              value={age}
              onChange={setAge}
              unitSuffix="세"
              placeholder="30"
            />
          </div>
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-neutral-500">체질량지수 (BMI)</span>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {result.bmi}
                  </div>
                  <Badge variant="outline" className={`text-sm px-2.5 py-0.5 ${getStatusColor(result.bmiStatus)}`}>
                    {result.bmiStatus}
                  </Badge>
                </div>
                <div className="text-xs text-neutral-400">대한비만학회 기준 (정상: 18.5 ~ 22.9)</div>
              </div>

              <div className="space-y-1">
                <span className="text-sm text-neutral-500 flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" /> 기초대사량 (BMR)
                </span>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {result.bmrKcal.toLocaleString()}
                  <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                    kcal
                  </span>
                </div>
                <div className="text-xs text-neutral-400">생명 유지에 필요한 최소 에너지량</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
