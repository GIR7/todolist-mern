import { useState, useEffect } from "react";
const url = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popup, setPopup] = useState(false);
  const [newtodo, setNewtodo] = useState("");

  useEffect(() => {
    get_todos();
    console.log(todos);
  }, []);
  const get_todos = () => {
    fetch(url + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((e) => console.error("Error : ", e));
  };

  const completeTodo = async (id) => {
    const data = await fetch(url + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch(url + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(url + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newtodo,
      }),
    }).then((res) => res.json());
    // console.log(data);
    setTodos([...todos, data]); //Add data(new) to todo list
    setPopup(false); //hide popup once we added it
    setNewtodo("");
  };

  return (
    <div className="App">
      <h1>Welcome, Yihui</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={"todo " + (todo.complete ? "is-complete" : "")}
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>
              <div className="text">{todo.text}</div>
              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                X
              </div>
            </div>
          ))
        ) : (
          <p>You currently have no tasks! Add a new task on the right side!</p>
        )}
      </div>
      <div className="addPopup" onClick={() => setPopup(true)}>
        + New
      </div>
      {popup ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopup(false)}>
            X
          </div>

          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-input"
              onChange={(i) => setNewtodo(i.target.value)}
              value={newtodo}
            />
            <div className="create-button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
