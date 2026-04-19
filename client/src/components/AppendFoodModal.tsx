import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import type { CalEntry } from '../types/types';
import Alert from './Alert';
import { useTranslation } from 'react-i18next';

export default function AppendFoodModal({
  visible,
  onClose,
  cals,
  onAddEaten,
}: {
  visible: boolean;
  onClose: () => void;
  cals: CalEntry[];
  onAddEaten: (name: string) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  if (!visible) return null;

  return (
    <div className="overflow-y-auto pb-[10vh] fixed pt-5 inset-0 bg-white z-20 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-bold text-gray-900">{t('appendFood.title')}</p>
        <button
          className="hover:bg-gray-100 rounded-lg p-2 transition-colors cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          <IoCloseOutline size={28} color="#000" />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-3 sm:p-6 max-w-2xl mx-auto w-full">
        {alertMsg && (
          <Alert message={alertMsg} type={alertType} onClose={() => setAlertMsg(null)} />
        )}
        <input
          placeholder={t('appendFood.search')}
          className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2 sm:p-2.5 mb-4 sm:mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-2 sm:space-y-3">
          {cals
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
            .map((f, i) => (
              <div
                className="flex flex-row items-center gap-2 sm:gap-3 p-2 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                key={i}
              >
                <span className="flex-1 font-medium text-gray-700 text-sm">{f.name}</span>
                <button
                  className="px-2 sm:px-4 py-1 sm:py-2 rounded-lg bg-[#3a3a3cff] text-white text-sm font-medium hover:bg-[#4a4a4cff] transition-all active:scale-95 cursor-pointer"
                  onClick={() => {
                    setAlertMsg(t('appendFood.successAdded'));
                    setAlertType('success');
                    onAddEaten(f.name);
                  }}
                >
                  {t('common.add')}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
