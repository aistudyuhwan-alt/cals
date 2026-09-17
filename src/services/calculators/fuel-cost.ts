import { FuelInput, FuelResult } from './types';

/**
 * 9. 자동차 유류비 및 연비 계산기
 * - 유효거리 = 편도 ? distance : distance * 2
 * - 소모 유량 = 유효거리 / 연비
 * - 총 유류비 = Math.floor(소모유량 * 유류단가)
 * - 1인당 비용 = Math.ceil(총 유류비 / 탑승인원)
 */
export function calculateFuel(input: FuelInput): FuelResult {
  const { distanceKm, fuelEfficiency, fuelPricePerLiter, tripType, passengers } = input;

  if (distanceKm <= 0 || fuelEfficiency <= 0 || fuelPricePerLiter <= 0) {
    return {
      totalDistance: 0,
      requiredLiters: 0,
      totalFuelCost: 0,
      costPerPassenger: 0,
    };
  }

  const multiplier = tripType === 'round_trip' ? 2 : 1;
  const totalDistance = distanceKm * multiplier;

  const requiredLiters = totalDistance / fuelEfficiency;
  const totalFuelCost = Math.floor(requiredLiters * fuelPricePerLiter);
  const passengerCount = passengers > 0 ? passengers : 1;
  const costPerPassenger = Math.ceil(totalFuelCost / passengerCount);

  return {
    totalDistance,
    requiredLiters: Math.round((requiredLiters + Number.EPSILON) * 100) / 100,
    totalFuelCost,
    costPerPassenger,
  };
}
