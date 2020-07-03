import { elements as el } from "./base";

const clear = () => {
  el.searchResList.innerHTML = ''
  if (process.env.NODE_ENV !== 'production') {
    console.log('cleared data');
  }
}

const renderRecipe = recipe => {
  const html = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${recipe.title}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
    </li>
  `
  el.searchResList.insertAdjacentHTML('beforeend', html)
}

const renderResults = recipes => {
  recipes.forEach(renderRecipe);
}

export { renderResults, clear }