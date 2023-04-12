import React from 'react';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';
import { useState, useEffect } from 'react';
import style from './Styles.module.css';
import TodoContainer from './TodoContainer';

const TODO_LIST_ITEM_ENDPOINT = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/TodoListItem`;
// const createTodoListItem = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/TodoListItem`;

const OPTIONS = {
    headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        "Content-Type": 'application/json'
    }
}

function TodoApp() {
    const [allTodoItems, setAllTodoItems] = useState([])
    const [todoList, setTodoList] = useState([])
    const [activeTodo, setActiveTodo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch(TODO_LIST_ITEM_ENDPOINT, {...OPTIONS, method: 'GET'})
            .then((response) => response.json())
            .then((result) => {
                setAllTodoItems(result.records)
                setIsLoading(false)
            })
            .catch((error) => console.warn(error));
    }, []);

    useEffect(() => {
        if (!activeTodo) return
        const todoItemsFilteredByTodoId = allTodoItems.filter(it => it.fields.todoListId.includes(activeTodo.id))
        setTodoList(todoItemsFilteredByTodoId)
    }, [activeTodo, allTodoItems])

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
    }

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