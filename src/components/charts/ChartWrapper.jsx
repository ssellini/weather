import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';

export default function ChartWrapper({ title, children }) {
  const chartRef = useRef(null);

  const exportPng = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { backgroundColor: '#060918' });
      const link = document.createElement('a');
      link.download = `${title || 'chart'}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // ignore export errors
    }
  }, [title]);

  return (
    <div className="rounded-2xl p-4 sm:p-6 glass-card glow-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 font-display">{title}</h3>
        <button
          onClick={exportPng}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs transition-all active:scale-95"
          title="Export PNG"
        >
          📥
        </button>
      </div>
      <div ref={chartRef}>{children}</div>
    </div>
  );
}
