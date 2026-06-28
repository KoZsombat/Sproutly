import { FaHistory } from 'react-icons/fa';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function Navbar({
  onHistory,
  onHome,
  onOpenManage,
}: {
  onHistory: () => void;
  onOpenManage: () => void;
  onHome: () => void;
}) {
  const { t } = useTranslation();

  const itemClass =
    'flex flex-1 max-w-[120px] flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-muted hover:text-leaf-600 transition-colors cursor-pointer';

  return (
    <div className="fixed bottom-0 left-0 w-full z-30 bg-paper/85 backdrop-blur border-t border-line shadow-float rounded-t-3xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around gap-2 px-3 py-2 max-w-md mx-auto">
        <button className={itemClass} onClick={onHistory}>
          <FaHistory size={22} />
          <span className="text-xs font-medium">{t('navbar.history')}</span>
        </button>
        <button className={itemClass} onClick={onHome}>
          <FaHome size={22} />
          <span className="text-xs font-medium">{t('navbar.home')}</span>
        </button>
        <button className={itemClass} onClick={onOpenManage}>
          <BiSolidFoodMenu size={22} />
          <span className="text-xs font-medium">{t('navbar.manage')}</span>
        </button>
      </div>
    </div>
  );
}
