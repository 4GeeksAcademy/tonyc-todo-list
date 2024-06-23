import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [username, setUsername] = useState(""); 
  const [taskInput, setTaskInput] = useState(""); 
  const [todos, setTodos] = useState([]);

 
  const fetchTodos = (user) => {
    fetch(`https://playground.4geeks.com/todo/users/${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
        
          return fetch(`https://playground.4geeks.com/todo/users/${user}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify([])
          }).then(postResp => {
            if (postResp.ok) {
              console.log("Usuario creado exitosamente");
              return { todos: [] };
            } else {
              throw new Error("Error creando el usuario");
            }
          });
        }
      })
      .then(data => {
        if (data.todos) {
          setTodos(data.todos);
          localStorage.setItem('username', user); 
        } else {
          setTodos([]);
        }
      })
      .catch(error => {
        console.error("Error manejando el usuario:", error);
      });
  };

 
  const addTodo = (e) => {
    if (e.key === "Enter" && taskInput.trim() !== "") {
      fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ label: taskInput, done: false })
      })
        .then(resp => resp.json())
        .then(newTodo => {
          setTodos([...todos, newTodo]);
          setTaskInput("");
        })
        .catch(error => {
          console.error("Error añadiendo la tarea:", error);
        });
    }
  };

 
  const deleteTodo = (todoId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(resp => {
        if (resp.ok) {
          setTodos(todos.filter(todo => todo.id !== todoId));
        } else {
          console.error("Error eliminando la tarea:", resp.statusText);
        }
      })
      .catch(error => {
        console.error("Error eliminando la tarea:", error);
      });
  };


  const editTodo = (todoId, newLabel) => {
    fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ label: newLabel })
    })
      .then(resp => resp.json())
      .then(updatedTodo => {
        const updatedTodos = todos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => {
        console.error("Error editando la tarea:", error);
      });
  };

  
  const startEditing = (todoId, currentLabel) => {
    const newLabel = prompt("Editar tarea:", currentLabel);
    if (newLabel !== null) {
      editTodo(todoId, newLabel);
    }
  };


  const handleUserSubmit = () => {
    if (username.trim() === "") {
      console.error("El nombre de usuario no puede estar vacío");
      return;
    }
    fetchTodos(username);
  };


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      fetchTodos(storedUsername);
    }
  }, []); 

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>
      <button onClick={handleUserSubmit}>Ingresar Usuario</button>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        placeholder="Ingresa tu nombre de usuario"
        className="username-input"
      />
      {username && (
        <>
          <input
            type="text"
            onChange={(e) => setTaskInput(e.target.value)}
            value={taskInput}
            onKeyDown={addTodo}
            placeholder="Añadir tareas"
            className="task-input"
          />
          <ul>
            {todos.map((item) => (
              <li key={item.id} className="todo-item">
                <span>{item.label}</span>
                <div className="icon-group">
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => startEditing(item.id, item.label)}
                    style={{ color: "blue", cursor: "pointer" }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteTodo(item.id)}
                    style={{ color: "red", cursor: "pointer", marginLeft: "10px" }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div>{todos.length} tarea{todos.length !== 1 ? 's' : ''}</div>
        </>
      )}
    </div>
  );
}

export default App;


