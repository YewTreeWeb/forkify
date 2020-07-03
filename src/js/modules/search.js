import axios from 'axios'

class Search {
  constructor(query) {
    this.query = query
  }

  async getResults() {
    const response = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`)
    
    if (response.status !== 200) {
      throw new Error(`Cannot fetch the recipe/s! Has status of ${response.status}`);
    } else {
      console.log(response);
    }
    
    this.data = response.data.recipes
    return this.data
  }
}


export default Search