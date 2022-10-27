import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import MyContext from './MyContext';

function MyProvider({ children }) {
  const history = useHistory();
  const [hideSearchInput, setHideSearchInput] = useState(false);
  const [food, setFood] = useState();
  const [drink, setDrink] = useState();
  const [ingredient, setIngredient] = useState(false);
  const [name, setName] = useState(false);
  const [letter, setLetter] = useState(false);
  const [dataFood, setDataFood] = useState([]);
  const [dataDrink, setDataDrink] = useState([]);

  useEffect(() => {
    if (dataDrink?.length === 1) {
      console.log('aqui', dataDrink[0].idDrink);
      history.push(`/drinks/${dataDrink[0].idDrink}`);
    }
  }, [dataDrink, history]);

  useEffect(() => {
    if (dataFood?.length === 1) {
      console.log('aqui', dataFood[0].idMeal);
      history.push(`/meals/${dataFood[0].idMeal}`);
    }
  }, [dataFood, history]);

  const hideSearchBar = useCallback(() => {
    setHideSearchInput(!hideSearchInput);
  }, [hideSearchInput]);

  const handleInput = ({ target: { value } }) => {
    setFood(value);
    setDrink(value);
  };

  const handleRadioIngredient = useCallback(() => {
    setIngredient(!ingredient);
    setName(false);
    setLetter(false);
  }, [ingredient]);

  const handleRadioName = useCallback(() => {
    setName(!name);
    setIngredient(false);
    setLetter(false);
  }, [setName, name]);

  const handleRadioLetter = useCallback(() => {
    setLetter(!letter);
    setName(false);
    setIngredient(false);
  }, [setLetter, letter]);

  const verifyApiFood = useCallback(() => {
    if (dataFood?.length === 0) {
      return global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  }, [dataFood]);

  const verifyApiDrink = useCallback(() => {
    if (dataDrink?.length === 0) {
      return global.alert('Sorry, we haven\'t found any recipes for these filters.');
    }
  }, [dataDrink]);

  const filterFood = useCallback(async () => {
    try {
      if (ingredient) {
        const responseIngredientsFood = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${food}`);
        const dataIngredientsFood = await responseIngredientsFood.json();
        setDataFood(dataIngredientsFood.meals);

        return verifyApiFood();
      } if (name) {
        const responseNameFood = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`);
        const dataNameFood = await responseNameFood.json();
        setDataFood(dataNameFood.meals);

        return verifyApiFood();
      }
      if (letter && food.length === 1) {
        const responseFirstLetterFood = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${food[0]}`);
        const dataFirstLetterFood = await responseFirstLetterFood.json();
        setDataFood(dataFirstLetterFood.meals);

        return verifyApiFood();
      }

      return global.alert('Your search must have only 1 (one) character');
    } catch (e) {
      throw new Error(e);
    }
  }, [food, ingredient, letter, name, verifyApiFood]);

  const filterDrink = useCallback(async () => {
    console.log(ingredient);
    try {
      if (ingredient) {
        const responseIngredientsDrink = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}`);
        const dataIngredientsDrink = await responseIngredientsDrink.json();
        setDataDrink(dataIngredientsDrink.drinks);

        return verifyApiDrink();
      } if (name) {
        const responseNameDrink = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`);
        const dataNameDrink = await responseNameDrink.json();
        setDataDrink(dataNameDrink.drinks);

        return verifyApiDrink();
      }
      if (letter && drink.length === 1) {
        const responseFirstLetterDrink = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${drink[0]}`);
        const dataFirstLetterDrink = await responseFirstLetterDrink.json();
        setDataDrink(dataFirstLetterDrink.drinks);

        return verifyApiDrink();
      }
      return global.alert('Your search must have only 1 (one) character');
    } catch (e) {
      throw new Error(e);
    }
  }, [drink, ingredient, letter, name, verifyApiDrink]);

  const context = useMemo(() => ({ hideSearchInput,
    setHideSearchInput,
    hideSearchBar,
    ingredient,
    name,
    letter,
    food,
    dataDrink,
    dataFood,
    filterDrink,
    filterFood,
    handleInput,
    handleRadioLetter,
    handleRadioName,
    handleRadioIngredient }), [filterDrink,
    dataFood,
    dataDrink,
    food,
    filterFood,
    handleRadioIngredient,
    handleRadioLetter,
    handleRadioName,
    hideSearchBar, hideSearchInput, ingredient, letter, name]);

  return (
    <MyContext.Provider value={ context }>
      { children }
    </MyContext.Provider>
  );
}

MyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}.isRequired;

export default MyProvider;
