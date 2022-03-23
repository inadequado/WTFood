// Get recipes function
async function getRecipes(url) {
  if(url.includes('query')) {
    const responseRecipe = await fetch(url);
    const recipesRecipe = await responseRecipe.json();

    console.log(recipesRecipe.results);
    outputCards(recipesRecipe.results);

  } else{
    const responseIngredients = await fetch(url);
    const recipesIngredients = await responseIngredients.json();

    console.log(recipesIngredients);
    outputCards(recipesIngredients);
  }
}


export default async function init() {
  console.log('recipes works')
  const apiKey = "458fa3b63d9e4e0b8c6b85edb81edd4b";
  let requestRecipe = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`;
  let requestIng = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}`;

  if (window.location.search.includes('query')) {
    const inputRecipe = window.location.search.substring(1);
    
    requestRecipe += `&${inputRecipe}`;

    // Search by recipe
    await getRecipes(requestRecipe);

  } else if (window.location.search.includes('ing1')) {
    const inputIngredients = window.location.search.substring(1).split('&');

    inputIngredients.forEach((ing, index) => {
      const ingredient = ing.substring(ing.indexOf('=')+1);

        if(index === 0) {
          requestIng += `&ingredients=${ingredient}`
        } else {
          requestIng += `,${ingredient}`
        }
    })

    await getRecipes(requestIng);

  } else {
    document.querySelector('.section-heading').innerHTML = '<h1>RESULTS HERE</h1>'
  }
}

//CREATE CARDS AND OUTPUT
function outputCards(recipes) {
  let resultArea = document.getElementById("resultTest");

  for (let i = 0; i < recipes.length; i++) {
    let cardLink = document.createElement("a");
    cardLink.href = `?id=${recipes[i].id}#oneRecipe`;
    cardLink.classList.add("card-link");

    let card = document.createElement("div");
    card.classList.add("card");

    let cardImage = document.createElement("img");
    cardImage.classList.add("card-img-top");

    let cardTitle = document.createElement("h3");
    cardTitle.classList.add("card-title");

    let cardTitleText = document.createTextNode(`${recipes[i].title}`);
    cardTitle.appendChild(cardTitleText);

    cardImage.src = `${recipes[i].image}`;

    card.appendChild(cardImage);
    card.appendChild(cardTitle);
    cardLink.appendChild(card);

    resultArea.appendChild(cardLink);
  }
}

