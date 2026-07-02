import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type WaterIntakeProps = {
  water?: number;
  goalLiters?: number;
  onChange?: (liters: number) => void;
};

const BOTTLE_LITERS = 0.25;

export default function WaterIntake({ water = 0, goalLiters = 2, onChange }: WaterIntakeProps) {
  const { t } = useTranslation();
  const [liters, setLiters] = useState(water);

  useEffect(() => {
    setLiters(water);
  }, [water]);

  const fullBottles = Math.max(0, Math.round(liters / BOTTLE_LITERS));

  const addBottle = () => {
    const nextLiters = Number((liters + BOTTLE_LITERS).toFixed(2));
    setLiters(nextLiters);
    onChange?.(nextLiters);
  };

  const goalLitersSafe = goalLiters > 0 ? goalLiters : 2;
  const progress = Math.min((liters / goalLitersSafe) * 100, 100);

  return (
    <div className="bg-surface p-4 shadow-card rounded-2xl border border-line h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-sky/50 rounded-xl p-2">
            <span className="text-xl" role="img" aria-label={t('common.ariaWaterDrop')}>
              💧
            </span>
          </div>
          <p className="font-semibold text-base sm:text-lg text-ink">{t('water.title')}</p>
        </div>
        <p className="num text-xs text-muted">
          {t('water.goal', { liters: goalLiters.toFixed(2) })}
        </p>
      </div>

      <div className="px-1 flex flex-col gap-3 items-center">
        <p className="num text-3xl sm:text-4xl font-bold tracking-tight text-leaf-600">
          {liters.toFixed(2)}L
        </p>

        <div className="h-2 w-full rounded-full bg-line overflow-hidden">
          <div
            className="h-full rounded-full bg-sky transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full max-w-[280px] sm:max-w-[320px] py-2">
          {Array.from({ length: fullBottles }).map((_, index) => (
            <span key={`full-bottle-${index}`} className="text-2xl leading-none select-none">
              🥛
            </span>
          ))}

          <button
            type="button"
            onClick={addBottle}
            className="text-2xl leading-none opacity-60 hover:opacity-90 transition-opacity cursor-pointer"
            aria-label={t('water.addBottle', {
              defaultValue: 'Add one bottle (0.25L)',
            })}
          >
            🥛
          </button>
        </div>

        <p className="text-xs text-muted text-center">
          {t('water.hint', {
            defaultValue: 'Tap the faded bottle to add 0.25L',
          })}
        </p>
      </div>
    </div>
  );
}
