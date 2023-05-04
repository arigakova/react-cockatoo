import React from 'react';
import TodoList from './Components/TodoList';
import AddTodoForm from './Components/AddTodoForm'
import AddTodoItemForm from './Components/AddTodoItemForm';
import SortButton from './Components/Toggle';
import { useState, useEffect } from 'react';
import style from './Components/Styles.module.css';
import DropDown from './Components/DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';

const TODO_LIST_ITEM_ENDPOINT = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/TodoListItem`

const TODO_LIST_ENDPOINT = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/TodoList`;

const OPTIONS = {
    headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_AIRTABLE_API_KEY}`,
        "Content-Type": 'application/json'
    }
}

function TodoContainer() {
    const [todoItems, setTodoItems] = useState([]);
    const [filteredTodoItems, setFilteredTodoItems] = useState([]);
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [newTodoMode, setNewTodoMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ascending, setAscending] = useState(false);

    /* Fetch todos from AirTable */
    useEffect(() => {
        setLoading(true)
        fetch(TODO_LIST_ENDPOINT, { ...OPTIONS, method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                setTodos(result.records)
                setLoading(false)
            })
            .catch((error) => console.warn(error));
    }, []);

    /* Fetch all todoItems from AirTable */
    useEffect(() => {
        setLoading(true)
        fetch(TODO_LIST_ITEM_ENDPOINT, { ...OPTIONS, method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                setTodoItems(result.records)
                setLoading(false)
            })
            .catch((error) => console.warn(error));
    }, [])

    /* Sort filteredTodoItems */
    useEffect(() => {
        if (!selectedTodo || loading) return;
        const todoItemsByTodoId = todoItems.filter((it) => it && it.fields.todoListId[0] === selectedTodo.id);
        const sortedFilteredTodoItems = !ascending
            ? todoItemsByTodoId.sort((a, b) => {
                if (a.fields.title < b.fields.title) return -1
                else if (a.fields.title === b.fields.title) return 0
                else return 1
            })
            : todoItemsByTodoId.sort((a, b) => {
                if (a.fields.title < b.fields.title) return 1
                else if (a.fields.title === b.fields.title) return 0
                else return -1
            });
        setFilteredTodoItems(sortedFilteredTodoItems);
    }, [selectedTodo, todoItems, ascending])

    /* Clear filteredTodoItems when user deleted todo*/
    useEffect(() => {
        if (!selectedTodo) {
            setFilteredTodoItems([]);
        }
    }, [selectedTodo])

    const addTodoItem = (newTodoItemTitle) => {
        setLoading(true)
        fetch(TODO_LIST_ITEM_ENDPOINT, {
            ...OPTIONS, method: 'POST', body: JSON.stringify({
                records: [{ fields: { title: newTodoItemTitle, todoListId: [`${selectedTodo.id}`] } }]
            })
        })
            .then((response) => response.json())
            .then((result) => {
                setTodoItems([...todoItems, result.records[0]])
                setLoading(false)
            })
            .catch((error) => console.warn(error));
    }

    const removeTodoItem = (id) => {
        setLoading(true)
        fetch(`${TODO_LIST_ITEM_ENDPOINT}/${id}`, { ...OPTIONS, method: 'DELETE' })
            .then((response) => response.json())
            .then((result) => {
                const updatedTodoList = todoItems.filter(it => it.id !== result.id)
                setTodoItems(updatedTodoList)
                setLoading(false)
            })
            .catch((error) => console.warn(error));
    }

    const toggleDone = (todoItem, event) => {
        setLoading(true)
        fetch(`${TODO_LIST_ITEM_ENDPOINT}/${todoItem.id}`, {
            ...OPTIONS, method: 'PATCH',
            body: JSON.stringify({ fields: { done: !todoItem.fields.done } })
        })
            .then((response) => response.json())
            .then(() => {
                todoItems.forEach(item => {
                    if (item.id === todoItem.id) todoItem.fields.done = !todoItem.fields.done
                })
            })
            .catch((error) => console.warn(error))
            .finally(() => {
                setLoading(false)
            })
    }

    const changeSelectedTodoById = (todoId) => {
        if (!todoId) {
            setSelectedTodo(null)
        }
        const selectedTodo = todos.find(it => it.id === todoId)
        if (selectedTodo) {
            setSelectedTodo(selectedTodo)
        }
    }

    const showNewTodoDialog = () => {
        setNewTodoMode(true);
    }

    const addNewTodo = (newTodoName) => {
        if (newTodoName) {
            setLoading(true)
            fetch(TODO_LIST_ENDPOINT, {
                ...OPTIONS, method: 'POST',
                body: JSON.stringify({ records: [{ fields: { name: newTodoName } }] })
            })
                .then((response) => response.json())
                .then((result) => {
                    setTodos([...todos, result.records[0]])
                    setSelectedTodo(result.records[0])
                })
                .catch((error) => console.warn(error))
                .finally(() => {
                    setLoading(false)
                    setNewTodoMode(false)
                })
        } else {
            setNewTodoMode(false)
        }
    }

    const removeTodo = () => {
        if (!selectedTodo) return
        setLoading(true)
        const todoItemsFilteredByTodoId = todoItems.filter((it) => it.fields.todoListId[0] === selectedTodo.id);
        todoItemsFilteredByTodoId.forEach(item => {
            removeTodoItem(item.id)
        })
        fetch(`${TODO_LIST_ENDPOINT}/${selectedTodo.id}`, { ...OPTIONS, method: 'DELETE' })
            .then((response) => response.json())
            .then((result) => {
                setTodos(todos.filter(it => it.id !== result.id))
                setSelectedTodo(null)
            })
            .catch((error) => console.warn(error))
            .finally(() => {
                setLoading(false)
            })
    }

    const handleSortToggle = (asc) => {
        setAscending(asc)
    }

    return (
        <div className={style.app}>
            {newTodoMode && <AddTodoForm onAddTodo={addNewTodo}></AddTodoForm>}
            {!newTodoMode && <div className={style.create}>Please create or <span>select Todo List</span></div>}
            {!newTodoMode && <div className={style.todoTitle}>
                <DropDown 
                    newItemText="+ Create New Todo"
                    placeholderText="Select todo"
                    items={todos.map(it => ({ id: it.id, text: it.fields.name, isSelected: selectedTodo && it.id === selectedTodo.id }))}
                    onSelectItem={changeSelectedTodoById}
                    onSelectNewItem={showNewTodoDialog} />
                {selectedTodo && <FontAwesomeIcon icon={faRectangleXmark} className={style.addButton} onClick={(e) => { removeTodo(e) }} />}
            </div>}
            {selectedTodo && !newTodoMode && <div>
                <AddTodoItemForm onAddTodoItem={addTodoItem}></AddTodoItemForm>
            </div>}
            {filteredTodoItems.length > 0 && !newTodoMode && <SortButton checked={ascending} onChange={handleSortToggle}></SortButton>}
            {!newTodoMode && !loading &&
                <TodoList className={style.list} todoList={filteredTodoItems} onToggle={toggleDone} onRemoveTodoItem={removeTodoItem} />
            }
            {loading && <span id="wip">Work in progress...</span>}
            <a href='copyright' className={style.copyright}>&copy;Copyright</a>
        </div>
    );
}

export default TodoContainer;