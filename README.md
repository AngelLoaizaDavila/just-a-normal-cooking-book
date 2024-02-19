
# Just a normal cooking book

This is a prof of concept about a personal project that I want to 
continue working.

This REST API has been made using just Node.js and his packages, no framework means it's basic but functional.


I'm giving up the frontend part for this version, I just can't be bothered to do it.
## Documentation

Read the code, it is pretty simple 


## Installation

Install this project with npm

```bash
  npm install
```
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/AngelLoaizaDavila/just-a-normal-cooking-book.git
```

Install dependencies

```bash
  npm install
```

Start the server on port 8000/8080

```bash
  npm run dev
```


## Tech Stack

**Server:** Node.js, 
**Database:** MongoDB-Mongoose


## Endpoints
Post

- **POST /recipes**
    - body: name, ingredients, steps, portions, cookingTime
    - body example: 
    ```bash 
        {
            "name": "Salt water 12",
            "ingredients": [
                {
                    "name": "salt",
                    "quantity": 10,
                    "unit": "grams"
                },
                {
                    "name": "water",
                    "quantity": 500,
                    "unit": "ml"
                }
            ],
            "steps": 
                [
                    "add salt to water", 
                    "mix until salt is dissolved"
                ],
            "portions": 1,
            "cookingTime": {
                "time": 1,
                "unit": "min"
            }
        }
    ```

Get
- Find all recipes (paginated) -> **GET /recipes**
- Search an specific recipe -> **GET /recipes?recipeName=XXXXXX**

Delete

- **DELETE /recipes**
    - body: recipeName

Put

- **PUT /recipes**
    - body: name, ingredients, steps, portions, cookingTime