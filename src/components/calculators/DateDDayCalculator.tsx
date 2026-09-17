'use client';

import React, { useState } from 'react';
import { calculateDate } from '@/services/calculators/date-dday';
import { DateCalcMode } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays, CalendarCheck, Briefcase } from 'lucide-react';

export function DateDDayCalculator() {
  const today = new Date().toISOString().split('T')[0];
  const [mode, setMode] = useState<DateCalcMode>('dday');
  const [startDate, setStartDate] = useState<string>(today);
  const [targetDate, setTargetDate] = useState<string>(today);
  const [daysToAdd, setDaysToAdd] = useState<number>(100);

  const result = React.useMemo(() => {
    try {
      return calculateDate({
        mode,
        startDate,
        targetDate,
        daysToAdd,
      });
    } catch {
      return null;
    }
  }, [mode, startDate, targetDate, daysToAdd]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">날짜 및 D-Day / 전역일 계산기</CardTitle>
            <CardDescription>
              디데이 카운트, 특정 일수(+N일) 후 날짜, 주말 제외 순수 영업일 수 계산
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant={mode === 'dday' ? 'default' : 'outline'}
            onClick={() => setMode('dday')}
          >
            D-Day 계산
          </Button>
          <Button
            type="button"
            variant={mode === 'add_days' ? 'default' : 'outline'}
            onClick={() => setMode('add_days')}
          >
            N일 후/전 날짜
          </Button>
          <Button
            type="button"
            variant={mode === 'business_days' ? 'default' : 'outline'}
            onClick={() => setMode('business_days')}
          >
            영업일 수 계산
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>시작일 (기준일)</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="font-mono"
            />
          </div>

          {mode === 'add_days' ? (
            <div className="space-y-2">
              <Label>더할 일수 (+ 또는 -)</Label>
              <FormattedNumberInput
                value={daysToAdd}
                onChange={setDaysToAdd}
                unitSuffix="일"
                placeholder="100"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>목표일 (종료일)</Label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="font-mono"
              />
            </div>
          )}
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            {mode === 'dday' && (
              <div>
                <span className="text-sm text-neutral-500">
                  {result.isPast ? '기준일로부터 경과일' : '남은 D-Day'}
                </span>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {result.isPast ? `D+${result.diffDays}` : result.diffDays === 0 ? 'D-Day (오늘)' : `D-${result.diffDays}`}
                  <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-2">
                    ({result.diffDays}일 {result.isPast ? '지남' : '남음'})
                  </span>
                </div>
              </div>
            )}

            {mode === 'add_days' && (
              <div>
                <span className="text-sm text-neutral-500">
                  {daysToAdd >= 0 ? `${daysToAdd}일 후 날짜` : `${Math.abs(daysToAdd)}일 전 날짜`}
                </span>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {result.resultDate}
                </div>
              </div>
            )}

            {mode === 'business_days' && (
              <div>
                <span className="text-sm text-neutral-500">순수 영업일 (주말 토/일 제외)</span>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {result.diffDays}
                  <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                    일
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
