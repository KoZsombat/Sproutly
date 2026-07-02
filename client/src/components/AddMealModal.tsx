import { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import type { FoodEntry, CalEntry } from '../types/types';
import Alert from './Alert';
import { useTranslation } from 'react-i18next';

export default function AddMealModal({
  visible,
  onClose,
  food,
  cals,
  onAdd,
  editMode = false,
  initialMealName = '',
  initialIngredients = [],
}: {
  visible: boolean;
  onClose: () => void;
  food: FoodEntry[];
  cals?: CalEntry[];
  onAdd: (name: string, ingredients: { name: string; grams: string }[]) => void;
  editMode?: boolean;
  initialMealName?: string;
  initialIngredients?: { name: string; grams: string }[];
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localMealName, setLocalMealName] = useState(initialMealName);
  const [localSelectedIngredients, setLocalSelectedIngredients] =
    useState<{ name: string; grams: string }[]>(initialIngredients);
  const [showDuplicateMenu, setShowDuplicateMenu] = useState(false);
  const [duplicateSearch, setDuplicateSearch] = useState('');

  const isValidPositiveNumber = (v: string) => {
    const num = parseFloat(v);
    if (!num) return true;
    return Number.isFinite(num) && num > 0;
  };

  useEffect(() => {
    if (visible) {
      setLocalMealName(initialMealName);
      setLocalSelectedIngredients(initialIngredients);
    }
  }, [visible, initialMealName, initialIngredients]);

  if (!visible) return null;

  const validateMeal = (): string | null => {
    if (localMealName.trim() === '') return t('meal.errorNameRequired');
    if (localSelectedIngredients.length === 0) return t('meal.errorIngredientRequired');
    const invalid = localSelectedIngredients.find((si) => !isValidPositiveNumber(si.grams));
    if (invalid) return t('meal.errorGramsPositive', { name: invalid.name });
    const tooLarge = localSelectedIngredients.find((si) => parseFloat(si.grams) > 100000);
    if (tooLarge) return t('meal.errorGramsTooLarge', { name: tooLarge.name });
    return null;
  };

  const handleDuplicateMeal = (meal: CalEntry) => {
    setLocalMealName(`${meal.name} ${t('meal.copySuffix')}`);
    setLocalSelectedIngredients(
      meal.food.map((foodName, idx) => ({
        name: foodName,
        grams: meal.grams?.[idx] ?? '0',
      }))
    );
    setShowDuplicateMenu(false);
    setDuplicateSearch('');
  };

  const filteredMeals = (cals || [])
    .filter((meal) => meal.name.toLowerCase().includes(duplicateSearch.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="modal-panel overflow-y-auto pb-[10vh] fixed pt-5 inset-0 z-20 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-4 border-b border-line bg-paper flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-bold font-display text-ink">
          {editMode ? t('meal.editTitle') : t('meal.createTitle')}
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
        {errorMsg && <Alert message={errorMsg} onClose={() => setErrorMsg(null)} />}
        <div className="mb-4 sm:mb-6">
          <p className="block mb-2 text-sm font-medium text-ink-2">{t('meal.mealName')}</p>
          <input
            className="field text-sm"
            value={localMealName}
            onChange={(e) => setLocalMealName(e.target.value)}
          />
        </div>
        {!editMode && cals && cals.length > 0 && (
          <div className="mt-4 sm:mt-6 mb-2 sm:mb-4">
            <button
              onClick={() => setShowDuplicateMenu(!showDuplicateMenu)}
              className="w-full px-4 py-2 mb-2 rounded-full bg-leaf-50 text-leaf-700 text-sm font-semibold hover:bg-leaf-100 transition-all"
            >
              {showDuplicateMenu ? t('meal.hideDuplicate') : t('meal.duplicateMeal')}
            </button>
            {showDuplicateMenu && (
              <div className="p-3 bg-cream rounded-xl border border-line">
                <input
                  placeholder={t('meal.searchMeals')}
                  className="field bg-surface text-sm mb-2"
                  value={duplicateSearch}
                  onChange={(e) => setDuplicateSearch(e.target.value)}
                />
                <div className="space-y-1 max-h-[150px] overflow-y-auto">
                  {filteredMeals.length > 0 ? (
                    filteredMeals.map((meal, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDuplicateMeal(meal)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-ink-2 bg-surface hover:bg-leaf-50 border border-line transition-all"
                      >
                        {meal.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-muted p-2">{t('meal.noMealsFound')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <input
          placeholder={t('meal.searchIngredients')}
          className="field text-sm mb-4 sm:mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {[...food]
            .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
              if (editMode) {
                const aIsSelected = localSelectedIngredients.some(
                  (i) => i.name === a.name && i.grams && parseFloat(i.grams) > 0
                );
                const bIsSelected = localSelectedIngredients.some(
                  (i) => i.name === b.name && i.grams && parseFloat(i.grams) > 0
                );
                if (aIsSelected && !bIsSelected) return -1;
                if (!aIsSelected && bIsSelected) return 1;
              }
              return a.name.localeCompare(b.name);
            })
            .map((ingredient, idx) => {
              const selected = localSelectedIngredients.find((i) => i.name === ingredient.name);
              return (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-surface rounded-xl border border-line shadow-soft"
                >
                  <span className="flex-1 font-medium text-ink text-sm">{ingredient.name}</span>
                  <input
                    type="numeric"
                    placeholder={t('common.grams')}
                    className="field w-20 sm:w-24 text-sm"
                    value={selected?.grams ?? ''}
                    onChange={(e) => {
                      const numeric = e.target.value.replace(/[^0-9]/g, '');
                      setLocalSelectedIngredients((prev: { name: string; grams: string }[]) => {
                        const exists = prev.find((i) => i.name === ingredient.name);
                        if (exists)
                          return prev.map((i) =>
                            i.name === ingredient.name ? { ...i, grams: numeric } : i
                          );
                        return [...prev, { name: ingredient.name, grams: numeric }];
                      });
                    }}
                  />
                </div>
              );
            })}
        </div>
        <div className="flex gap-2 sm:gap-3">
          <button
            className="flex-1 px-4 py-3 rounded-full bg-leaf-500 hover:bg-leaf-600 text-white font-semibold transition-all active:scale-95 cursor-pointer"
            onClick={() => {
              const err = validateMeal();
              if (err) {
                setErrorMsg(err);
                return;
              }
              setErrorMsg(null);
              const sanitizedIngredients = localSelectedIngredients.map((item) => ({
                ...item,
                grams: !parseFloat(item.grams) ? '0' : item.grams,
              }));
              onAdd(localMealName, sanitizedIngredients);
            }}
          >
            {editMode ? t('meal.saveChanges') : t('meal.createMeal')}
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
