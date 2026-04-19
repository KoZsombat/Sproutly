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

  return (
    <div className="bg-white p-3 sm:p-4 shadow-sm rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-[#f2f2f2ff] rounded-lg p-2">
            <span className="text-xl" role="img" aria-label={t('common.ariaWaterDrop')}>
              💧
            </span>
          </div>
          <p className="font-semibold text-base sm:text-lg">{t('water.title')}</p>
        </div>
        <p className="text-[12px] text-gray-500">
          {t('water.goal', { liters: goalLiters.toFixed(2) })}
        </p>
      </div>

      <div className="px-1 flex flex-col gap-2 items-center">
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-[#3a3a3cff]">
          {liters.toFixed(2)}L
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full max-w-[280px] sm:max-w-[320px] py-4">
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

        <p className="text-[12px] text-gray-400 text-center">
          {t('water.hint', {
            defaultValue: 'Tap the faded bottle to add 0.25L',
          })}
        </p>
      </div>
    </div>
  );
}
