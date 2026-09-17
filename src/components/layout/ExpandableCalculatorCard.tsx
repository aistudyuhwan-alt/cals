'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LucideIcon, ChevronDown, Sparkles } from 'lucide-react';
import { CalculatorSkeleton } from '@/components/common/CalculatorSkeleton';
import { Badge } from '@/components/ui/badge';

interface ExpandableCalculatorCardProps {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  delayIndex?: number;
}

export function ExpandableCalculatorCard({
  id,
  name,
  category,
  icon: Icon,
  description,
  isExpanded,
  onToggle,
  children,
  delayIndex = 0,
}: ExpandableCalculatorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 스크롤 감지 IntersectionObserver (Fade-up)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 카드 클릭 시 스켈레톤 잠깐 표시 (부드러운 로딩 경험)
  const handleToggle = () => {
    if (!isExpanded) {
      setIsLoading(true);
      onToggle();
      setTimeout(() => {
        setIsLoading(false);
      }, 260);
    } else {
      onToggle();
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case '생활/소비':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case '금융/자산':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case '일상/건강':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <div
      ref={cardRef}
      id={`calc-${id}`}
      style={{
        transitionDelay: `${(delayIndex % 3) * 60}ms`,
      }}
      className={`fade-up-init ${isVisible ? 'fade-up-active' : ''} transition-all duration-300`}
    >
      <div
        className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
          isExpanded
            ? 'glass-panel ring-2 ring-blue-500/40 shadow-xl dark:shadow-blue-950/20'
            : 'glass-panel-subtle hover:scale-[1.01] hover:border-neutral-400/40 dark:hover:border-neutral-600/40 hover:shadow-lg'
        }`}
      >
        {/* 카드 헤더 (클릭 시 토글) */}
        <button
          type="button"
          onClick={handleToggle}
          className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                isExpanded
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                  : 'bg-white/80 dark:bg-neutral-800/80 text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-105'
              }`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {name}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(
                    category
                  )}`}
                >
                  {category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hidden sm:inline-block">
              {isExpanded ? '접기' : '계산하기'}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center bg-neutral-200/50 dark:bg-neutral-800/60 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 bg-blue-100 dark:bg-blue-950 text-blue-600' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </button>

        {/* 확장 영역 (계산기 본체 및 Skeleton UI) */}
        {isExpanded && (
          <div className="border-t border-white/20 dark:border-white/10 bg-white/20 dark:bg-neutral-950/20 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
            {isLoading ? (
              <CalculatorSkeleton />
            ) : (
              <div className="p-4 sm:p-6">{children}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
