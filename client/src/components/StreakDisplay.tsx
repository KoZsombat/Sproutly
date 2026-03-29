import 'react-circular-progressbar/dist/styles.css';
import { useTranslation } from 'react-i18next';

export default function StreakDisplay({ streak }: { streak: number }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-center w-full gap-6">
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
      <span
        className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent select-none"
        style={{ minWidth: '120px', textAlign: 'right' }}
      >
        {t('history.yourStreak')}
      </span>
      <div
        className="flex items-center justify-center"
        style={{
          background: 'linear-gradient(90deg, #ec4899 0%, #fde047 100%)',
          borderRadius: '50%',
          padding: '4px',
          width: '6.7rem',
          height: '6.7rem',
        }}
      >
        <div
          className="flex items-center justify-center bg-white rounded-full shadow-md"
          style={{
            width: '6.2rem',
            height: '6.2rem',
          }}
        >
          <span
            className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #ec4899 0%, #fde047 100%)',
            }}
          >
            {streak}
          </span>
        </div>
      </div>
    </div>
  );
}
