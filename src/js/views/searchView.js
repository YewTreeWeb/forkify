import { elements as el } from "./base";

const clear = () => {
  el.form.reset();
  el.searchResList.innerHTML = "";
  el.searchResPages.innerHTML = "";
  if (process.env.NODE_ENV !== "production") {
    console.log("cleared data");
  }
};

const highlightSelected = id => {
	const resultsArr = Array.from(document.querySelectorAll('.results__link'))
	const activeResult = document.querySelector(`.results__link[href="#${id}"]`)

	resultsArr.forEach(el => el.classList.remove('results__link--active'))
	activeResult.classList.add('results__link--active')
}

/**
 * 'Pasta with tomato and spinach' = array of 5 elements
 * acc: 0 / acc + cur.length (5) = 5 / newTitle = ['Pasta']
 * acc: 5 / acc + cur.length (4) = 9 / newTitle = ['Pasta', 'with]
 * acc: 9 / acc + cur.length (6) = 15 / newTitle = ['Pasta', 'with', 'tomato']
 * acc: 15 / acc + cur.length (3) = 18 / newTitle = ['Pasta', 'with', 'tomato']
 * acc: 18 / acc + cur.length (7) = 25 / newTitle = ['Pasta', 'with', 'tomato']
 */
const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);
    // return the result
    return `${newTitle.join(" ")}...`;
  }
  return title;
};

const renderRecipe = (recipe) => {
  const html = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `;
  el.searchResList.insertAdjacentHTML("beforeend", html);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto="${
  type === "prev" ? page - 1 : page + 1
}">
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${
        type === "prev" ? "left" : "right"
      }"></use>
    </svg>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
  </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);
  let button;

  if (page === 1 && pages > 1) {
    // Button to go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Show both buttons
    button = `
      ${createButton(page, "prev")}
      ${createButton(page, "next")}
    `;
  } else if (page === pages && pages > 1) {
    // Button to only go to prev page
    button = createButton(page, "prev");
  }

  el.searchResPages.insertAdjacentHTML("afterbegin", button);
};

const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // render pagination buttons
  renderButtons(page, recipes.length, resPerPage);
};

export { renderResults, clear, highlightSelected, limitRecipeTitle };
