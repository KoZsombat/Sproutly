import { IoCloseOutline } from 'react-icons/io5';
import Alert from './Alert';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { COUNTRIES } from '../countries/COUNTRIES';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const countryOptions = [...COUNTRIES].map((c) => ({
  value: c,
  label: c.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
}));

export default function SettingsModal({
  visible,
  onClose,
  email,
  calorieMax,
  proteinMax,
  carbsMax,
  fatMax,
  waterGoal,
  creatineEnabled,
  nationality,
  onUpdate,
}: {
  visible: boolean;
  onClose: () => void;
  email: string;
  calorieMax: string;
  proteinMax: string;
  carbsMax: string;
  fatMax: string;
  waterGoal: string;
  creatineEnabled: boolean;
  nationality: string;
  onUpdate: (payload: {
    email: string;
    calorieMax: string;
    proteinMax: string;
    carbsMax: string;
    fatMax: string;
    waterGoal: string;
    creatineEnabled: boolean;
    nationality: string;
  }) => Promise<void> | void;
}) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('error');

  const [localEmail, setLocalEmail] = useState(email);
  const [localCalorieMax, setLocalCalorieMax] = useState(calorieMax);
  const [localProteinMax, setLocalProteinMax] = useState(proteinMax);
  const [localCarbsMax, setLocalCarbsMax] = useState(carbsMax);
  const [localFatMax, setLocalFatMax] = useState(fatMax);
  const [localWaterGoal, setLocalWaterGoal] = useState(waterGoal);
  const [localCreatineEnabled, setLocalCreatineEnabled] = useState(creatineEnabled);
  const [localNationality, setLocalNationality] = useState(nationality);

  useEffect(() => {
    if (visible) {
      setLocalEmail(email);
      setLocalCalorieMax(calorieMax);
      setLocalProteinMax(proteinMax);
      setLocalCarbsMax(carbsMax);
      setLocalFatMax(fatMax);
      setLocalWaterGoal(waterGoal);
      setLocalCreatineEnabled(creatineEnabled);
      setLocalNationality(nationality);
    }
  }, [
    visible,
    email,
    calorieMax,
    proteinMax,
    carbsMax,
    fatMax,
    waterGoal,
    creatineEnabled,
    nationality,
  ]);

  const isValidPositiveNumber = (value: string) => {
    const num = parseFloat(value.replace(',', '.'));
    return !isNaN(num) && num > 0;
  };

  const validateSettings = (): string | null => {
    if (localEmail.trim() === '') return t('settings.errorEmailRequired');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localEmail)) return t('settings.errorEmailInvalid');
    if (!isValidPositiveNumber(localCalorieMax)) return t('settings.errorCaloriesPositive');
    if (parseInt(localCalorieMax) > 100000) return t('settings.errorCaloriesTooLarge');
    if (!isValidPositiveNumber(localProteinMax)) return t('settings.errorProteinPositive');
    if (parseInt(localProteinMax) > 100000) return t('settings.errorProteinTooLarge');
    if (!isValidPositiveNumber(localCarbsMax)) return t('settings.errorCarbsPositive');
    if (parseInt(localCarbsMax) > 100000) return t('settings.errorCarbsTooLarge');
    if (!isValidPositiveNumber(localFatMax)) return t('settings.errorFatPositive');
    if (parseInt(localFatMax) > 100000) return t('settings.errorFatTooLarge');
    if (!isValidPositiveNumber(localWaterGoal)) return t('settings.errorWaterGoalPositive');
    if (parseFloat(localWaterGoal.replace(',', '.')) > 100000)
      return t('settings.errorWaterGoalTooLarge');
    if (localNationality.trim() === '') return t('settings.errorNationalityRequired');
    return null;
  };

  if (!visible) return null;

  return (
    <div className="modal-panel overflow-y-auto pb-[10vh] fixed pt-5 inset-0 z-20 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-4 border-b border-line bg-paper flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-bold font-display text-ink">
          {t('settings.title')}
        </p>
        <button
          className="hover:bg-leaf-50 text-ink rounded-full p-2 transition-colors cursor-pointer"
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <IoCloseOutline size={28} />
        </button>
      </div>
      <div className="overflow-y-auto flex-1 p-3 sm:p-6 max-w-2xl mx-auto w-full">
        {alertMsg && (
          <Alert message={alertMsg} type={alertType} onClose={() => setAlertMsg(null)} />
        )}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-2 sm:mb-4">
            {t('settings.appearance')}
          </h2>
          <div className="pl-4 sm:pl-8">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
                  theme === 'light'
                    ? 'bg-leaf-500 text-white border-leaf-500'
                    : 'bg-surface text-ink-2 border-line'
                }`}
              >
                {t('settings.themeLight')}
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'bg-leaf-500 text-white border-leaf-500'
                    : 'bg-surface text-ink-2 border-line'
                }`}
              >
                {t('settings.themeDark')}
              </button>
            </div>
          </div>
        </div>
        <div className="mb-4 sm:mb-8">
          <div className="bg-leaf-50 w-full rounded-xl border border-leaf-100 px-3 py-2 mb-5">
            <h2 className="text-lg font-semibold text-leaf-800 mb-1">
              {t('settings.downloadTitle')}
            </h2>
            <p className="text-sm text-leaf-700">{t('settings.downloadText')}</p>
          </div>
          <h2 className="text-2xl font-semibold text-ink mb-2 sm:mb-4">
            {t('settings.personalInfo')}
          </h2>
          <div className="pl-4 sm:pl-8">
            <label className="block mb-2 text-sm font-medium text-ink-2">
              {t('settings.email')}
            </label>
            <input
              type="email-address"
              className="field text-xs sm:text-sm p-2 sm:p-2.5"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
            />
          </div>
          <div className="pl-4 sm:pl-8 mt-4">
            <label className="block mb-2 text-sm font-medium text-ink-2">
              {t('settings.nationality')}
            </label>
            <div className="flex flex-row gap-2 items-center w-full">
              <div className="flex-1 min-w-0">
                <Select
                  classNamePrefix="react-select"
                  className="w-full text-xs sm:text-sm"
                  isClearable={true}
                  placeholder={t('settings.selectCountry')}
                  options={countryOptions}
                  value={
                    countryOptions.find(
                      (opt) => opt.label.toLowerCase() === localNationality.toLowerCase()
                    ) || null
                  }
                  onChange={(option) => {
                    setLocalNationality(option?.label || '');
                  }}
                  components={{
                    MenuList: (props) => <>{props.children}</>,
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: '16px',
                      minHeight: '32px',
                      backgroundColor: 'var(--color-surface)',
                      borderColor: state.isFocused
                        ? 'var(--color-leaf-300)'
                        : 'var(--color-line)',
                      boxShadow: state.isFocused
                        ? '0 0 0 3px var(--color-leaf-300)'
                        : 'none',
                      fontSize: '0.95rem',
                      padding: '0 2px',
                      '&:hover': { borderColor: 'var(--color-leaf-300)' },
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'var(--color-ink)',
                    }),
                    input: (base) => ({
                      ...base,
                      color: 'var(--color-ink)',
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      zIndex: 50,
                      backgroundColor: 'var(--color-surface)',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused
                        ? 'var(--color-leaf-50)'
                        : 'var(--color-surface)',
                      color: 'var(--color-ink)',
                      fontSize: '0.95rem',
                      padding: '8px 10px',
                    }),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 sm:mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-2 sm:mb-4">
            {t('settings.dailyMacros')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 pl-4 sm:pl-8">
            <div>
              <label className="block mb-2 text-sm font-medium text-ink-2">
                {t('settings.calorieGoal')}
              </label>
              <input
                type="decimal-pad"
                className="field text-xs sm:text-sm p-2 sm:p-2.5"
                value={localCalorieMax}
                onChange={(e) => setLocalCalorieMax(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-ink-2">
                {t('settings.proteinGoal')}
              </label>
              <input
                type="decimal-pad"
                className="field text-xs sm:text-sm p-2 sm:p-2.5"
                value={localProteinMax}
                onChange={(e) => setLocalProteinMax(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-ink-2">
                {t('settings.carbsGoal')}
              </label>
              <input
                type="decimal-pad"
                className="field text-xs sm:text-sm p-2 sm:p-2.5"
                value={localCarbsMax}
                onChange={(e) => setLocalCarbsMax(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-ink-2">
                {t('settings.fatGoal')}
              </label>
              <input
                type="decimal-pad"
                className="field text-xs sm:text-sm p-2 sm:p-2.5"
                value={localFatMax}
                onChange={(e) => setLocalFatMax(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-ink-2">
                {t('settings.waterGoal')}
              </label>
              <input
                type="text"
                className="field text-xs sm:text-sm p-2 sm:p-2.5"
                value={localWaterGoal}
                onChange={(e) => setLocalWaterGoal(e.target.value.replace(/[^0-9.,]/g, ''))}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-ink-2">
                {t('settings.trackCreatine')}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLocalCreatineEnabled(true)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
                    localCreatineEnabled
                      ? 'bg-leaf-500 text-white border-leaf-500'
                      : 'bg-surface text-ink-2 border-line'
                  }`}
                >
                  {t('common.yes')}
                </button>
                <button
                  type="button"
                  onClick={() => setLocalCreatineEnabled(false)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
                    !localCreatineEnabled
                      ? 'bg-leaf-500 text-white border-leaf-500'
                      : 'bg-surface text-ink-2 border-line'
                  }`}
                >
                  {t('common.no')}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            className="flex-1 px-4 py-3 rounded-full bg-leaf-500 text-white font-semibold text-sm sm:text-base hover:bg-leaf-600 transition-all active:scale-95 cursor-pointer"
            onClick={async () => {
              const err = validateSettings();
              if (err) {
                setAlertMsg(err);
                setAlertType('error');
                return;
              }
              setAlertMsg(null);

              await onUpdate({
                email: localEmail,
                calorieMax: localCalorieMax,
                proteinMax: localProteinMax,
                carbsMax: localCarbsMax,
                fatMax: localFatMax,
                waterGoal: localWaterGoal,
                creatineEnabled: localCreatineEnabled,
                nationality: localNationality,
              });

              onClose();
            }}
          >
            {t('settings.update')}
          </button>
          <button
            className="flex-1 px-4 py-3 rounded-full border border-line text-ink-2 font-semibold bg-surface hover:bg-leaf-50 transition-all cursor-pointer"
            onClick={onClose}
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
