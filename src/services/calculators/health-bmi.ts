import { HealthInput, HealthResult, BmiStatus } from './types';

/**
 * 8. 체질량지수(BMI) 및 기초대사량(BMR) 계산기
 * - BMI: 체중(kg) / (신장(m))^2
 * - 대한비만학회 기준: 저체중 < 18.5, 정상 18.5~22.9, 비만전단계 23~24.9, 1단계 25~29.9, 2단계 30~34.9, 3단계 >= 35
 * - BMR (Mifflin-St Jeor): 10 * 체중 + 6.25 * 키 - 5 * 만나이 + (남: +5, 여: -161)
 */
export function calculateHealth(input: HealthInput): HealthResult {
  const { heightCm, weightKg, age, gender } = input;

  if (heightCm <= 0 || weightKg <= 0 || age <= 0) {
    throw new Error('키, 몸무게, 나이는 0보다 커야 합니다.');
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round((rawBmi + Number.EPSILON) * 10) / 10;

  let bmiStatus: BmiStatus = '정상';
  if (bmi < 18.5) {
    bmiStatus = '저체중';
  } else if (bmi < 23) {
    bmiStatus = '정상';
  } else if (bmi < 25) {
    bmiStatus = '비만전단계';
  } else if (bmi < 30) {
    bmiStatus = '1단계비만';
  } else if (bmi < 35) {
    bmiStatus = '2단계비만';
  } else {
    bmiStatus = '3단계비만';
  }

  const genderOffset = gender === 'male' ? 5 : -161;
  const rawBmr = 10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset;
  const bmrKcal = Math.round(rawBmr);

  return {
    bmi,
    bmiStatus,
    bmrKcal,
  };
}
