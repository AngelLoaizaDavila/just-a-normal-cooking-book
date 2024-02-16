const http = require("http");
const hostname = "127.0.0.1";
const recipesService = require("./functions/recipe/service");
require("dotenv").config();
const port = process.env.PORT || 8000;
const server = http.createServer((req, res) => {
  const url = req.url;
  const createdUrl = new URL(url, `http://${hostname}:${port}`);
  console.log(createdUrl);
  const method = req.method;
  // const searchParams = new URLSearchParams(url)
  // console.log(window.location.search)
  // console.log(searchParams)
  if (createdUrl.pathname === "/recipes" && method === "GET") {
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
  if (url === "/recipes" && method === "POST") {
    console.log(req.headers);
    let data = "";
    // let recipe1 = null;
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", async () => {
      const parsedData = JSON.parse(data);
      await recipesService.createRecipe(parsedData).then((data) => {
        res.writeHead(200, 'Content-Type: application/json')
        res.write(JSON.stringify(data, null, 2))
        res.end()
      }).catch((err) => {
        res.writeHead(400, 'Content-Type: application/json')
        res.write(err.toString())
        res.end()
      });
    })
    res.emit('end')
    // res.writeHead(200);
    // res.end(recipe1);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// http.get(`http://${hostname}:${port}`, (res) => {
//   console.log('status', res.statusCode)
//   console.log('Headers:')
//   console.log(res.headers)
//   console.log('Body:')
//   let data = '';
//   res.on('data', (chunk) => {
//     data += chunk
//   })
//   res.on('close', () => {
//     console.log(data)
//   })
// })
