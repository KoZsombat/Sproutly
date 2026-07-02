import { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import type { FoodEntry } from '../types/types';
import Alert from './Alert';
import { useTranslation } from 'react-i18next';

export default function OneTimeMealModal({
  visible,
  onClose,
  food,
  onCreateIngredient,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  food: FoodEntry[];
  onCreateIngredient: (ingredient: {
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  }) => Promise<boolean>;
  onAdd: (name: string, ingredients: { name: string; grams: string }[]) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mealName, setMealName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<
    { name: string; grams: string }[]
  >([]);

  // Inline one-time ingredient creation
  const [showCreateIngredient, setShowCreateIngredient] = useState(false);
  const [ingName, setIngName] = useState('');
  const [ingCalories, setIngCalories] = useState('');
  const [ingProtein, setIngProtein] = useState('');
  const [ingCarbs, setIngCarbs] = useState('');
  const [ingFat, setIngFat] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (visible) {
      setSearch('');
      setErrorMsg(null);
      setMealName('');
      setSelectedIngredients([]);
      setShowCreateIngredient(false);
      resetIngredientForm();
    }
  }, [visible]);

  const resetIngredientForm = () => {
    setIngName('');
    setIngCalories('');
    setIngProtein('');
    setIngCarbs('');
    setIngFat('');
  };

  const isValidPositiveNumber = (v: string) => {
    const num = parseFloat(v);
    if (!num) return true;
    return Number.isFinite(num) && num > 0;
  };

  const isValidMacro = (v: string) => {
    const num = parseFloat(v);
    return Number.isFinite(num) && num >= 0;
  };

  const handleNumberInput = (value: string, setter: (v: string) => void) => {
    let cleaned = value.replace(/[^0-9.,]/g, '');
    const firstDot =
      cleaned.indexOf('.') !== -1 ? cleaned.indexOf('.') : cleaned.indexOf(',');
    if (firstDot !== -1) {
      const before = cleaned.slice(0, firstDot + 1);
      const after = cleaned.slice(firstDot + 1).replace(/[.,]/g, '');
      cleaned = before + after;
    }
    setter(cleaned.replace(',', '.'));
  };

  if (!visible) return null;

  const validateMeal = (): string | null => {
    if (mealName.trim() === '') return t('oneTimeMeal.errorNameRequired');
    const invalid = selectedIngredients.find(
      (si) => !isValidPositiveNumber(si.grams)
    );
    if (invalid)
      return t('oneTimeMeal.errorGramsPositive', { name: invalid.name });
    const tooLarge = selectedIngredients.find(
      (si) => parseFloat(si.grams) > 100000
    );
    if (tooLarge)
      return t('oneTimeMeal.errorGramsTooLarge', { name: tooLarge.name });
    const hasValid = selectedIngredients.some(
      (si) => si.grams !== '' && parseFloat(si.grams) > 0
    );
    if (!hasValid) return t('oneTimeMeal.errorIngredientRequired');
    return null;
  };

  const validateIngredient = (): string | null => {
    if (ingName.trim() === '')
      return t('oneTimeMeal.errorIngredientNameRequired');
    if (!isValidMacro(ingCalories))
      return t('oneTimeMeal.errorIngredientCaloriesPositive');
    if (!isValidMacro(ingProtein))
      return t('oneTimeMeal.errorIngredientProteinPositive');
    if (!isValidMacro(ingCarbs))
      return t('oneTimeMeal.errorIngredientCarbsPositive');
    if (!isValidMacro(ingFat))
      return t('oneTimeMeal.errorIngredientFatPositive');
    if (
      [ingCalories, ingProtein, ingCarbs, ingFat].some(
        (v) => parseFloat(v) > 100000
      )
    )
      return t('oneTimeMeal.errorMacroTooLarge');
    return null;
  };

  const handleCreateIngredient = async () => {
    const err = validateIngredient();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg(null);
    setCreating(true);
    const ok = await onCreateIngredient({
      name: ingName.trim(),
      calories: ingCalories,
      protein: ingProtein,
      carbs: ingCarbs,
      fat: ingFat,
    });
    setCreating(false);
    if (ok) {
      // Pre-select the newly created ingredient so the user can enter grams.
      setSelectedIngredients((prev) =>
        prev.some((i) => i.name === ingName.trim())
          ? prev
          : [...prev, { name: ingName.trim(), grams: '' }]
      );
      resetIngredientForm();
      setShowCreateIngredient(false);
    }
  };

  return (
    <div className="modal-panel overflow-y-auto pb-[10vh] fixed pt-5 inset-0 z-30 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-4 border-b border-line bg-paper flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-bold font-display text-ink">
          {t('oneTimeMeal.title')}
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
        <p className="mb-4 sm:mb-6 text-sm text-muted">
          {t('oneTimeMeal.description')}
        </p>
        <div className="mb-4 sm:mb-6">
          <p className="block mb-2 text-sm font-medium text-ink-2">
            {t('oneTimeMeal.mealName')}
          </p>
          <input
            className="field text-sm"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
          />
        </div>

        <div className="mt-4 sm:mt-6 mb-2 sm:mb-4">
          <button
            onClick={() => setShowCreateIngredient(!showCreateIngredient)}
            className="w-full px-4 py-2 mb-2 rounded-full bg-leaf-50 text-leaf-700 text-sm font-semibold hover:bg-leaf-100 transition-all"
          >
            {showCreateIngredient
              ? t('oneTimeMeal.hideCreateIngredient')
              : t('oneTimeMeal.createIngredient')}
          </button>
          {showCreateIngredient && (
            <div className="p-3 bg-cream rounded-xl border border-line space-y-3">
              <div>
                <p className="block mb-1 text-sm font-medium text-ink-2">
                  {t('oneTimeMeal.ingredientName')}
                </p>
                <input
                  className="field bg-surface text-sm"
                  value={ingName}
                  onChange={(e) => setIngName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="block mb-1 text-sm font-medium text-ink-2">
                    {t('oneTimeMeal.ingredientCalories')}
                  </p>
                  <input
                    className="field bg-surface text-sm"
                    value={ingCalories}
                    onChange={(e) =>
                      handleNumberInput(e.target.value, setIngCalories)
                    }
                  />
                </div>
                <div>
                  <p className="block mb-1 text-sm font-medium text-ink-2">
                    {t('oneTimeMeal.ingredientProtein')}
                  </p>
                  <input
                    className="field bg-surface text-sm"
                    value={ingProtein}
                    onChange={(e) =>
                      handleNumberInput(e.target.value, setIngProtein)
                    }
                  />
                </div>
                <div>
                  <p className="block mb-1 text-sm font-medium text-ink-2">
                    {t('oneTimeMeal.ingredientCarbs')}
                  </p>
                  <input
                    className="field bg-surface text-sm"
                    value={ingCarbs}
                    onChange={(e) =>
                      handleNumberInput(e.target.value, setIngCarbs)
                    }
                  />
                </div>
                <div>
                  <p className="block mb-1 text-sm font-medium text-ink-2">
                    {t('oneTimeMeal.ingredientFat')}
                  </p>
                  <input
                    className="field bg-surface text-sm"
                    value={ingFat}
                    onChange={(e) => handleNumberInput(e.target.value, setIngFat)}
                  />
                </div>
              </div>
              <button
                disabled={creating}
                onClick={handleCreateIngredient}
                className="w-full px-4 py-2 rounded-full bg-leaf-500 text-white text-sm font-semibold hover:bg-leaf-600 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {t('oneTimeMeal.addIngredient')}
              </button>
            </div>
          )}
        </div>

        <input
          placeholder={t('oneTimeMeal.searchIngredients')}
          className="field text-sm mb-4 sm:mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {[...food]
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((ingredient, idx) => {
              const selected = selectedIngredients.find(
                (i) => i.name === ingredient.name
              );
              return (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-surface rounded-xl border border-line shadow-soft"
                >
                  <span className="flex-1 font-medium text-ink text-sm">
                    {ingredient.name}
                  </span>
                  <input
                    type="numeric"
                    placeholder={t('common.grams')}
                    className="field w-20 sm:w-24 text-sm"
                    value={selected?.grams ?? ''}
                    onChange={(e) => {
                      const numeric = e.target.value.replace(/[^0-9]/g, '');
                      setSelectedIngredients((prev) => {
                        const exists = prev.find(
                          (i) => i.name === ingredient.name
                        );
                        if (exists)
                          return prev.map((i) =>
                            i.name === ingredient.name
                              ? { ...i, grams: numeric }
                              : i
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
              const sanitized = selectedIngredients
                .filter((i) => i.grams !== '' && parseFloat(i.grams) > 0)
                .map((item) => ({ ...item }));
              onAdd(mealName, sanitized);
            }}
          >
            {t('oneTimeMeal.addMeal')}
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
