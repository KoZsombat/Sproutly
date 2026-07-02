import { IoCloseOutline } from 'react-icons/io5';
import StreakDisplay from './StreakDisplay';
import type { EatenHistory } from '../types/types';
import { useTranslation } from 'react-i18next';

export default function History({
  visible,
  onClose,
  onClearHistory,
  eatenData = [],
}: {
  visible: boolean;
  onClose: () => void;
  onClearHistory: (keepDates: string[]) => void;
  eatenData: EatenHistory[];
}) {
  const { t } = useTranslation();

  if (!visible) return null;

  function toLocalDateKey(d: string | number | Date) {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseLocalDate(dateStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  function formatLocalDate(dateStr: string) {
    const d = parseLocalDate(dateStr);
    return d.toLocaleDateString();
  }

  function groupByDate(entries: EatenHistory[]) {
    const grouped: { [date: string]: EatenHistory } = {};
    for (const entry of entries) {
      const dateKey = toLocalDateKey(entry.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          name: '',
          date: dateKey,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }
      grouped[dateKey].calories += entry.calories;
      grouped[dateKey].protein += entry.protein;
      grouped[dateKey].carbs += entry.carbs;
      grouped[dateKey].fat += entry.fat;
    }

    return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
  }

  const groupedEatenData = groupByDate(eatenData || []);

  function getCurrentStreakDateKeys(entries: EatenHistory[]) {
    if (!entries || entries.length === 0) return [] as string[];

    const uniqueDates = Array.from(new Set(entries.map((e) => e.date)));
    const dateSet = new Set(uniqueDates);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayKey = toLocalDateKey(today);
    const yesterdayKey = toLocalDateKey(yesterday);

    let startKey: string | null = null;
    if (dateSet.has(todayKey)) {
      startKey = todayKey;
    } else if (dateSet.has(yesterdayKey)) {
      startKey = yesterdayKey;
    } else {
      return [] as string[];
    }

    const streakKeys: string[] = [];
    const cursor = parseLocalDate(startKey);

    while (true) {
      const key = toLocalDateKey(cursor);
      if (!dateSet.has(key)) break;
      streakKeys.push(key);
      cursor.setDate(cursor.getDate() - 1);
    }

    return streakKeys;
  }

  function calculateStreak(entries: EatenHistory[]) {
    if (!entries || entries.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const entryDates = entries.map((e) => {
      const d = parseLocalDate(e.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    let start = null;
    if (entryDates.includes(today.getTime())) {
      start = today.getTime();
    } else if (entryDates.includes(yesterday.getTime())) {
      start = yesterday.getTime();
    } else {
      return 0;
    }

    let streak = 0;
    let current = start;
    while (entryDates.includes(current)) {
      streak++;
      current -= 24 * 60 * 60 * 1000;
    }
    return streak;
  }

  const streak = calculateStreak(groupedEatenData);
  const currentStreakDateKeys = getCurrentStreakDateKeys(groupedEatenData);
  const hasOutOfStreakEntries = groupedEatenData.length > currentStreakDateKeys.length;

  return (
    <div className="modal-panel overflow-y-auto pb-[10vh] fixed pt-5 inset-0 z-20 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-4 border-b border-line bg-paper flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-bold font-display text-ink">{t('history.title')}</p>
        <button
          className="hover:bg-leaf-50 text-ink rounded-full p-2 transition-colors cursor-pointer"
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <IoCloseOutline size={28} />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-4">
          <div className="bg-leaf-50 border border-leaf-100 rounded-2xl shadow-card flex justify-center items-center p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center">
              <StreakDisplay streak={streak} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="rounded-full bg-berry px-5 py-2 text-sm font-semibold text-white shadow-card hover:opacity-90 transition-opacity cursor-pointer disabled:cursor-not-allowed disabled:bg-cream disabled:text-muted disabled:shadow-none"
              onClick={() => onClearHistory(currentStreakDateKeys)}
              disabled={!hasOutOfStreakEntries}
            >
              {t('history.clearOutOfStreakButton')}
            </button>
          </div>
        </div>
        {groupedEatenData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg text-muted font-semibold">{t('history.noHistory')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedEatenData.map((entry, index) => (
              <div
                key={index}
                className="bg-surface rounded-2xl shadow-card border border-line p-5 sm:p-7 flex flex-col gap-2"
              >
                <div className="flex flex-row items-center gap-2 mb-2">
                  <span className="num text-sm font-bold text-leaf-700 bg-leaf-50 border border-leaf-100 px-3 py-1 rounded-full uppercase tracking-wide">
                    {formatLocalDate(entry.date)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-cream px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-muted">{t('stats.calories')}</span>
                    <span className="num font-bold text-ink text-lg">{entry.calories}</span>
                  </div>
                  <div className="rounded-xl bg-cream px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-muted">{t('stats.protein')}</span>
                    <span className="num font-bold text-ink text-lg">{entry.protein}g</span>
                  </div>
                  <div className="rounded-xl bg-cream px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-muted">{t('stats.carbs')}</span>
                    <span className="num font-bold text-ink text-lg">{entry.carbs}g</span>
                  </div>
                  <div className="rounded-xl bg-cream px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-muted">{t('stats.fat')}</span>
                    <span className="num font-bold text-ink text-lg">{entry.fat}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
