import { API, KEY } from "./config.js";

export const state = {
  recipe: {},
  allRecipes: [],
  bookmark: [],
};

export const loadSearchResults = async function (recipe) {
  try {
    const response = await fetch(`${API}?search=${recipe}&key=${KEY}`);
    const data = await response.json();

    const recipeArr = data.data.recipes;

    if (recipeArr.length === 0) {
      console.log("cant load recipe");
    }

    state.allRecipes = recipeArr.map((recipe) => {
      return {
        id: recipe.id,
        publisher: recipe.publisher,
        image_url: recipe.image_url,
        title: recipe.title,
      };
    });
  } catch (error) {
    console.error(`${error}`);
  }
};

export const showRecipe = async function (id) {
  try {
    const response = await fetch(`${API}/${id}?key=${KEY}`);
    const data = await response.json();
    const { recipe } = data.data;

    state.recipe = {
      publisher: recipe.publisher,
      source_url: recipe.source_url,
      image_url: recipe.image_url,
      title: recipe.title,
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      recipeId: recipe.id,
      ingredients: recipe.ingredients,
    };
  } catch (error) {
    console.error(`${error}`);
  }
};

const setLocalStorage = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmark));
};

const retrieveLS = function () {
  const storage = localStorage.getItem("bookmarks");

  if (storage) state.bookmark = JSON.parse(storage);
};
retrieveLS();

export const addBookmark = function (recipe) {
  state.bookmark.push({
    bookmarked: true,
    id: recipe.recipeId,
    title: recipe.title,
    publisher: recipe.publisher,
    image_url: recipe.image_url,
  });

  if (state.recipe.recipeId === recipe.recipeId) state.recipe.bookmarked = true;

  setLocalStorage();
};

export const isBookMarked = function (recipeId) {
  return state.bookmark.some((bm) => bm.id === recipeId);
};

export const removeBookmark = function (recipe) {
  const index = state.bookmark.findIndex((bm) => bm.id === recipe.recipeId);

  if (index > -1) {
    state.bookmark.splice(index, 1);
  }

  if (state.recipe.recipeId === recipe.recipeId) {
    state.recipe.bookmarked = false;
  }

  setLocalStorage();
};

export const uploadRecipe = async function (uploadedRecipe) {
  console.log(state.recipe);
  try {
    console.log(uploadedRecipe);
    console.log(Object.entries(uploadedRecipe));

    const ingredients = Object.entries(uploadedRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] != "")
      .map((ing) => {
        // return ing[1].replaceAll(" ", "").split(",");
        const ingArr = ing[1].replaceAll(" ", "").split(",");

        if (ingArr.length !== 3) {
          throw new Error("Wrong format! Kindly enter the right ingredients!");
        }
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const newRecipe = {
      bookmarked: "",
      publisher: uploadedRecipe.publisher,
      source_url: uploadedRecipe.sourceUrl,
      image_url: uploadedRecipe.image,
      title: uploadedRecipe.title,
      servings: +uploadedRecipe.servings,
      cooking_time: +uploadedRecipe.cookingTime,
      recipeId: "",
      ingredients: ingredients,
    };

    // Post data to API
    const response = await fetch(`${API}?key=${KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecipe),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message} (${response.status});`);
    }

    const recipe = {
      bookmarked: true,
      publisher: data.data.recipe.publisher,
      source_url: data.data.recipe.source_url,
      image_url: data.data.recipe.image_url,
      title: data.data.recipe.title,
      servings: data.data.recipe.servings,
      cooking_time: data.data.recipe.cooking_time,
      recipeId: data.data.recipe.id,
      ingredients: data.data.recipe.ingredients,
    };
    state.recipe = recipe;
    addBookmark(recipe);

    console.log(response);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
