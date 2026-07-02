import 'react-circular-progressbar/dist/styles.css';
import { useTranslation } from 'react-i18next';
import { HiFire } from 'react-icons/hi';

export default function StreakDisplay({ streak }: { streak: number }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between bg-surface border border-line p-5 rounded-2xl shadow-card">
        <div className="flex flex-col">
          <span className="num text-[11px] tracking-widest text-muted uppercase">
            {t('history.yourStreak')}
          </span>
          <h2 className="num text-2xl font-bold text-ink flex items-center gap-1">{streak}</h2>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-sun/40 blur-xl rounded-full"></div>
          <div className="relative bg-linear-to-br from-sun to-berry p-3 rounded-xl shadow-card">
            <HiFire className="text-white text-2xl" />
          </div>
        </div>
      </div>

      <div className="px-2">
        <p className="text-[13px] text-muted leading-snug">
          <strong className="text-ink-2">{t('history.streakTipTitle')}</strong>{' '}
          {t('history.streakTip')}
        </p>
      </div>
    </div>
  );
}
