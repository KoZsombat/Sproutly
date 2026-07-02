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

  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3.5 flex flex-col gap-2">
      <span className="num text-[10px] uppercase tracking-wider text-leaf-200 dark:text-muted">
        {label}
      </span>
      <span className="num text-lg font-bold text-white leading-none">
        {current}
        <span className="text-leaf-200 dark:text-muted text-sm"> g</span>
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
