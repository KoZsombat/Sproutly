import { IoCloseOutline } from 'react-icons/io5';
import StreakDisplay from './StreakDisplay';
import type { EatenHistory } from '../types/types';
import { useTranslation } from 'react-i18next';

export default function History({
  visible,
  onClose,
  eatenData = [],
}: {
  visible: boolean;
  onClose: () => void;
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

  return (
    <div className="overflow-y-auto pb-[10vh] fixed pt-5 inset-0 bg-white z-20 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{t('history.title')}</p>
        <button
          className="hover:bg-gray-100 rounded-lg p-2 transition-colors cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <IoCloseOutline size={28} color="#000" />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow flex justify-center items-center p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center">
              <StreakDisplay streak={streak} />
            </div>
          </div>
        </div>
        {groupedEatenData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg text-gray-400 font-semibold">{t('history.noHistory')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupedEatenData.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow border border-gray-200 p-5 sm:p-7 flex flex-col gap-2"
              >
                <div className="flex flex-row items-center gap-2 mb-2">
                  <span className="text-base font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {formatLocalDate(entry.date)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-base text-gray-900 font-medium">
                  <div className="rounded-lg bg-gray-100 px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-gray-500">{t('stats.calories')}</span>
                    <span className="font-extrabold text-gray-900 text-lg">{entry.calories}</span>
                  </div>
                  <div className="rounded-lg bg-gray-100 px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-gray-500">{t('stats.protein')}</span>
                    <span className="font-extrabold text-gray-900 text-lg">{entry.protein}g</span>
                  </div>
                  <div className="rounded-lg bg-gray-100 px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-gray-500">{t('stats.carbs')}</span>
                    <span className="font-extrabold text-gray-900 text-lg">{entry.carbs}g</span>
                  </div>
                  <div className="rounded-lg bg-gray-100 px-3 py-2 flex flex-col items-center">
                    <span className="text-xs text-gray-500">{t('stats.fat')}</span>
                    <span className="font-extrabold text-gray-900 text-lg">{entry.fat}g</span>
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
