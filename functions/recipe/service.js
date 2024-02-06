const Recipe = require("../../common/recipe-model");
const db = require("../../common/db/mongo");
const createError = require("http-errors");
module.exports.createRecipe = async (data) => {
  const { name, ingredients, steps, portions, cookingTime } = data;
  if (!name || !ingredients || !steps || !portions || !cookingTime) {
    throw createError(400, "missing required params");
  }

  await db.init();
  const alreadyExists = await Recipe.findOne({name: name})
  if (alreadyExists !== null) {
    throw createError(400, 'Recipe already exists')
  }
  const recipe = new Recipe({
    name: name,
    ingredients: ingredients,
    steps: steps,
    portions: portions,
    cookingTime: cookingTime,
  });
  await recipe.save();
  await db.disconnect();
};
