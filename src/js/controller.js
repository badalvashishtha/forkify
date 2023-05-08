import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import View from './views/view.js';
// import { from } from 'core-js/fn/array';
// https://forkify-api.herokuapp.com/v2
//////////////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.randerspinner();

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1) loading recipe
    await model.loadRecipe(id);

    // 2) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.randerspinner();

    // 1) get search query
    const query = searchView.getQuery();

    if (!query) return;
    // 2) load search results
    await model.loadSearchResults(query);

    // 3)render results
    resultsView.render(model.getSearchResultsPage());

    //4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  // console.log(goToPage);
  // 1)render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2) render New pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) add/remove bookmarks
  // console.log(model.state.recipe);
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update bookmarks
  recipeView.update(model.state.recipe);

  //3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.randerspinner();

    //upload the new recipe data
    await model.UploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome');
};
init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
