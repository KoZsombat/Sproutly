import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import type { CalEntry, FoodEntry } from '../types/types';
import { useTranslation } from 'react-i18next';

export default function AddFoodModal({
  visible,
  onClose,
  food,
  cals,
  onOpenIngredient,
  onOpenMeal,
  onEditIngredient,
  onDeleteIngredient,
  onEditMeal,
  onDeleteMeal,
}: {
  visible: boolean;
  onClose: () => void;
  food: FoodEntry[];
  cals: CalEntry[];
  onOpenIngredient: () => void;
  onOpenMeal: () => void;
  onEditIngredient: (id: number) => void;
  onDeleteIngredient: (id: number) => void;
  onEditMeal: (meal: CalEntry) => void;
  onDeleteMeal: (meal: CalEntry) => void;
}) {
  const { t } = useTranslation();
  const [list, setList] = useState(false);

  if (!visible) return null;

  return (
    <div className="modal-panel overflow-y-auto pb-[10vh] fixed pt-5 inset-0 z-20 overflow-hidden flex flex-col">
      <div className="flex flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-4 border-b border-line bg-paper flex-shrink-0">
        <p className="text-3xl sm:text-4xl font-bold font-display text-ink">
          {t('manageFood.title')}
        </p>
        <button
          className="hover:bg-leaf-50 text-ink rounded-full p-2 transition-colors cursor-pointer"
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <IoCloseOutline size={28} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-3 sm:p-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8">
          <button
            className="px-4 py-3 rounded-full bg-leaf-100 text-leaf-700 border border-leaf-200 font-semibold text-sm sm:text-base hover:bg-leaf-200 transition-all active:scale-95"
            onClick={onOpenIngredient}
          >
            {t('manageFood.addIngredient')}
          </button>
          <button
            className="px-4 py-3 rounded-full bg-leaf-500 text-white font-semibold text-sm sm:text-base hover:bg-leaf-600 transition-all active:scale-95 shadow-card"
            onClick={onOpenMeal}
          >
            {t('manageFood.createMeal')}
          </button>
        </div>

        <div className="flex gap-2 border-b border-line mb-4 sm:mb-6">
          <button
            onClick={() => setList(false)}
            className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-sm transition-colors border-b-2 ${
              !list
                ? 'text-leaf-700 border-leaf-500'
                : 'text-muted border-transparent hover:text-ink-2'
            }`}
          >
            {t('manageFood.ingredients')}
          </button>
          <button
            onClick={() => setList(true)}
            className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-sm transition-colors border-b-2 ${
              list
                ? 'text-leaf-700 border-leaf-500'
                : 'text-muted border-transparent hover:text-ink-2'
            }`}
          >
            {t('manageFood.meals')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!list ? (
            <>
              {food.length === 0 ? (
                <p className="text-center text-muted py-8 col-span-full">
                  {t('manageFood.noIngredients')}
                </p>
              ) : (
                food.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white p-4 rounded-xl border border-line shadow-soft hover:border-leaf-200 transition-colors flex flex-col gap-3"
                  >
                    <span className="font-semibold text-ink text-lg">{f.name}</span>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-3 py-2 rounded-full bg-leaf-500 text-white text-xs font-semibold hover:bg-leaf-600 transition-colors"
                        onClick={() => onEditIngredient(f.id)}
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        className="flex-1 px-3 py-2 rounded-full bg-berry text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => onDeleteIngredient(f.id)}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              {cals.length === 0 ? (
                <p className="text-center text-muted py-8 col-span-full">
                  {t('manageFood.noMeals')}
                </p>
              ) : (
                cals.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white p-4 rounded-xl border border-line shadow-soft hover:border-leaf-200 transition-colors flex flex-col gap-3"
                  >
                    <span className="font-semibold text-ink text-lg">{f.name}</span>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-3 py-2 rounded-full bg-leaf-500 text-white text-xs font-semibold hover:bg-leaf-600 transition-colors"
                        onClick={() => onEditMeal(f)}
                      >
                        {t('common.edit')}
                      </button>
                      <button
                        className="flex-1 px-3 py-2 rounded-full bg-berry text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                        onClick={() => onDeleteMeal(f)}
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
