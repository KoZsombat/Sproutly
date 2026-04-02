import 'react-circular-progressbar/dist/styles.css';
import { useTranslation } from 'react-i18next';
import { HiFire } from 'react-icons/hi';

export default function StreakDisplay({ streak }: { streak: number }) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-3">
      {/* <div
        className="relative flex flex-col text-center justify-center"
        style={{ width: 150, height: 150 }}
      >
        <div className="absolute" style={{ top: 0, left: 0 }}>
          <div style={{ width: 150, height: 150, borderRadius: 20 }}>
            <CircularProgressbar
              value={percent}
              strokeWidth={12}
              styles={buildStyles({
                pathColor,
                trailColor: 'rgb(229, 231, 235)',
                strokeLinecap: 'round',
              })}
            />
          </div>
        </div>
        <p className="text-center text-sm mt-1">{percent.toFixed(1)}%</p>
      </div> */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-gray-100 p-5 rounded-2xl shadow-sm">
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase italic">
            {t('history.yourStreak')}
          </span>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-1">
            {streak}
          </h2>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-100 blur-xl rounded-full opacity-60"></div>
          <div className="relative bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-xl shadow-lg shadow-orange-200">
            <HiFire className="text-white text-2xl" />
          </div>
        </div>
      </div>

      <div className="px-2">
        <p className="text-[13px] text-gray-500 leading-snug">
          <strong className="text-gray-700">{t('history.streakTipTitle')}</strong> {t('history.streakTip')}
        </p>
      </div>
    </div>
  );
}
