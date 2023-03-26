// Declare Variables
const mealForm = document.getElementById('submit');
const reasultHeading = document.getElementById('result-heading');
const searchMealButton = mealForm.getElementsByClassName('search-btn');
const mealsEl = document.getElementById('meals');
const singleMeal = document.getElementById('single-meal');
const randomBtn = document.getElementById('random');

// Getting input from search input and make it valid
function gettingInput(event) {
  event.preventDefault();

  const mealName = mealForm.firstElementChild;
  let search = mealName.value;

  if (!search || search.trim() === '') {
    alert('Please Enter Meal');
  }
  if (search.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        reasultHeading.innerHTML = `<h2> Search result for '${search}'</h2>`;
        if (data.meals === null) {
          reasultHeading.innerHTML = `<h2>No Search result found for '${search}'</h2>`;
        } else {
          console.log(data.meals);
          mealsEl.innerHTML = data.meals
            .map((meal) => {
              return `<div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info" data-mealid="${meal.idMeal}">
                  <h3>${meal.strMeal}</h3>
                </div>
              </div>`;
            })
            .join('');
        }
      });
  }
  // Clear Search
  mealName.value = '';
}

// Fetch meal by Id

function getMealById(meal) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// Get Random Meal

function getRanomMeal() {
  mealsEl.innerHTML = '';
  reasultHeading.innerHTML = '';

  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      addMealToDom(meal);
    });
}

// Add meal to Dom

function addMealToDom(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMeal.innerHTML = `
  <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="single-meal-info">
      ${meal.strCaregory ? `<p>${meal.strCaregory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
      ${ingredients.map((ing) => `<li>${ing}</li>`).join()}
      </ul>
      </div>
  </div>
  `;
}

// Event listener
searchMealButton[0].addEventListener('click', gettingInput);
randomBtn.addEventListener('click', getRanomMeal);
mealsEl.addEventListener('click', (e) => {
  // const path = e.composedPath()
  const mealInfo = e.composedPath().find((item) => {
    if (item.className === 'meal-info') {
      return item;
    } else {
      return;
    }
  });

  if (mealInfo) {
    const mealId = mealInfo.getAttribute('data-mealid');
    getMealById(mealId);
  }
});
