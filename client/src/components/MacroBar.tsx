import { useLayoutEffect, useRef } from 'react';

export default function MacroBar({
  label,
  current,
  max,
  color = 'var(--color-leaf-500)',
}: {
  label: string;
  current: number;
  max: string;
  color?: string;
}) {
  const percentage = Math.min((current / Number(max)) * 100, 100);
  const safePercentage = Number.isFinite(percentage) ? Math.max(0, percentage) : 0;

  const valueRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = valueRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    const fit = () => {
      content.style.fontSize = ''; // reset to base so we measure the natural size
      const available = container.clientWidth;
      const needed = content.scrollWidth;
      if (needed > available && needed > 0) {
        content.style.fontSize = `${available / needed}em`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(container);
    return () => ro.disconnect();
  }, [current]);

  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3.5 flex flex-col gap-2">
      <span className="num text-[10px] uppercase tracking-wider text-leaf-200 dark:text-muted">
        {label}
      </span>
      <span
        ref={valueRef}
        className="num block min-w-0 overflow-hidden text-lg font-bold text-white leading-none"
      >
        <span ref={contentRef} className="inline-flex items-baseline whitespace-nowrap">
          <span className="tabular-nums">{current}</span>
          <span className="text-leaf-200 dark:text-muted text-[0.78em] pl-1">g</span>
        </span>
      </span>
      <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${safePercentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
