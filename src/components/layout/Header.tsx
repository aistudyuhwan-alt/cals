'use client';

import React from 'react';
import { Calculator, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 dark:border-white/10 glass-panel">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                INU 생활형 계산기
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                10대 핵심
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
              일상의 모든 계산을 한곳에서 빠르고 정확하게
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 다크/라이트모드 토글 버튼 */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl border-neutral-200/80 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            aria-label="테마 전환"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 transition-transform rotate-0 hover:-rotate-12" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
