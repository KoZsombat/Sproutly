import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type CreatineIntakeProps = {
  done?: boolean;
  onChange?: (done: boolean) => void;
};

export default function CreatineIntake({ done = false, onChange }: CreatineIntakeProps) {
  const { t } = useTranslation();
  const [isDone, setIsDone] = useState(done);

  useEffect(() => {
    setIsDone(done);
  }, [done]);

  const toggleDone = () => {
    const next = !isDone;
    setIsDone(next);
    onChange?.(next);
  };

  return (
    <div className="bg-white p-4 shadow-card rounded-2xl border border-line h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-leaf-50 rounded-xl p-2">
            <span className="text-xl" role="img" aria-label={t('common.ariaCapsule')}>
              💊
            </span>
          </div>
          <p className="font-semibold text-base sm:text-lg text-ink">{t('creatine.title')}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isDone ? 'bg-leaf-100 text-leaf-700' : 'bg-sun/40 text-ink-2'
          }`}
        >
          {isDone ? t('creatine.doneBadge') : t('creatine.pendingBadge')}
        </span>
      </div>

      <div className="px-1 flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-[13px] text-muted leading-snug text-center max-w-[240px]">
          {isDone ? t('creatine.done') : t('creatine.pending')}
        </p>

        <button
          type="button"
          onClick={toggleDone}
          className={`rounded-full px-4 py-2 transition-colors cursor-pointer text-sm font-semibold ${
            isDone
              ? 'bg-cream text-ink-2 hover:bg-cream-2'
              : 'bg-leaf-500 text-white hover:bg-leaf-600'
          }`}
        >
          {isDone ? t('creatine.undo') : t('creatine.markTaken')}
        </button>
      </div>
    </div>
  );
}
