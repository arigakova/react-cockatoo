import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import style from './Styles.module.css';

const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/TodoList`;
const options = {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        "Content-Type": 'application/json'
    }
}

function TodoContainer({onSelectTodo}) {
    const [todos, setTodos] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch(url, options)
            .then((response) => response.json())
            .then((result) => {
                setTodos(result.records)
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }, []);

    // useEffect(() => {
    //     if (!isLoading) {
    //         onSelectTodo(todos[0])
    //     }
    // }, [isLoading, todos])

    return (
        <>
            {
                isLoading ||
                (
                    <ul>
                        {
                            todos.map(todo => (
                                <li key={todo.id} onClick={() => onSelectTodo(todo)}>
                                    {todo.fields["name"]}
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </>
    );
}

TodoContainer.propTypes = {
    onSelectTodo: PropTypes.func,
    todos: PropTypes.array,
  };

export default TodoContainer;