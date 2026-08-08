import React from 'react';

export interface BarItem {
  label: string;
  value: number;
  display?: string;
  color?: string;
  valueColor?: string;
}

interface BarChartProps {
  items: BarItem[];
  max?: number;
  emptyMessage?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ items, max, emptyMessage = 'No data to display yet.' }) => {
  const cap = max ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-xs font-semibold text-slate-500">{emptyMessage}</p>
      ) : (
        items.map((item, idx) => {
          const pct = Math.max(0, Math.min(100, (item.value / cap) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 truncate">{item.label}</span>
                <span className={`text-xs font-black font-mono shrink-0 ${item.valueColor || 'text-slate-900'}`}>
                  {item.display ?? item.value}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: item.color || '#6366f1' }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
