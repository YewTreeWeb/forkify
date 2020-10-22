import { elements as el } from './base'
import { limitRecipeTitle } from './searchView'

const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'
  document
    .querySelector('.recipe__love use')
    .setAttribute('href', `img/icons.svg#${iconString}`)
}

const toggleLikeMenu = numLikes => {
  el.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden'
}

const renderLike = like => {
  const html = `
	<li>
		<a class="likes__link" href="#${like.id}">
			<figure class="likes__fig">
				<img src="${like.img}" alt="${like.title}">
			</figure>
			<div class="likes__data">
				<h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
				<p class="likes__author">${like.author}</p>
			</div>
		</a>
	</li>
	`
  el.likesList.insertAdjacentHTML('beforeend', html)
}

const deleteLike = id => {
	const link = document.querySelector(`.likes__link[href*="${id}]`).parentElement
	if (link) link.parentElement.removeChild(link)
}

export { toggleLikeBtn, toggleLikeMenu, renderLike, deleteLike }
