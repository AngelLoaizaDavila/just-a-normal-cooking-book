const http = require("http");
const hostname = "127.0.0.1";
const recipesService = require("./functions/recipe/service");
require("dotenv").config();
const port = process.env.PORT || 8000;
const server = http.createServer((req, res) => {
  const url = req.url;
  const parsedUrl = new URL(url, `http://${hostname}:${port}`);
  const method = req.method;
  const hasRecipeNameParam = parsedUrl.searchParams.has("recipeName");
  if (
    parsedUrl.pathname === "/recipes" &&
    method === "GET" &&
    !hasRecipeNameParam
  ) {
    
    recipesService
      .findRecipes({
        limit: parsedUrl.searchParams.get("limit") || 20,
        offset: parsedUrl.searchParams.get("offset") || 0,
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
    parsedUrl.pathname === "/recipes" &&
    method === "GET" &&
    hasRecipeNameParam
  ) {
    recipesService
      .searchRecipe({
        name: parsedUrl.searchParams.get("recipeName"),
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
    parsedUrl.pathname === "/recipes" &&
    method === "DELETE" &&
    hasRecipeNameParam
  ) {
    recipesService
      .deleteRecipe({
        name: parsedUrl.searchParams.get("recipeName"),
      })
      .then((data) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        console.log(err);
        res.writeHead(400);
        res.end();
      });
  }
  if (parsedUrl.pathname === "/recipes" && method === "POST") {
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
  if (parsedUrl.pathname === "/recipes" && method === "PUT") {
    let data = "";
    // let recipe1 = null;
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      const parsedData = JSON.parse(data);
      await recipesService
        .updateRecipe(parsedData)
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

/**
 * With this, the backend is finished, I'm giving up on the frontend for the time being
 * All petitions are handled with this little tiny router, It is not the best or the fanciest 
 * but it works, at least for now.
 * 
 * 
 * All this REST API was made using just the basic packages that node.js offers, so it's simple
 * and easy to replicate.
 */
