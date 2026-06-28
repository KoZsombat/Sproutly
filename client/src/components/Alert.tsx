import '../Alert.css';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

type AlertType = 'success' | 'error';

export default function Alert({
  message,
  type = 'error',
  onClose,
}: {
  message: string;
  type?: AlertType;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [animation, setAnimation] = useState('animate-slideDown');

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimation('animate-slideUp');
      setTimeout(() => onClose(), 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colorStyles =
    type === 'success'
      ? {
          bg: 'bg-leaf-50',
          border: 'border-leaf-200',
          text: 'text-ink-2',
          title: 'text-leaf-700',
          label: t('common.success'),
        }
      : {
          bg: 'bg-berry/10',
          border: 'border-berry/40',
          text: 'text-ink-2',
          title: 'text-berry',
          label: t('common.error'),
        };

  return (
    <div className="flex justify-center items-start w-full fixed top-4 right-0 z-50 px-4">
      <div
        className={`${colorStyles.bg} ${colorStyles.border} ${colorStyles.text} border px-6 py-4 rounded-xl shadow-card max-w-lg w-full ${animation}`}
        role="alert"
      >
        <p className={`font-bold ${colorStyles.title} mb-1`}>{colorStyles.label}</p>
        <p className={colorStyles.text}>{message}</p>
      </div>
    </div>
  );
}
