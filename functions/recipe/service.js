const Recipe = require("../../common/recipe-model");
const db = require("../../common/db/mongo");
const createError = require("http-errors");
module.exports.createRecipe = async (data) => {
  const { name, ingredients, steps, portions, cookingTime } = data;
  if (!name || !ingredients || !steps || !portions || !cookingTime) {
    throw createError(400, "missing required params");
  }

  await db.init();
  const alreadyExists = await Recipe.findOne({ name: name });
  if (alreadyExists !== null) {
    throw createError(400, "Recipe already exists");
  }
  const recipe = new Recipe({
    name: name,
    ingredients: ingredients,
    steps: parseSteps(steps),
    portions: portions,
    cookingTime: cookingTime,
  });
  await recipe.save();
  await db.disconnect();
};
// const parseIngredients = (ingredients) => {
//   return ingredients.map((item, index) => {
//     return {
//       index: index,
//       name: item.name,
//       quantity: item.quantity,
//       unit: item.unit,
//     };
//   });
// };
const parseSteps = (steps) => {
  return steps.map((item, index) => {
    return {
      step: index,
      description: item,
    };
  });
};
/**
 *TODO: each update needs to be separate so front can pass me
 * old and new names for the elements.
 *
 */
module.exports.updateRecipe = async (data) => {
  const { name, ingredients, steps, portions, cookingTime } = data;
  if (!name) {
    throw createError(400, "missing required params");
  }
  await db.init();

  const recipe = await Recipe.findOne({ name: name });
  if (!recipe) {
    throw createError(404, "Recipe does not exist");
  }
};
module.exports.updateIngredients = async (data) => {
  const {recipeName, ingredients} = data
  /**
   * ingredients: [
   *  {
   *    oldName: string,
   *    newName: string,
   *    quantity: number,
   *    unit: string
   *  }
   * ]
   */
  if (!recipeName) {
    throw createError(400, "Missing required params")
  }
  if (!Array.isArray(ingredients)) {
    throw createError(400, "Missing required params")
  }
  await db.init()
  const recipe = await Recipe.findOne({name: recipeName})
  if (!recipe) {
    throw createError(404, "Recipe does not exist")
  }

};

const updateIngredients = (oldIngredients, newIngredients) => {
  const updatedIngredients = oldIngredients;

  for (let i = 0; i < updatedIngredients.length; i++) {
    const oldIngredient = updatedIngredients[i];
    const alreadyExistsNewIng = newIngredients.find(
      (item) =>
        item.name === oldIngredient.name ||
        oldIngredient.name.includes(item.name)
    );
    if (alreadyExistsNewIng) {
      updatedIngredients[i] = {
        name:
          alreadyExistsNewIng.name !== oldIngredient.name
            ? newIngredient.name
            : alreadyExists.name,
        quantity:
          newIngredient.quantity !== alreadyExists.quantity
            ? newIngredient.quantity
            : alreadyExists.quantity,
        unit:
          newIngredient.unit !== alreadyExists.unit
            ? newIngredient.unit
            : alreadyExists.unit,
      };
    }
    if (!alreadyExists) {
      updatedIngredients.push(newIngredient);
    }
  }

  return updatedIngredients;
};
