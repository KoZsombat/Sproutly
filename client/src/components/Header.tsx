import { IoSettingsOutline } from 'react-icons/io5';
import { LuLogOut } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

export default function Header({
  username,
  onOpenSettings,
  onLogout,
}: { username?: string } & { onOpenSettings: () => void } & { onLogout: () => void }) {
  const { t, i18n } = useTranslation();

  const now = new Date();
  const dateLine = now.toLocaleDateString(i18n.language || undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const hour = now.getHours();
  const greet =
    hour < 12
      ? t('header.greetMorning')
      : hour < 18
        ? t('header.greetAfternoon')
        : t('header.greetEvening');

  const name = username?.trim();
  const greeting = name
    ? t('header.greeting', { greet, name })
    : t('header.greetingNoName', { greet });

  return (
    <div className="flex flex-row justify-between items-start gap-3 px-4 pt-7 pb-4 sm:px-6 sm:pt-9">
      <div className="min-w-0">
        <p className="num text-xs uppercase tracking-wider text-muted">{dateLine}</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-ink truncate">{greeting}</h1>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 border border-leaf-200 hover:bg-leaf-200 transition-colors cursor-pointer"
          onClick={onLogout}
          aria-label={t('header.logout')}
        >
          <LuLogOut size={20} />
        </button>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 border border-leaf-200 hover:bg-leaf-200 transition-colors cursor-pointer"
          onClick={onOpenSettings}
          aria-label={t('header.settings')}
        >
          <IoSettingsOutline size={20} />
        </button>
      </div>
    </div>
  );
}
