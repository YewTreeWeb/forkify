// Import internals
import "./modules/helpers";
import { elements as el, form, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import Search from "./modules/search";

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

const controlSearch = async (value) => {
  // Get query from view
  const query = value.trim().toLowerCase();

  if (query) {
    try {
      // New search object and add to state
      state.search = new Search(query);

      // Prepare UI for results
      searchView.clear();
      renderLoader(el.searchRes);

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
