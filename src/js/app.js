// Import internals
import "./modules/helpers";
import { elements as el, form, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import Search from "./modules/search";
import Recipe from "./modules/recipe";

// Global app controller
console.log("Time to get those resipes!!");

/**
 * Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * Search Controller
 */
const controlSearch = async (value) => {
  // Get query from view
  const query = value.trim().toLowerCase();

  if (query) {
    // New search object and add to state
    state.search = new Search(query);

    // Prepare UI for results
    searchView.clear();
    renderLoader(el.searchRes);
    try {
      // Search for recipes
      await state.search.getResults();

      // Render results on UI
      if (process.env.NODE_ENV !== "production") {
        console.log(state.search.data);
      }
      clearLoader();
      searchView.renderResults(state.search.data);
    } catch (error) {
      console.error(error);
    }
  }
};

console.log(el.form);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e, e.target);
  const searchValue = form.recipe.value;
  if (process.env.NODE_ENV !== "production") {
    console.log(searchValue);
  }
  controlSearch(searchValue);
});

// Testing
// if (process.env.NODE_ENV !== "production") {
//   window.addEventListener("load", (e) => {
//     e.preventDefault();
//     controlSearch("pizza");
//   });
// }

el.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = Number(btn.dataset.goto);
    searchView.clear();
    searchView.renderResults(state.search.data, goToPage);
    if (process.env.NODE_ENV !== "production") {
      console.log(goToPage);
    }
  }
  if (process.env.NODE_ENV !== "production") {
    console.log(btn);
  }
});

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
  // Get the ID from the URL
  const id = window.location.hash.replace("#", "");
  if (process.env.NODE_ENV !== "production") {
    console.log(id);
  }
  if (id) {
    // Prepare the UI for changes
    // Create new recipe object
    state.recipe = new Recipe(id);

    // Testing
    // if (process.env.NODE_ENV !== "production") {
    //   window.r = state.recipe;
    // }

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render recipe
      if (process.env.NODE_ENV !== "production") {
        console.log(state.recipe);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);
