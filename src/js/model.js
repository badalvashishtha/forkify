import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (response) {
  const { recipe } = response.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    // console.log(id);
    const response = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    // console.log(response);
    state.recipe = createRecipeObject(response);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    console.error(`${err.message}💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // if (!query || query === '') {
    //   return;
    // }
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;

    // console.log(state);
  } catch (err) {
    console.error(`${err}💥💥💥`);
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};
// loadSearchResults('pizza');

export const updateServings = function (newServings) {
  // console.log(state);
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    /////newQt = oldQt*newServings/oldServings
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function (recipe) {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  //Add bookmark
  // console.log(recipe);
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // console.log(state);
  persistBookmark();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  // console.log(index);
  state.bookmarks.splice(index, 1);

  //mark currrent recipe as NOT bookmarkes
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const UploadRecipe = async function (newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        const [quantity, unit, description] = ingArr;
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format! Please use the correct format'
          );
        // console.log(quantity, unit, description);
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(newRecipe);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log(ingredients);
    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // console.log(data);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// console.log(state.bookmarks);
