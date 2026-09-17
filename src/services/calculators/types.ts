// 1. 더치페이
export type RoundMode = 'round_up' | 'round_down' | 'none';

export interface DutchPayInput {
  totalAmount: number;
  numPeople: number;
  roundUnit: number;
  roundMode: RoundMode;
}

export interface DutchPayResult {
  perPersonAmount: number;
  difference: number;
  rawShare: number;
}

// 2. 단위 가격 비교
export type WeightVolumeUnit = 'g' | 'kg' | 'ml' | 'L' | 'count';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  capacity: number;
  unit: WeightVolumeUnit;
}

export interface NormalizedProduct extends ProductItem {
  capacityInBase: number; // g, ml, or count
  unitPrice100: number; // 100g, 100ml, 1개당 가격
  priceDiffPercent: number; // 최저가 대비 %
  isBestDeal: boolean;
}

export interface UnitPriceResult {
  products: NormalizedProduct[];
  bestDealId: string | null;
  baseUnitLabel: string;
}

// 3. 예적금 계산기
export type SavingsType = 'deposit' | 'savings';
export type TaxType = 'normal' | 'preferential' | 'free';

export interface SavingsInput {
  type: SavingsType;
  principal: number; // 예금: 총액, 적금: 월 납입액
  annualRate: number; // 연이율 %
  months: number; // 개월 수
  taxType: TaxType;
}

export interface SavingsResult {
  totalPrincipal: number;
  preTaxInterest: number;
  taxRate: number;
  taxAmount: number;
  netAmount: number;
}

// 4. 대출 상환 계산기
export type RepaymentMethod = 'amortizing' | 'equal_principal';

export interface LoanInput {
  principal: number;
  annualRate: number; // %
  months: number;
  method: RepaymentMethod;
}

export interface MonthlyPaymentDetail {
  month: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingBalance: number;
}

export interface LoanResult {
  monthlyPayments: MonthlyPaymentDetail[];
  totalInterest: number;
  totalRepayment: number;
  firstMonthPayment: number;
}

// 5. 급여 및 시급/주휴수당
export interface SalaryInput {
  hourlyWage: number;
  weeklyHours: number;
  taxRatePercent: number; // e.g. 0, 3.3, 9.4 (4대보험 등)
}

export interface SalaryResult {
  holidayAllowanceHours: number; // 주당 주휴수당 시간
  weeklyTotalHours: number;
  monthlyPaidHours: number;
  grossWage: number;
  taxAmount: number;
  netMonthlyWage: number;
  hasHolidayAllowance: boolean;
}

// 6. 할인율 및 역할인
export interface DiscountInput {
  originalPrice: number;
  discountRates: number[]; // e.g. [20, 10]
  couponAmount: number;
}

export interface DiscountResult {
  finalPrice: number;
  totalDiscountAmount: number;
  effectiveDiscountRate: number;
}

export interface ReverseDiscountInput {
  originalPrice: number;
  finalPrice: number;
}

export interface ReverseDiscountResult {
  discountAmount: number;
  discountRate: number;
}

// 7. 날짜 및 D-Day
export type DateCalcMode = 'dday' | 'add_days' | 'business_days';

export interface DateCalcInput {
  mode: DateCalcMode;
  startDate: string; // YYYY-MM-DD
  targetDate?: string; // YYYY-MM-DD
  daysToAdd?: number;
}

export interface DateCalcResult {
  diffDays: number;
  resultDate?: string;
  isPast?: boolean;
}

// 8. 체질량지수(BMI) & 기초대사량(BMR)
export type Gender = 'male' | 'female';
export type BmiStatus = '저체중' | '정상' | '비만전단계' | '1단계비만' | '2단계비만' | '3단계비만';

export interface HealthInput {
  heightCm: number;
  weightKg: number;
  age: number;
  gender: Gender;
}

export interface HealthResult {
  bmi: number;
  bmiStatus: BmiStatus;
  bmrKcal: number;
}

// 9. 자동차 유류비 및 연비
export type TripType = 'one_way' | 'round_trip';

export interface FuelInput {
  distanceKm: number;
  fuelEfficiency: number; // km/L
  fuelPricePerLiter: number; // 원
  tripType: TripType;
  passengers: number;
}

export interface FuelResult {
  totalDistance: number;
  requiredLiters: number;
  totalFuelCost: number;
  costPerPassenger: number;
}

// 10. 부동산 중개보수
export type PropertyType = 'housing' | 'officetel' | 'general';
export type DealType = 'buy' | 'rent' | 'monthly_rent';

export interface RealEstateInput {
  propertyType: PropertyType;
  dealType: DealType;
  dealAmount: number; // 매매/전세 금액 또는 월세 보증금
  monthlyPay?: number; // 월세일 경우 월세액
}

export interface RealEstateResult {
  calculatedDealAmount: number;
  appliedRate: number;
  maxBrokerageFee: number;
  vat: number;
  totalWithVat: number;
  rateDescription: string;
}
