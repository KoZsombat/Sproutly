import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaCheck, FaTriangleExclamation } from 'react-icons/fa6';
import MacroBar from './MacroBar';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

export default function StatsDisplay({
  calories,
  protein,
  carbs,
  fat,
  calorieMax,
  proteinMax,
  carbsMax,
  fatMax,
  mealsEaten = 0,
}: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieMax: string;
  proteinMax: string;
  carbsMax: string;
  fatMax: string;
  mealsEaten?: number;
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const goal = Number(calorieMax);
  const hasGoal = goal > 0;
  const percent = hasGoal ? (calories / goal) * 100 : 0;
  const isOver = percent > 100;

  const trailColor = isDark ? 'var(--color-line)' : 'rgba(255,255,255,0.18)';
  const pathColor = !hasGoal
    ? trailColor
    : isOver
      ? 'var(--color-sun)'
      : isDark
        ? 'var(--color-leaf-400)'
        : '#ffffff';

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-leaf-600 to-leaf-800 dark:bg-none dark:bg-surface dark:border dark:border-line mx-4 my-3 sm:mx-6 p-4 sm:p-5 shadow-card rounded-2xl">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 dark:bg-white/5" />
      <div className="relative flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-ink">
          {t('stats.today')}
        </h2>
        <span className="text-sm text-leaf-200 dark:text-muted">
          {t('stats.mealsCount', { count: mealsEaten })}
        </span>
      </div>

      <div className="relative flex flex-row items-center gap-4 sm:gap-6">
        <div className="relative shrink-0" style={{ width: 116, height: 116 }}>
          <CircularProgressbar
            value={hasGoal ? Math.min(percent, 100) : 0}
            strokeWidth={11}
            styles={buildStyles({
              pathColor,
              trailColor,
              strokeLinecap: 'round',
            })}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="num text-4xl sm:text-5xl font-bold text-white dark:text-ink">
            {Math.round(calories)}
            <span className="text-lg font-medium text-leaf-200 dark:text-muted">
              {' '}
              {t('stats.kcal')}
            </span>
          </p>
          <p className="text-sm text-leaf-200 dark:text-muted mt-0.5">
            {t('stats.ofGoal', { goal: calorieMax })}
          </p>
          {hasGoal &&
            (isOver ? (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-berry/15 px-3 py-1 text-xs font-semibold text-berry">
                <FaTriangleExclamation size={10} />
                {t('stats.overLimit')}
              </span>
            ) : (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-leaf-500/15 px-3 py-1 text-xs font-semibold text-leaf-600 dark:text-leaf-700">
                <FaCheck size={10} />
                {t('stats.onTrack')}
              </span>
            ))}
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2">
        <MacroBar
          label={t('stats.protein')}
          current={protein}
          max={proteinMax}
          color="var(--color-macro-protein)"
        />
        <MacroBar
          label={t('stats.carbs')}
          current={carbs}
          max={carbsMax}
          color="var(--color-macro-carbs)"
        />
        <MacroBar
          label={t('stats.fat')}
          current={fat}
          max={fatMax}
          color="var(--color-macro-fat)"
        />
      </div>
    </div>
  );
}
