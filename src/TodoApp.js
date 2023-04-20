import React from 'react';
import TodoList from './Components/TodoList';
import AddTodoForm from './Components/AddTodoForm';
import { useState, useEffect } from 'react';
import style from './Components/Styles.module.css';
import TodoContainer from './Components/TodoContainer';

const TODO_LIST_ITEM_ENDPOINT =
    `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/TodoListItem?view=Grid%20view`;
//&sort[0][field]=title&sort[0][direction]=desc;


const OPTIONS = {
    headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        "Content-Type": 'application/json'
    }
}

function TodoApp() {
    const [allTodoItems, setAllTodoItems] = useState([]);
    const [todoList, setTodoList] = useState([]);
    const [activeTodo, setActiveTodo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ascending, setAscending] = useState(false);

    useEffect(() => {
        fetch(TODO_LIST_ITEM_ENDPOINT, { ...OPTIONS, method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                setAllTodoItems(result.records)
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }, []);

    useEffect(() => {
        if (!activeTodo) return;
        const todoItemsFilteredByTodoId = allTodoItems.filter((it) => it.fields.todoListId.includes(activeTodo.id));
        
        console.log("todoItemsFilteredByTodoId: " + JSON.stringify(todoItemsFilteredByTodoId))

        const sortedTodoItems = ascending
            ? todoItemsFilteredByTodoId.sort((a, b) => {
                console.log("a: " + JSON.stringify(a))
                console.log("b: " + JSON.stringify(b))
                if (a.fields.title < b.fields.title) return -1
                else if (a.fields.title === b.fields.title) return 0
                else return 1
            })
            : todoItemsFilteredByTodoId.sort((a, b) => {
                console.log("a: " + JSON.stringify(a))
                console.log("b: " + JSON.stringify(b))
                if (a.fields.title < b.fields.title) return 1
                else if (a.fields.title === b.fields.title) return 0
                else return -1
            });

        console.log("sortedTodoItems: " + JSON.stringify(sortedTodoItems))
        setTodoList(sortedTodoItems);
    }, [activeTodo, allTodoItems, ascending]);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("savedTodoList", JSON.stringify(allTodoItems))
        }
    }, [allTodoItems, isLoading]);

    const addTodoItem = (newTodoItemTitle) => {
        setIsLoading(true)
        fetch(TODO_LIST_ITEM_ENDPOINT, {
            ...OPTIONS,
            method: 'POST',
            body: JSON.stringify({
                records: [{
                    fields: {
                        title: newTodoItemTitle,
                        todoListId: [`${activeTodo.id}`]
                    }
                }]
            })
        })
            .then((response) => response.json())
            .then((result) => {
                console.log("result.records[0]: " + JSON.stringify(result.records[0]))
                setAllTodoItems([...allTodoItems, result.records[0]])
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    };

    const handleSortChange = () => {
        setAscending(!ascending);
    };


    const removeTodoItem = (id) => {
        setIsLoading(true)
        fetch(`${TODO_LIST_ITEM_ENDPOINT}/${id}`, {
            ...OPTIONS,
            method: 'DELETE'
        })
            .then((response) => response.json())
            .then((result) => {
                const newAllTodoList = allTodoItems.filter(it => it.id !== result.id)
                setAllTodoItems(newAllTodoList)
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }

    const toggleTodoItem = (todoItem, event) => {
        setIsLoading(true)
        const toggledTodoItem = { ...todoItem }
        if (event.target.checked) {
            toggledTodoItem.fields.done = true
        } else {
            toggledTodoItem.fields.done = false
        }
        fetch(`${TODO_LIST_ITEM_ENDPOINT}/${todoItem.id}`, {
            ...OPTIONS,
            method: 'PATCH',
            body: JSON.stringify({
                fields: toggledTodoItem.fields
            })
        })
            .then((response) => response.json())
            .then((result) => {
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }

    const onSelectTodo = (todo) => {
        setActiveTodo(todo)
    }

    return (
        <div className={style.app}>
            <div id="header">Todo list {!activeTodo ? "" : activeTodo.fields.name}</div>
            <button onClick={handleSortChange}>Toggle Sort Order</button>
            <TodoContainer onSelectTodo={onSelectTodo}></TodoContainer>
            {
                !activeTodo ? "Please create or select Todo List" : <AddTodoForm onAddTodoItem={addTodoItem} />
            }
            {
                isLoading ? <p>"Work in progress..."</p> :
                    <TodoList className={style.list} todoList={todoList} onToggle={toggleTodoItem} onRemoveTodoItem={removeTodoItem} />
            }
        </div>
    );
}

export default TodoApp;