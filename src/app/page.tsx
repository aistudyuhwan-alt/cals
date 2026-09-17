'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { CALCULATOR_TABS } from '@/components/layout/constants';
import { ExpandableCalculatorCard } from '@/components/layout/ExpandableCalculatorCard';
import { DutchPayCalculator } from '@/components/calculators/DutchPayCalculator';
import { UnitPriceCalculator } from '@/components/calculators/UnitPriceCalculator';
import { SavingsCalculator } from '@/components/calculators/SavingsCalculator';
import { LoanCalculator } from '@/components/calculators/LoanCalculator';
import { SalaryCalculator } from '@/components/calculators/SalaryCalculator';
import { DiscountCalculator } from '@/components/calculators/DiscountCalculator';
import { DateDDayCalculator } from '@/components/calculators/DateDDayCalculator';
import { HealthCalculator } from '@/components/calculators/HealthCalculator';
import { FuelCalculator } from '@/components/calculators/FuelCalculator';
import { RealEstateCalculator } from '@/components/calculators/RealEstateCalculator';
import { Sparkles, Layers, SlidersHorizontal, Calculator } from 'lucide-react';

export default function Home() {
  // 열려 있는 카드의 ID (다중 또는 단일 확장 가능)
  const [expandedIds, setExpandedIds] = useState<string[]>(['dutch']);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const categories = ['전체', '생활/소비', '금융/자산', '일상/건강'];

  const filteredTabs = React.useMemo(() => {
    if (selectedCategory === '전체') return CALCULATOR_TABS;
    return CALCULATOR_TABS.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedIds(filteredTabs.map((t) => t.id));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const renderCalculatorComponent = (id: string) => {
    switch (id) {
      case 'dutch':
        return <DutchPayCalculator />;
      case 'unit_price':
        return <UnitPriceCalculator />;
      case 'savings':
        return <SavingsCalculator />;
      case 'loan':
        return <LoanCalculator />;
      case 'salary':
        return <SalaryCalculator />;
      case 'discount':
        return <DiscountCalculator />;
      case 'date':
        return <DateDDayCalculator />;
      case 'health':
        return <HealthCalculator />;
      case 'fuel':
        return <FuelCalculator />;
      case 'real_estate':
        return <RealEstateCalculator />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-x-hidden transition-colors duration-300">
        {/* 그레인 텍스처 배경 오버레이 */}
        <div className="pointer-events-none fixed inset-0 z-50 grain-overlay" />

        {/* 배경 은은한 그라데이션 블러 데코레이션 */}
        <div className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-blue-400/15 to-indigo-500/15 dark:from-blue-600/10 dark:to-violet-600/10 blur-[120px] rounded-full" />
        <div className="pointer-events-none fixed bottom-0 right-0 w-[420px] h-[420px] bg-gradient-to-tl from-emerald-400/10 to-teal-400/10 dark:from-emerald-600/5 dark:to-teal-600/5 blur-[130px] rounded-full" />

        <Header />

        <main className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
          {/* 상단 인트로 섹션 */}
          <section className="text-center space-y-3 pt-2 sm:pt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 shadow-sm backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" />
              <span>스마트한 일상 라이프의 필수 도구</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              INU 생활형 계산기
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              더치페이부터 대출 이자, 주휴수당, 단위 가격, 부동산 복비까지<br className="hidden sm:inline" />
              원하는 카드를 클릭하여 즉시 계산해 보세요.
            </p>
          </section>

          {/* 카테고리 필터 및 전체 펼치기/접기 컨트롤 */}
          <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl glass-panel-subtle">
            {/* 카테고리 필터 */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-white/40 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 전체 펼치기 / 접기 버튼 */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
              <button
                type="button"
                onClick={expandAll}
                className="px-3 py-1.5 rounded-lg border border-white/20 dark:border-white/10 bg-white/40 dark:bg-neutral-900/40 hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-colors text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                모두 펼치기
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-3 py-1.5 rounded-lg border border-white/20 dark:border-white/10 bg-white/40 dark:bg-neutral-900/40 hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-colors text-neutral-600 dark:text-neutral-300 cursor-pointer"
              >
                모두 접기
              </button>
            </div>
          </section>

          {/* 10대 계산기 아코디언 카드 리스트 (반응형 모바일/데스크톱 대응) */}
          <section className="space-y-4">
            {filteredTabs.map((item, idx) => {
              const isExpanded = expandedIds.includes(item.id);
              return (
                <ExpandableCalculatorCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  category={item.category}
                  icon={item.icon}
                  description={item.description}
                  isExpanded={isExpanded}
                  onToggle={() => toggleExpand(item.id)}
                  delayIndex={idx}
                >
                  {renderCalculatorComponent(item.id)}
                </ExpandableCalculatorCard>
              );
            })}
          </section>

          {/* 하단 푸터 (Copyright 본인이름) */}
          <footer className="pt-12 pb-8 border-t border-white/20 dark:border-white/10 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>INU 생활형 계산기</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              Copyright INU 생활형 계산기 by Yuhwan Seol
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              일상의 계산을 쉽고 스마트하게 돕는 10대 필수 생활형 웹 계산기
            </p>
          </footer>
        </main>
      </div>
    </ThemeProvider>
  );
}
