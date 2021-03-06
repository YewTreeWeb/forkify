const elements = {
  form: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchRes: document.querySelector('.results'),
  searchResList: document.querySelector('.results__list'),
  searchResPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likesList: document.querySelector('.likes__list'),
  likesMenu: document.querySelector('.likes__field')
}

const elementStrings = {
  loader: 'loader'
}

const form = elements.form

const renderLoader = parent => {
  const loader = `
    <div class="${elementStrings.loader}">
      <svg><use href="img/icons.svg#icon-cw"></use></svg>
    </div>
  `
  parent.insertAdjacentHTML('afterbegin', loader)
}

const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`)
  if (loader) loader.parentElement.removeChild(loader)
}

export { elements, form, renderLoader, clearLoader }
