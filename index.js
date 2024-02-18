const http = require("http");
const hostname = "127.0.0.1";
const recipesService = require("./functions/recipe/service");
require("dotenv").config();
const port = process.env.PORT || 8000;
const server = http.createServer((req, res) => {
  const url = req.url;
  const createdUrl = new URL(url, `http://${hostname}:${port}`);
  const method = req.method;
  const hasRecipeNameParam = createdUrl.searchParams.has("recipeName");
  if (
    createdUrl.pathname === "/recipes" &&
    method === "GET" &&
    !hasRecipeNameParam
  ) {
    if (createdUrl.searchParams) {
      console.log("has params");
    }
    console.log(req.method);
    recipesService
      .findRecipes({
        limit: createdUrl.searchParams.get("limit") || 20,
        offset: createdUrl.searchParams.get("offset") || 0,
      })
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      })
      .catch((err) => {
        console.log(err);
        res.writeHead(400);
        res.end();
      });
  }
  if (
    createdUrl.pathname === "/recipes" &&
    method === "GET" &&
    hasRecipeNameParam
  ) {
    if (createdUrl.searchParams) {
      console.log("has params");
    }
    console.log(req.method);
    recipesService
      .searchRecipe({
        name: createdUrl.searchParams.get("recipeName"),
      })
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      })
      .catch((err) => {
        console.log(err);
        res.writeHead(400);
        res.end();
      });
  }
  if (url === "/recipes" && method === "POST") {
    console.log(req.headers);
    let data = "";
    // let recipe1 = null;
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      const parsedData = JSON.parse(data);
      await recipesService
        .createRecipe(parsedData)
        .then((data) => {
          res.writeHead(200, "Content-Type: application/json");
          res.write(JSON.stringify(data, null, 2));
          res.end();
        })
        .catch((err) => {
          res.writeHead(400, "Content-Type: application/json");
          res.write(err.toString());
          res.end();
        });
    });
    res.emit("end");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

