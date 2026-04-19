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
    <div className="bg-white p-3 sm:p-4 shadow-sm rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-[#f2f2f2ff] rounded-lg p-2">
            <span className="text-xl" role="img" aria-label="capsule">
              💊
            </span>
          </div>
          <p className="font-semibold text-base sm:text-lg">{t('creatine.title')}</p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-md ${
            isDone ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isDone ? t('creatine.doneBadge') : t('creatine.pendingBadge')}
        </span>
      </div>

      <div className="px-1 flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-[13px] text-gray-500 leading-snug text-center max-w-[240px]">
          {isDone ? t('creatine.done') : t('creatine.pending')}
        </p>

        <button
          type="button"
          onClick={toggleDone}
          className="bg-[#f2f2f2ff] rounded-lg px-3 py-2 hover:bg-gray-300 transition-colors cursor-pointer text-sm font-semibold"
        >
          {isDone ? t('creatine.undo') : t('creatine.markTaken')}
        </button>
      </div>
    </div>
  );
}
