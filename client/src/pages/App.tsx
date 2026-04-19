import Header from '../components/Header';
import SettingsModal from '../components/SettingsModal';
import StatsDisplay from '../components/StatsDisplay';
import TodaysCuisine from '../components/TodaysCuisine';
import AppendFoodModal from '../components/AppendFoodModal';
import AddFoodModal from '../components/AddFoodModal';
import AddIngredientModal from '../components/AddIngredientModal';
import AddMealModal from '../components/AddMealModal';
import Navbar from '../components/Navbar';
import History from '../components/HistoryModal';
import WaterIntake from '../components/WaterIntake';
import CreatineIntake from '../components/CreatineIntake';
import ToastDisplay from '../components/ToastDisplay';
import { useToast } from '../context/ToastContext';
import type { CalEntry, FoodEntry, EatenEntry, EatenHistory } from '../types/types';
import { useState, useEffect, useCallback } from 'react';

export default function App({ onLogout }: { onLogout: () => void }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { addToast } = useToast();
  const [username, setUsername] = useState<string>('');

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem('token');
    onLogout();
  }, [onLogout]);

  const [visibleTabs, setVisibleTabs] = useState<{ [key: string]: boolean }>({
    appendFood: false,
    settingsTab: false,
    addFood: false,
    addIngredient: false,
    addMeal: false,
    historyTab: false,
  });

  const toggleTab = (tab: string) => () => {
    setVisibleTabs((prev) => ({ ...prev, [tab]: !prev[tab] }));
  };

  const activeTab = Object.keys(visibleTabs).find((key) => visibleTabs[key]);

  // Settings state
  const [email, setEmail] = useState('');
  const [calorieMax, setMaxCalories] = useState('0');
  const [proteinMax, setMaxProtein] = useState('0');
  const [carbsMax, setMaxCarbs] = useState('0');
  const [fatMax, setMaxFat] = useState('0');
  const [waterGoal, setWaterGoal] = useState('2');
  const [creatineEnabled, setCreatineEnabled] = useState(true);
  const [userNationality, setUserNationality] = useState('');
  const [waterIntake, setWaterIntake] = useState(0);
  const [creatineDone, setCreatineDone] = useState(false);
  // Stats state
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);

  // Food data
  const [cals, setCals] = useState<CalEntry[]>([]);
  const [food, setFood] = useState<FoodEntry[]>([]);
  const [Eaten, setEaten] = useState<EatenEntry[]>([]);
  const [eatenHistory, setEatenHistory] = useState<EatenHistory[]>([]);

  // Ingredient state
  const [ingredientName, setIngredientName] = useState('name');
  const [ingredientCalories, setIngredientCalories] = useState('0');
  const [ingredientProtein, setIngredientProtein] = useState('0');
  const [ingredientCarbs, setIngredientCarbs] = useState('0');
  const [ingredientFat, setIngredientFat] = useState('0');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState<string | number | null>(null);

  // Meal state
  const [mealName, setMealName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<{ name: string; grams: string }[]>(
    []
  );
  const [editMealOldName, setEditMealOldName] = useState<string | null>(null);
  const [editMealMode, setEditMealMode] = useState(false);
  const [editMealName, setEditMealName] = useState('');
  const [editMealIngredients, setEditMealIngredients] = useState<{ name: string; grams: string }[]>(
    []
  );

  const Start = useCallback(async () => {
    try {
      const userData = localStorage.getItem('token');
      if (!userData) {
        return;
      }

      const response = await fetch(`${apiUrl}/auth/verifyToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, [apiUrl, handleUnauthorized]);

  const Load = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      setEmail(data.email);
      setMaxCalories(String(data.calories));
      setMaxProtein(String(data.protein));
      setMaxCarbs(String(data.carbs));
      setMaxFat(String(data.fat));
      setWaterGoal(String(data.waterGoal ?? 2));
      setCreatineEnabled(data.creatineEnabled ?? true);
      setUserNationality(data.nationality);
    } catch (e) {
      console.error('Failed to fetch user data', e);
    }
  }, [apiUrl, handleUnauthorized]);

  const Update = async (next: {
    email: string;
    calorieMax: string;
    proteinMax: string;
    carbsMax: string;
    fatMax: string;
    waterGoal: string;
    creatineEnabled: boolean;
    nationality: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: next.email,
          calories: parseFloat(next.calorieMax),
          protein: parseFloat(next.proteinMax),
          carbs: parseFloat(next.carbsMax),
          fat: parseFloat(next.fatMax),
          waterGoal: parseFloat(next.waterGoal.replace(',', '.')),
          creatineEnabled: next.creatineEnabled,
          nationality: next.nationality,
        }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        const error = await response.json();
        console.error('Update failed:', error);
        return;
      }
      const result = await response.json();
      if (result.success) {
        setEmail(next.email);
        setMaxCalories(next.calorieMax);
        setMaxProtein(next.proteinMax);
        setMaxCarbs(next.carbsMax);
        setMaxFat(next.fatMax);
        setWaterGoal(next.waterGoal);
        setCreatineEnabled(next.creatineEnabled);
        setUserNationality(next.nationality);
      }
    } catch (e) {
      console.error('Failed to update user data', e);
    }
  };

  const LoadFood = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/food`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await response.json();
      setFood(data.ingredients);
      setCals(data.meals);
      setEaten(data.eaten);

      try {
        const historyResponse = await fetch(`${apiUrl}/api/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (historyResponse.status === 401) {
          handleUnauthorized();
          return;
        }
        const historyData = await historyResponse.json();
        setEatenHistory(historyData.history);
      } catch (e) {
        console.error('Failed to fetch history data', e);
      }
    } catch (e) {
      console.error('Failed to fetch food data', e);
    }
  }, [apiUrl, handleUnauthorized]);

  const LoadTracking = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/tracking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        const error = await response.json();
        console.error('Tracking load failed:', error);
        return;
      }
      const data = await response.json();
      setWaterIntake(Number(data.water ?? 0));
      setCreatineDone(Boolean(data.creatineDone));
    } catch (e) {
      console.error('Failed to load tracking data', e);
    }
  }, [apiUrl, handleUnauthorized]);

  const UpdateWaterTracking = async (liters: number) => {
    setWaterIntake(liters);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/tracking/water`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ liters }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        const error = await response.json();
        console.error('Water tracking update failed:', error);
      }
    } catch (e) {
      console.error('Failed to update water tracking', e);
    }
  };

  const UpdateCreatineTracking = async (done: boolean) => {
    setCreatineDone(done);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/tracking/creatine`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ done }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        const error = await response.json();
        console.error('Creatine tracking update failed:', error);
      }
    } catch (e) {
      console.error('Failed to update creatine tracking', e);
    }
  };

  const AddIngredient = async (ingredient: {
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  }) => {
    const isValidNumber = (value: string) => /^[0-9]*\.?[0-9]+$/.test(value.trim());

    if (
      ingredient.name &&
      isValidNumber(ingredient.calories) &&
      isValidNumber(ingredient.protein) &&
      isValidNumber(ingredient.carbs) &&
      isValidNumber(ingredient.fat)
    ) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/ingredient`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: ingredient.name,
            calories: parseFloat(ingredient.calories),
            protein: parseFloat(ingredient.protein),
            carbs: parseFloat(ingredient.carbs),
            fat: parseFloat(ingredient.fat),
          }),
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!response.ok) {
          addToast('Failed to create ingredient', 'error');
          return;
        }
        addToast('Ingredient created successfully', 'success');
        setIngredientName('name');
        setIngredientCalories('0');
        setIngredientProtein('0');
        setIngredientCarbs('0');
        setIngredientFat('0');
        LoadFood();
      } catch (e) {
        console.error('Failed to add ingredient', e);
        addToast('Error creating ingredient', 'error');
      }
    }
  };

  const handleEditIngredient = (id: number) => {
    const selected = food.find((f) => f.id === id);
    if (selected) {
      setEditMode(true);
      setEditName(id);
      setIngredientName(selected.name);
      setIngredientCalories(String(selected.cal));
      setIngredientProtein(String(selected.protein));
      setIngredientCarbs(String(selected.carbs));
      setIngredientFat(String(selected.fat));
      setVisibleTabs((prev) => ({ ...prev, addFood: false, addIngredient: true }));
    }
  };

  const EditIngerdient = async (
    id: number,
    ingredient: { name: string; calories: string; protein: string; carbs: string; fat: string }
  ) => {
    const isValidNumber = (value: string) => /^[0-9]*\.?[0-9]+$/.test(value.trim());

    if (
      ingredient.name &&
      isValidNumber(ingredient.calories) &&
      isValidNumber(ingredient.protein) &&
      isValidNumber(ingredient.carbs) &&
      isValidNumber(ingredient.fat)
    ) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/ingredient`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id,
            name: ingredient.name,
            calories: parseFloat(ingredient.calories),
            protein: parseFloat(ingredient.protein),
            carbs: parseFloat(ingredient.carbs),
            fat: parseFloat(ingredient.fat),
          }),
        });
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!response.ok) {
          addToast('Failed to update ingredient', 'error');
          return;
        }
        addToast('Ingredient updated successfully', 'success');
        setIngredientName('name');
        setIngredientCalories('0');
        setIngredientProtein('0');
        setIngredientCarbs('0');
        setIngredientFat('0');
        LoadFood();
      } catch (e) {
        console.error('Failed to edit ingredient', e);
        addToast('Error updating ingredient', 'error');
      }
    }
  };

  const DeleteIngerdient = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/ingredient`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        addToast('Failed to delete ingredient', 'error');
        return;
      }
      addToast('Ingredient deleted successfully', 'success');
      LoadFood();
    } catch (e) {
      console.error('Failed to delete ingredient', e);
      addToast('Error deleting ingredient', 'error');
    }
  };

  const handleMealAddOrEdit = async (
    name: string,
    ingredients: { name: string; grams: string }[]
  ) => {
    const filtered = ingredients.filter((i) => i.grams !== '' && parseFloat(i.grams) > 0);
    if (editMealMode && editMealOldName !== null) {
      const mealId =
        typeof editMealOldName === 'string' ? parseInt(editMealOldName, 10) : editMealOldName;
      await EditMeal(
        mealId,
        name,
        filtered.map((i) => `${i.name}:${i.grams}`)
      );
    } else {
      await AddMeal(
        name,
        filtered.map((i) => `${i.name}:${i.grams}`)
      );
    }
    setMealName('');
    setSelectedIngredients([]);
    setEditMealMode(false);
    setEditMealOldName(null);
    setEditMealName('');
    setEditMealIngredients([]);
    setVisibleTabs((prev) => ({
      ...prev,
      addMeal: false,
      addFood: true,
    }));
  };

  const handleAddIngredientModalClose = () => {
    setVisibleTabs((prev) => ({
      ...prev,
      addIngredient: false,
      addFood: true,
    }));
    setEditMode(false);
    setEditName(null);
  };

  const handleAddIngredientModalAdd = (ingredient: {
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    displayAsMeal?: boolean;
    mealGrams?: string;
  }) => {
    if (editMode && editName !== null) {
      const id = typeof editName === 'string' ? parseInt(editName, 10) : editName;
      EditIngerdient(id, ingredient);
      setEditMode(false);
      setEditName(null);
    } else {
      AddIngredient(ingredient);
      if (ingredient.displayAsMeal) {
        const grams =
          ingredient.mealGrams && ingredient.mealGrams !== '' ? ingredient.mealGrams : '100';
        AddMeal(ingredient.name, [`${ingredient.name}:${grams}`]);
      }
    }
    setVisibleTabs((prev) => ({
      ...prev,
      addIngredient: false,
      addFood: true,
    }));
  };

  const handleAddMealModalClose = () => {
    setVisibleTabs((prev) => ({
      ...prev,
      addMeal: false,
      addFood: true,
    }));
    setEditMealMode(false);
    setEditMealOldName(null);
    setEditMealName('');
    setEditMealIngredients([]);
  };

  const handleAddFoodModalOpenMeal = () => {
    toggleTab('addMeal')();
    setEditMealMode(false);
    setMealName('');
    setSelectedIngredients([]);
  };

  const handleAddFoodModalEditMeal = (meal: CalEntry) => {
    setEditMealOldName(meal.id.toString());
    setEditMealName(meal.name);
    setEditMealIngredients(
      meal.food.map((name, index) => ({ name, grams: meal.grams[index] ?? '' }))
    );
    setEditMealMode(true);
    setVisibleTabs((prev) => ({ ...prev, addFood: false, addMeal: true }));
  };

  const AddMeal = async (mealName: string, foodList: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/meal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: mealName, food: foodList }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        addToast('Failed to create meal', 'error');
        return;
      }
      addToast('Meal created successfully', 'success');
      LoadFood();
    } catch (e) {
      console.error('Failed to add meal', e);
      addToast('Error creating meal', 'error');
    }
  };

  const EditMeal = async (id: number, newName: string, foodList: string[]) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/meal`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, name: newName, food: foodList }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        addToast('Failed to update meal', 'error');
        return;
      }
      addToast('Meal updated successfully', 'success');
      LoadFood();
    } catch (e) {
      console.error('Failed to edit meal', e);
      addToast('Error updating meal', 'error');
    }
  };

  const DeleteMeal = async (meal: CalEntry) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/meal`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: meal.id, name: meal.name }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        addToast('Failed to delete meal', 'error');
        return;
      }
      addToast('Meal deleted successfully', 'success');
      LoadFood();
    } catch (e) {
      console.error('Failed to delete meal', e);
      addToast('Error deleting meal', 'error');
    }
  };

  const AddEaten = async (mealName: string) => {
    try {
      if (mealName === '') return;
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/eaten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meal: mealName }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        addToast('Failed to add meal', 'error');
        return;
      }
      addToast('Meal added successfully', 'success');
      LoadFood();
      toggleTab('appendFood')();
    } catch (e) {
      console.error('Failed to add eaten meal', e);
      addToast('Error adding meal', 'error');
    }
  };

  const handleDeleteEaten = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/eaten`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!response.ok) {
        addToast('Failed to delete meal', 'error');
        return;
      }
      addToast('Meal removed', 'success');
      LoadFood();
    } catch (e) {
      console.error('Failed to delete eaten meal', e);
      addToast('Error removing meal', 'error');
    }
  };

  const Clear = async () => {
    try {
      const token = localStorage.getItem('token');
      const clearResponse = await fetch(`${apiUrl}/api/eaten/all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (clearResponse.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!clearResponse.ok) {
        addToast('Failed to save day', 'error');
        return;
      }
      const historyResponse = await fetch(`${apiUrl}/api/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          calories,
          protein,
          carbs,
          fat,
          date: new Date().toISOString(),
        }),
      });
      if (historyResponse.status === 401) {
        handleUnauthorized();
        return;
      }
      addToast('Day saved successfully', 'success');
      LoadFood();
      LoadTracking();
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
    } catch (e) {
      console.error('Failed to clear eaten', e);
      addToast('Error saving day', 'error');
    }
  };

  const openExclusiveTab = (tab: string) => () => {
    setVisibleTabs((prev) => {
      const newTabs = Object.fromEntries(Object.keys(prev).map((k) => [k, false]));
      newTabs[tab] = !prev[tab];
      return newTabs;
    });
  };

  useEffect(() => {
    Start();
  }, [Start]);

  useEffect(() => {
    if (username) {
      Load();
      LoadFood();
      LoadTracking();
    }
  }, [Load, LoadFood, LoadTracking, username]);

  useEffect(() => {
    if (!Eaten || !food || !cals) return;

    let totalCals = 0,
      totalProtein = 0,
      totalCarbs = 0,
      totalFat = 0;

    Eaten.forEach((e) => {
      const meal = cals.find((c) => c.name === e.name);
      if (!meal) return;
      meal.food.forEach((item, idx) => {
        const grams = meal.grams && meal.grams[idx] !== '' ? meal.grams[idx] : null;
        if (!grams) return;
        const foodItem = food.find((f) => f.name === item);
        if (foodItem) {
          const factor = 1; // Always 100g
          totalCals += foodItem.cal * factor;
          totalProtein += foodItem.protein * factor;
          totalCarbs += foodItem.carbs * factor;
          totalFat += foodItem.fat * factor;
        }
      });
    });

    setCalories(parseFloat(totalCals.toFixed(2)));
    setProtein(parseFloat(totalProtein.toFixed(2)));
    setCarbs(parseFloat(totalCarbs.toFixed(2)));
    setFat(parseFloat(totalFat.toFixed(2)));
  }, [Eaten, food, cals]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pb-[10vh] flex flex-col items-center">
      <ToastDisplay />
      <SettingsModal
        visible={visibleTabs['settingsTab']}
        onClose={toggleTab('settingsTab')}
        email={email}
        calorieMax={calorieMax}
        proteinMax={proteinMax}
        carbsMax={carbsMax}
        fatMax={fatMax}
        waterGoal={waterGoal}
        creatineEnabled={creatineEnabled}
        nationality={userNationality}
        onUpdate={Update}
      />
      <div className="w-full lg:w-[80%]">
        <Header onOpenSettings={toggleTab('settingsTab')} onLogout={onLogout} />
        <StatsDisplay
          calories={calories}
          protein={protein}
          carbs={carbs}
          fat={fat}
          calorieMax={calorieMax}
          proteinMax={proteinMax}
          carbsMax={carbsMax}
          fatMax={fatMax}
        />
        <TodaysCuisine
          eaten={Eaten}
          cals={cals}
          food={food}
          Clear={Clear}
          onOpenAppend={toggleTab('appendFood')}
          onDeleteEaten={handleDeleteEaten}
        />
        <div
          className={`grid grid-cols-1 ${creatineEnabled ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-3 mx-3 my-2 sm:mx-5 sm:my-5`}
        >
          <WaterIntake
            water={waterIntake}
            goalLiters={parseFloat(waterGoal.replace(',', '.')) || 2}
            onChange={UpdateWaterTracking}
          />
          {creatineEnabled && (
            <CreatineIntake done={creatineDone} onChange={UpdateCreatineTracking} />
          )}
        </div>
      </div>
      <AppendFoodModal
        visible={visibleTabs['appendFood']}
        onClose={toggleTab('appendFood')}
        cals={cals}
        onAddEaten={AddEaten}
      />
      <AddFoodModal
        visible={visibleTabs['addFood']}
        onClose={toggleTab('addFood')}
        food={food}
        cals={cals}
        onOpenIngredient={toggleTab('addIngredient')}
        onOpenMeal={handleAddFoodModalOpenMeal}
        onEditIngredient={handleEditIngredient}
        onDeleteIngredient={DeleteIngerdient}
        onEditMeal={handleAddFoodModalEditMeal}
        onDeleteMeal={DeleteMeal}
      />
      <AddIngredientModal
        visible={visibleTabs['addIngredient']}
        onClose={handleAddIngredientModalClose}
        name={ingredientName}
        calories={ingredientCalories}
        protein={ingredientProtein}
        carbs={ingredientCarbs}
        fat={ingredientFat}
        nationality={userNationality}
        onAdd={handleAddIngredientModalAdd}
        editMode={editMode}
        apiUrl={apiUrl}
        token={localStorage.getItem('token') || ''}
        onLogout={onLogout}
      />
      <AddMealModal
        visible={visibleTabs['addMeal']}
        onClose={handleAddMealModalClose}
        food={food}
        cals={cals}
        editMode={editMealMode}
        initialMealName={editMealMode ? editMealName : mealName}
        initialIngredients={editMealMode ? editMealIngredients : selectedIngredients}
        onAdd={handleMealAddOrEdit}
      />
      <History
        visible={visibleTabs['historyTab']}
        onClose={toggleTab('historyTab')}
        eatenData={eatenHistory}
      />
      <Navbar
        onHistory={openExclusiveTab('historyTab')}
        onHome={toggleTab(activeTab ?? '')}
        onOpenManage={openExclusiveTab('addFood')}
      />
    </div>
  );
}
