// Get recipes function
async function getRecipes(url) {
  console.log(url);
  if (url.includes("query")) {
    console.log("recipe name");
    const responseRecipe = await fetch(url);
    const recipesRecipe = await responseRecipe.json();

    console.log(recipesRecipe);
    outputCards(recipesRecipe.results);
  } else if (url.includes("ingredients")) {
    console.log("ingredients");
    const responseIngredients = await fetch(url);
    const recipesIngredients = await responseIngredients.json();

    console.log(recipesIngredients);
    outputCards(recipesIngredients);
  } else {
    console.log("default");
    const responseDefaultRecipes = await fetch(url);
    const defaultRecipes = await responseDefaultRecipes.json();

    console.log(defaultRecipes);
    outputCards(defaultRecipes.results);
  }
}

export default async function init() {
  console.log("recipes works");
  const apiKey = "458fa3b63d9e4e0b8c6b85edb81edd4b";
  let requestRecipe = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`;
  let requestIng = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${apiKey}`;
  const filterBtn = document.querySelector("#filterBtn");
  let offset = 0;

  if (window.location.search.includes("query")) {
    const inputRecipe = window.location.search.substring(1);

    requestRecipe += `&${inputRecipe}`;

    // Search by recipe
    await getRecipes(requestRecipe + `&offset=${offset}`);
    filterBtn.addEventListener("click", async () => await applyFilters(requestRecipe + `&offset=${offset}`));
  } else if (window.location.search.includes("ing1")) {
    const inputIngredients = window.location.search.substring(1).split("&");

    inputIngredients.forEach((ing, index) => {
      const ingredient = ing.substring(ing.indexOf("=") + 1);

      if (index === 0) {
        requestIng += `&ingredients=${ingredient}`;
      } else {
        requestIng += `,${ingredient}`;
      }
    });

    await getRecipes(requestIng);
    filterBtn.addEventListener("click", async () => await applyFilters(requestIng));
  } else {
    await getRecipes(requestRecipe);
    filterBtn.addEventListener("click", async () => await applyFilters(requestRecipe));
  }

  // FILTERS section ================================================ //
  filtersShow();
}

//CREATE CARDS AND OUTPUT
function outputCards(recipes) {
  let resultArea = document.getElementById("resultTest");

  for (let i = 0; i < recipes.length; i++) {
    let cardLink = document.createElement("a");

    cardLink.href = `?id=${recipes[i].id}#oneRecipe`;

    cardLink.classList.add("card-link");
    cardLink.classList.add("recipe-card");

    const card = document.createElement("div");
    card.classList.add("card");

    const cardImgContainer = document.createElement("div");
    cardImgContainer.classList.add("recipe-card__img");

    const cardButton = document.createElement("button");

    const cardImage = document.createElement("img");
    cardImage.classList.add("card-img-top");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardStars = document.createElement("div");
    cardStars.classList.add("rating-stars");

    const cardTitle = document.createElement("h3");
    cardTitle.classList.add("card-title");

    const cardTitleText = document.createTextNode(`${recipes[i].title}`);
    cardTitle.appendChild(cardTitleText);

    cardImage.src = `${recipes[i].image}`;

    cardImgContainer.appendChild(cardButton);
    cardImgContainer.appendChild(cardImage);
    cardBody.appendChild(cardStars);
    cardBody.appendChild(cardTitle);

    card.appendChild(cardImgContainer);
    card.appendChild(cardBody);
    cardLink.appendChild(card);

    resultArea.appendChild(cardLink);
  }
}

function filtersShow() {
  // Filters arrays:
  const cuisines = ["American", "Chinese", "European", "Italian", "Japanese", "Korean", "Mexican", "Mediterranean", "Vietnamese"];
  const diets = ["Gluten Free", "Vegetarian", "Vegan", "Keto", "Pescatarian"];
  const types = ["main course", "dessert", "appetizer", "breakfast", "drink", "soup"];

  // Cuisine
  const accordionCuisine = document.querySelector("#accordion-cuisine");
  cuisines.forEach((country, i) => {
    accordionCuisine.innerHTML += `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="filter${i}" data-cuisine="${country}" />
      <label class="form-check-label" for="filter${i}">${country}</label>
    </div>
    `;
  });

  // Diet
  const accordionDiet = document.querySelector("#accordion-diet");
  diets.forEach((diet, i) => {
    accordionDiet.innerHTML += `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="filter${i}" data-diet="${diet}" />
      <label class="form-check-label" for="filter${i}">${diet}</label>
    </div>
    `;
  });

  // Type
  const accordionType = document.querySelector("#accordion-type");
  types.forEach((type, i) => {
    accordionType.innerHTML += `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="filter${i}" data-type="${type}" />
      <label class="form-check-label" for="filter${i}">${type}</label>
    </div>
    `;
  });
}

async function applyFilters(baseURL) {
  const resultArea = document.getElementById("resultTest");

  const inputsCuisine = document.querySelectorAll("#accordion-cuisine .form-check-input");
  let cuisineQuery = "&cuisine=";
  inputsCuisine.forEach((input) => {
    if (input.checked) {
      cuisineQuery += `${input.dataset.cuisine},`;
    }
  });

  const inputsDiet = document.querySelectorAll("#accordion-diet .form-check-input");
  let dietQuery = "";
  inputsDiet.forEach((input) => {
    if (input.checked) {
      dietQuery += `&diet=${input.dataset.diet}`;
    }
  });

  const inputsType = document.querySelectorAll("#accordion-type .form-check-input");
  let typeQuery = "";
  inputsType.forEach((input) => {
    if (input.checked) {
      typeQuery += `&type=${input.dataset.type}`;
    }
  });

  const url = baseURL + cuisineQuery + dietQuery + typeQuery;
  console.log(url);
  // const responseDefaultRecipes = await fetch(url);
  // const defaultRecipes = await responseDefaultRecipes.json();

  // console.log(defaultRecipes);
  resultArea.innerHTML = "";
  // outputCards(defaultRecipes);
  await getRecipes(url);
}
