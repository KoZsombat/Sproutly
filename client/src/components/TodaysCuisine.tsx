import { IoAddCircleOutline } from 'react-icons/io5';
import { MdSaveAs } from 'react-icons/md';
import { LuUtensils, LuTrash2 } from 'react-icons/lu';
import type { CalEntry, FoodEntry, EatenEntry } from '../types/types';
import { useTranslation } from 'react-i18next';

const TILES = ['bg-leaf-100 text-leaf-700', 'bg-sun/40 text-ink', 'bg-sky/60 text-ink'];

export default function TodaysCuisine({
  eaten,
  cals,
  food,
  Clear,
  onOpenAppend,
  onDeleteEaten,
}: {
  eaten: EatenEntry[];
  cals: CalEntry[];
  food: FoodEntry[];
  Clear: () => void;
  onOpenAppend: () => void;
  onDeleteEaten: (id: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <section className="mx-4 my-3 sm:mx-6 flex flex-col min-h-[30vh] bg-white border border-line shadow-card rounded-2xl p-3 sm:p-4">
      <div className="flex flex-row justify-between items-center mb-3">
        <h2 className="text-lg sm:text-xl font-bold text-ink">{t('todaysCuisine.title')}</h2>
        <div className="flex flex-row gap-2">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 border border-leaf-200 hover:bg-leaf-200 transition-colors cursor-pointer"
            onClick={onOpenAppend}
            aria-label={t('common.add')}
          >
            <IoAddCircleOutline size={24} />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 border border-leaf-200 hover:bg-leaf-200 transition-colors cursor-pointer"
            onClick={Clear}
            aria-label={t('common.save')}
          >
            <MdSaveAs size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[45vh] flex flex-col gap-2">
        {eaten.length === 0 ? (
          <div className="flex flex-1 justify-center items-center py-12">
            <p className="text-base text-muted font-medium">{t('todaysCuisine.empty')}</p>
          </div>
        ) : (
          eaten.map((e, i) => {
            const meal = cals.find((c) => c.name === e.name);
            if (!meal) return null;

            let allCals = 0,
              allProtein = 0,
              allCarbs = 0,
              allFat = 0;
            meal.food.forEach((item, idx) => {
              const foodItem = food.find((f) => f.name === item);
              if (foodItem) {
                const gramsRaw = meal.grams?.[idx] ?? '100';
                const grams = parseFloat(gramsRaw);
                if (!Number.isFinite(grams) || grams <= 0) return;
                const factor = grams / 100;
                allCals += foodItem.cal * factor;
                allProtein += foodItem.protein * factor;
                allCarbs += foodItem.carbs * factor;
                allFat += foodItem.fat * factor;
              }
            });

            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-cream border border-line p-3"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TILES[i % TILES.length]}`}
                >
                  <LuUtensils size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink truncate">{e.name}</p>
                  <p className="num text-xs text-muted truncate">
                    {parseFloat(allProtein.toFixed(1))}g {t('stats.protein')} ·{' '}
                    {parseFloat(allCarbs.toFixed(1))}g {t('stats.carbs')} ·{' '}
                    {parseFloat(allFat.toFixed(1))}g {t('stats.fat')}
                  </p>
                </div>
                <span className="num text-sm font-semibold text-ink whitespace-nowrap">
                  {parseFloat(allCals.toFixed(0))} {t('stats.kcal')}
                </span>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-berry/10 hover:text-berry transition-colors cursor-pointer"
                  onClick={() => onDeleteEaten(e.id)}
                  aria-label={t('common.delete')}
                >
                  <LuTrash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
