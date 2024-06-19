import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);

  return (
    <>
      <div className="container">
        <h1>My todos</h1>
        <ul>
          <li>
            <input
              type="text"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue} 
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (inputValue.trim() !== "") { 
                    setTodos(todos.concat(inputValue));
                    setInputValue("");
                  }
                }
              }}
              placeholder="What do you need to do?"></input>
          </li>
          {todos.map((item, index) => (
            <li key={index}>
              {item}
              <FontAwesomeIcon
                icon= {faTrash}
                onClick={() =>
                  setTodos(todos.filter((t, currentIndex) => index !== currentIndex))
                }
              />
            </li>
          ))}
        </ul>
        <div>{todos.length} task{todos.length !== 1 && 's'}</div>
      </div>
    </>
  );
}

export default App;
