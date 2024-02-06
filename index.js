const Recipe = require("./common/recipe-model");
const db = require("./common/db/mongo");
// const recipes = require("./common/recipe-model");

const saveRecipe = async () => {
  const recipe = new Recipe({
    name: "Salt water",
    ingredients: [
      {
        name: "salt",
        quantity: 10,
        unit: "grams",
      },
      {
        name: "water",
        quantity: 500,
        unit: "ml",
      },
    ],
    steps: ["add salt to water", "mix until salt is dissolved"],
    portions: 1,
    cookingTime: {
      time: 1,
      unit: "min",
    },
  });
  await db.init();
  await recipe.save();
  await db.disconnect();
  console.log("created");
}
const getRecipe = async (name) => {
  await db.init()
  const recipe = await Recipe.findOne({name: name})
  console.log(recipe)
  await db.disconnect()
  return recipe
}
const main = async () => {
  const response =  await getRecipe("Salt water")
  console.log(response)
};
main();