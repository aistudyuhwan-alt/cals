'use client';

import React from 'react';
import {
  Coins,
  Scale,
  PiggyBank,
  Landmark,
  Wallet,
  Tag,
  CalendarDays,
  Activity,
  Fuel,
  Building2,
} from 'lucide-react';

export interface CategoryTab {
  id: string;
  name: string;
  category: '생활/소비' | '금융/자산' | '일상/건강';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const CALCULATOR_TABS: CategoryTab[] = [
  // 생활 / 소비
  {
    id: 'dutch',
    name: '더치페이 / N빵',
    category: '생활/소비',
    icon: Coins,
    description: '인원수 정산 및 절사 단위 조정',
  },
  {
    id: 'unit_price',
    name: '단위 가격 비교',
    category: '생활/소비',
    icon: Scale,
    description: '100g·100ml·1개당 최저 가성비 비교',
  },
  {
    id: 'discount',
    name: '할인율 & 역할인',
    category: '생활/소비',
    icon: Tag,
    description: '중복 할인 계산 및 실질 할인율 역산',
  },

  // 금융 / 자산
  {
    id: 'savings',
    name: '예·적금 만기 이자',
    category: '금융/자산',
    icon: PiggyBank,
    description: '예금·적금 세전/세후 만기 실수령액',
  },
  {
    id: 'loan',
    name: '대출 상환액',
    category: '금융/자산',
    icon: Landmark,
    description: '원리금균등 vs 원금균등 월별 상환 스케줄',
  },
  {
    id: 'salary',
    name: '급여 & 시급/주휴수당',
    category: '금융/자산',
    icon: Wallet,
    description: '주휴수당 자동 판별 및 실수령액',
  },
  {
    id: 'real_estate',
    name: '부동산 중개보수',
    category: '금융/자산',
    icon: Building2,
    description: '공인중개사법 기준 상한요율 및 복비',
  },

  // 일상 / 건강
  {
    id: 'date',
    name: '날짜 & D-Day',
    category: '일상/건강',
    icon: CalendarDays,
    description: '디데이, N일 후, 주말 제외 순수 영업일',
  },
  {
    id: 'health',
    name: 'BMI & 기초대사량',
    category: '일상/건강',
    icon: Activity,
    description: '비만도 진단 및 1일 필요 BMR 칼로리',
  },
  {
    id: 'fuel',
    name: '자동차 유류비',
    category: '일상/건강',
    icon: Fuel,
    description: '주행거리·연비 유류비 및 카풀 n빵',
  },
];
