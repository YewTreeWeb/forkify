// Import internals
import './modules/helpers'
import { elements as el, form, renderLoader, clearLoader } from './views/base'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import Search from './modules/search'
import Recipe from './modules/recipe'
import List from './modules/list'
import Likes from './modules/likes'

// Global app controller
console.log('Time to get those resipes!!')

/**
 * Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}

/**
 * Search Controller
 */
const controlSearch = async value => {
  // Get query from view
  // let query
  // if (process.env.NODE_ENV !== 'production') {
  //   query = 'pizza'
  // } else {
  //   query = value.trim().toLowerCase()
  // }
  const query = value.trim().toLowerCase()

  if (query) {
    // New search object and add to state
    state.search = new Search(query)

    // Prepare UI for results
    searchView.clear()
    renderLoader(el.searchRes)
    try {
      // Search for recipes
      await state.search.getResults()

      // Render results on UI
      if (process.env.NODE_ENV !== 'production') {
		console.log(state.search.data)
      }
      clearLoader()
      searchView.renderResults(state.search.data)
    } catch (error) {
      console.error(error)
    }
  }
}

console.log(el.form)

form.addEventListener('submit', e => {
  e.preventDefault()
  console.log(e, e.target)
  const searchValue = form.recipe.value
  if (process.env.NODE_ENV !== 'production') {
    console.log(searchValue)
  }
  controlSearch(searchValue)
})

// Testing
// if (process.env.NODE_ENV !== 'production') {
//   window.addEventListener('load', e => {
//     e.preventDefault()
//     controlSearch('pizza')
//   })
// }

el.searchResPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline')
  if (btn) {
    const goToPage = Number(btn.dataset.goto)
    searchView.clear()
    searchView.renderResults(state.search.data, goToPage)
    if (process.env.NODE_ENV !== 'production') {
      console.log(goToPage)
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    console.log(btn)
  }
})

/**
 * Recipe Controller
 */
const controlRecipe = async () => {
  // Get the ID from the URL
  const id = window.location.hash.replace('#', '')
  if (process.env.NODE_ENV !== 'production') {
    console.log(id)
  }
  if (id) {
    // Prepare the UI for changes
    recipeView.clearRecipe()
    renderLoader(el.recipe)

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id)

    // Create new recipe object
    state.recipe = new Recipe(id)

    // Testing
    // if (process.env.NODE_ENV !== 'production') {
    //   window.r = state.recipe
    // }

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe()
      state.recipe.parseIngredients()
      // Calculate servings and time
      state.recipe.calcTime()
      state.recipe.calcServings()
      // Render recipe
      if (process.env.NODE_ENV !== 'production') {
        console.log(state.recipe)
      }
      clearLoader()
      recipeView.renderRecipe(state.recipe)
    } catch (error) {
			console.error(error)
    }
  }
}

;['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe))

/**
 * List Controller
 */
const controlList = () => {
	// Create a new list IF there in none yet
	if (!state.list) state.list = new List()

	// Add each ingredient to the list and UI
	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient)
		listView.renderItem(item)
	})
}

// Handle delete and update list item events
el.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid

	// Handle the delete
	if (e.target.matches('.shopping__delete, .shopping__delete *')) {
		// Delete from state
		state.list.deleteItem(id)
		// Delete from UI
		listView.deleteItem(id)
	} else if (e.target.matches('.shopping__count-value')) { // Handle the update
		const val = parseFloat(e.target.value, 10)
		state.list.updateCount(id, val)
	}
})

/**
 * Like Controller
 */
const controlLike = () => {
	if (!state.likes) state.like = new Likes()
	const currentID = state.recipe.id

	// User has NOT yer like current recipe
	if (!state.likes.isLiked()) {
		// Add like to the state
		const newLike = state.likes.addLike(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.title,
			state.recipe.img
		)
		// Toggle the like button

		// Add like to the UI list
	} else { // User HAS liked current recipe
		// Remove like to the state

		// Toggle the like button

		// Remove like to the UI list
	}
}


// Handling recipe button clicks
el.recipe.addEventListener('click', e => {
	e.preventDefault()
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		// Decrease button is clicked
		if (state.recipe.servings > 1) {
			state.recipe.updateServings('dec')
			recipeView.updateServingsIngredients(state.recipe)
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		// INcrease button is clicked
		state.recipe.updateServings('inc')
		recipeView.updateServingsIngredients(state.recipe)
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		// Add ingredients to shopping list
		controlList()
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		// Like controller
		controlLike()
	}

	if (process.env.NODE_ENV !== 'production') {
		console.log(state.recipe)
	}
})
