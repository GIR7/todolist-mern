require("dotenv").config();
const connection_str = process.env.CONN_STR;
const { default: mongoose } = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(connection_str, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((e) => console.error("MongoDB connection failed: ", e.message));

//mongoDB obj : "Todo"
const Todo = require("./models/tododb");

//when we make req to route, grap todo data & pass back
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

//creat new entry in db
app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text, //pass text into db
  });
  todo.save();
  res.json(todo); //pass back to us, add it to "todos" list
});

//delete entry by its id in db
app.delete("/todo/delete/:unique_id", async (req, res) => {
  const result = await Todo.findByIdAndDelete(req.params.unique_id); //mongodb built in func
  res.json(result);
});

//change the completion stutas
app.get("/todo/complete/:unique_id", async (req, res) => {
  const todo = await Todo.findById(req.params.unique_id);
  todo.complete = !todo.complete;
  todo.save();
  res.json(todo);
});

app.listen(3001, () => console.log("server started on port: 3001 "));
