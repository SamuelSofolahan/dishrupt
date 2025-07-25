export const recipeView = function (allRecipes) {
  const resultsUl = document.querySelector(".results__list");

  resultsUl.innerHTML = "";

  // if (allRecipes = []) {
  //   alert("No recipe found");
  //   return;
  // }

  allRecipes.forEach((recipe) => {
    const html = `
    <li class="preview">
        <a class="preview__link preview__link--active" href="#${recipe.id}">
            <figure class="preview__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.publisher}</p>
            </div>
        </a>
    </li>
  `;
    resultsUl.insertAdjacentHTML("beforeend", html);
  });
};

export const renderError = function () {
  const resultsUl = document.querySelector(".results__list");
  const html = `<div class="error">
          <div>
            <svg class="recipe__info-icon">
              <use href="./assets/icons.svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>No recipes 🍒 found for your query. Please, try again!</p>
        </div>`;

  resultsUl.insertAdjacentHTML("afterbegin", html);
};

export const recipeDetail = function (recipe) {
  document.querySelector("#recipe").innerHTML = "";
  const html = `
    <figure class="recipe__fig">
        <img
          src="${recipe.image_url}"
          alt="${recipe.title}"
          class="recipe__img"
        />
        <h1 class="recipe__title">
          <span>${recipe.title}</span>
        </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="./assets/icons.svg#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes"
          >${recipe.cooking_time}</span
        >
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="./assets/icons.svg#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          recipe.servings
        }</span>
        <span class="recipe__info-text">servings</span>
      </div>

      <button class="btn--round btn--bookmark">
        <svg class="recipe__info-icon">
         <use href="./assets/icons.svg#icon-bookmark${
           recipe.bookmarked ? "-fill" : ""
         }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${recipe.ingredients
        .map(
          (ing) =>
            `<li class="recipe__ingredient">✔ ${ing.quantity ?? ""}${
              ing.unit ?? ""
            } ${ing.description ?? ""}</li>`
        )
        .join("")}
      </ul>
    </div>
  `;

  document.querySelector("#recipe").insertAdjacentHTML("afterbegin", html);
};
