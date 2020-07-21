import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const response = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );

      if (response.status !== 200) {
        throw new Error(
          `Cannot fetch the recipe/s! Has status of ${response.status}`
        );
      } else {
        if (process.env.NODE_ENV !== "production") console.log(response);
      }

      this.title = response.data.recipe.title;
      this.author = response.data.recipe.publisher;
      this.image = response.data.recipe.img_url;
      this.url = response.data.recipe.source_url;
      this.ingredients = response.data.recipe.ingredients;
    } catch (error) {
      console.error(error);
    }
  }

  calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
    console.log(this.time);
  }

  calcServings() {
    this.servings = 4;
  }
}

export default Recipe;
