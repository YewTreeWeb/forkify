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

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
      "grams",
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
      "g",
    ];

    const newIngredients = this.ingredients.map((e) => {
      // 1. Uniform units
      let ingredient = e.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // 3. Parse ingredients into count, unit and ingredients
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el) => unitsShort.includes(el));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        // 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2")  --> 4.5
        // 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (Number(arrIng[0], 10)) {
        // There is NO unit, but the 1st element is a number
        objIng = {
          count: Number(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }
}

export default Recipe;
