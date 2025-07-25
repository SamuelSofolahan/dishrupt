import * as model from "./model.js";
import { recipeView, recipeDetail } from "./views/RecipeView.js";
import { bookmarkView, noBookmark } from "./views/bookmarksView.js";

// Persist bookmark data on Reload
window.addEventListener("load", function () {
  if (model.state.bookmark.length === 0) {
    noBookmark();
  } else {
    bookmarkView(model.state.bookmark);
  }
});

// Control Search Result
document.querySelector(".search__btn").addEventListener("click", function (e) {
  e.preventDefault();

  const recipe = document.querySelector(".search__field").value;

  if (!recipe) {
    alert("Enter a recipe");
    return;
  }

  const controlRecipe = async function () {
    await model.loadSearchResults(recipe);
    recipeView(model.state.allRecipes);
  };

  controlRecipe();
  document.querySelector(".search__field").value = "";
});

// Control Single Recipe
["hashchange", "load"].forEach((ev) =>
  window.addEventListener(ev, function () {
    const id = window.location.hash.slice(1);
    const loadRecipe = async function () {
      if (!id) return;
      await model.showRecipe(id);

      // Update `bookmarked` status on the fetched recipe
      model.state.recipe.bookmarked = model.isBookMarked(
        model.state.recipe.recipeId
      );
      recipeDetail(model.state.recipe);
    };
    loadRecipe();
  })
);

// Control Bookmarks
document.querySelector(".recipe").addEventListener("click", function (e) {
  const bookmarkBtn = e.target.closest(".btn--bookmark");

  if (!bookmarkBtn) return;

  if (!model.state.recipe.bookmarked) {
    //saying if bookmark is = false
    // Add Bookmark
    model.addBookmark(model.state.recipe); // push recipe to bookmark arr
  } else {
    // //saying if bookmark is = true
    model.removeBookmark(model.state.recipe); // insert recipe into removeBookmark
  }

  // reRender Bookmark
  recipeDetail(model.state.recipe);

  bookmarkView(model.state.bookmark);
});

// Control Upload Recipe
// document
//   .querySelector(".upload__form")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();
//     console.log("Uploading...");

//     const title = document.querySelector(".UploadTitle");
//     const sourceUrl = document.querySelector(".sourceUrl");
//     const imageurl = document.querySelector(".imageurl");
//     const publisher = document.querySelector(".publisher");
//     const cookingTime = document.querySelector(".cookingTime");
//     const servings = document.querySelector(".servings");
//     const ingredient1 = document.querySelector(".ingredient1");
//     const ingredient2 = document.querySelector(".ingredient2");
//     const ingredient3 = document.querySelector(".ingredient3");
//     const ingredient4 = document.querySelector(".ingredient4");
//     const ingredient5 = document.querySelector(".ingredient5");
//     const ingredient6 = document.querySelector(".ingredient6");

//     const uploadRecipeArr = [
//       title.value,
//       imageurl.value,
//       sourceUrl.value,
//       publisher.value,
//       cookingTime.value,
//       servings.value,
//       ingredient1.value,
//       ingredient2.value,
//       ingredient3.value,
//       ingredient4.value,
//       ingredient5.value,
//       ingredient6.value,
//     ];

//     model.uploadRecipe(uploadRecipeArr);

//     title.value = "";
//     imageurl.value = "";
//     sourceUrl.value = "";
//     publisher.value = "";
//     cookingTime.value = "";
//     servings.value = "";
//     ingredient1.value = "";
//     ingredient2.value = "";
//     ingredient3.value = "";
//     ingredient4.value = "";
//     ingredient5.value = "";
//     ingredient6.value = "";
//   });

const formUpload = document.querySelector(".upload__form");

formUpload.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dataArr = [...new FormData(formUpload)];
  const data = Object.fromEntries(dataArr);
  console.log(dataArr);
  try {
    await model.uploadRecipe(data);

    recipeDetail(model.state.recipe);

    window.history.pushState(null, "", `#${model.state.recipe.recipeId}`);

    formUpload.reset();
  } catch (err) {
    console.log(`💥${err}`);
    console.log("Uploading Error happened here");
  }
});