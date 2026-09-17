'use client';

import React, { useState } from 'react';
import { calculateFuel } from '@/services/calculators/fuel-cost';
import { TripType } from '@/services/calculators/types';
import { FormattedNumberInput } from '@/components/common/FormattedNumberInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Fuel, Car, Users } from 'lucide-react';

export function FuelCalculator() {
  const [distanceKm, setDistanceKm] = useState<number>(100);
  const [fuelEfficiency, setFuelEfficiency] = useState<number>(12.5);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(1650);
  const [tripType, setTripType] = useState<TripType>('round_trip');
  const [passengers, setPassengers] = useState<number>(4);

  const result = React.useMemo(() => {
    return calculateFuel({
      distanceKm,
      fuelEfficiency,
      fuelPricePerLiter,
      tripType,
      passengers,
    });
  }, [distanceKm, fuelEfficiency, fuelPricePerLiter, tripType, passengers]);

  return (
    <Card className="w-full shadow-sm border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">자동차 유류비 및 연비 계산기</CardTitle>
            <CardDescription>
              편도/왕복 주행 거리와 연비 기준 예상 주유비 및 카풀 1인당 분담금 산출
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={tripType === 'one_way' ? 'default' : 'outline'}
            onClick={() => setTripType('one_way')}
          >
            편도 주행 (x1)
          </Button>
          <Button
            type="button"
            variant={tripType === 'round_trip' ? 'default' : 'outline'}
            onClick={() => setTripType('round_trip')}
          >
            왕복 주행 (x2)
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>편도 주행 거리</Label>
            <FormattedNumberInput
              value={distanceKm}
              onChange={setDistanceKm}
              allowDecimal={true}
              unitSuffix="km"
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <Label>차량 연비</Label>
            <FormattedNumberInput
              value={fuelEfficiency}
              onChange={setFuelEfficiency}
              allowDecimal={true}
              unitSuffix="km/L"
              placeholder="12.5"
            />
          </div>

          <div className="space-y-2">
            <Label>리터당 유가</Label>
            <FormattedNumberInput
              value={fuelPricePerLiter}
              onChange={setFuelPricePerLiter}
              unitSuffix="원/L"
              placeholder="1650"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-neutral-500" /> 탑승 인원
            </Label>
            <FormattedNumberInput
              value={passengers}
              onChange={(val) => setPassengers(Math.max(1, val))}
              unitSuffix="명"
              placeholder="1"
            />
          </div>
        </div>

        {/* 결과 영역 */}
        {result && (
          <div className="mt-6 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-neutral-500">총 예상 유류비</span>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {result.totalFuelCost.toLocaleString()}
                  <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                    원
                  </span>
                </div>
              </div>

              {passengers > 1 && (
                <div>
                  <span className="text-sm text-neutral-500">1인당 분담 금액 ({passengers}인 카풀)</span>
                  <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {result.costPerPassenger.toLocaleString()}
                    <span className="text-lg font-normal text-neutral-600 dark:text-neutral-400 ml-1">
                      원
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t text-sm">
              <div>
                <span className="text-neutral-500 block text-xs">총 주행거리</span>
                <span className="font-semibold">{result.totalDistance} km</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-xs">예상 소모 유량</span>
                <span className="font-semibold">{result.requiredLiters} L</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
