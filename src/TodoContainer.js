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

const TODO_LIST_ITEM_ENDPOINT = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Default`

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

    /* Fetch all todoItems from AirTable */
    useEffect(() => {
        setLoading(true)
        fetch(TODO_LIST_ITEM_ENDPOINT, { ...OPTIONS, method: 'GET' })
            .then((response) => response.json())
            .then((result) => {
                setTodoItems(result.records)
            })
            .catch((error) => console.warn(error))
            .finally(() => setLoading(false))
    }, [])

    /** Build todos */
    useEffect(() => {
        const uniqueTodos = new Set()
        todoItems.map(it => uniqueTodos.add(it.fields.todo))
        setTodos([...uniqueTodos])
    }, [todoItems])

    /* Sort filteredTodoItems */
    useEffect(() => {
        if (loading) return;
        if (!selectedTodo) {
            setFilteredTodoItems([]);
        }
        const filtered = todoItems.filter(it => it.fields.todo === selectedTodo)
        let sortedFilteredTodoItems = []
        if (ascending) {
            sortedFilteredTodoItems = filtered.sort((a, b) => {
                if (a.fields.title < b.fields.title) return 1
                else if (a.fields.title === b.fields.title) return 0
                else return -1
            })
            setFilteredTodoItems(sortedFilteredTodoItems);
        } else {
            sortedFilteredTodoItems = filtered.sort((a, b) => {
                if (a.fields.title < b.fields.title) return -1
                else if (a.fields.title === b.fields.title) return 0
                else return 1
            })
            setFilteredTodoItems(sortedFilteredTodoItems);
        }
    }, [selectedTodo, ascending, todoItems])

    const addTodoItem = (newTodoItemTitle) => {
        if (!selectedTodo) return;
        setLoading(true)
        fetch(TODO_LIST_ITEM_ENDPOINT, {
            ...OPTIONS, method: 'POST', body: JSON.stringify({
                records: [{ 
                    fields: { 
                        title: newTodoItemTitle,
                        todo: selectedTodo
                    }
                }]
            })
        })
            .then((response) => response.json())
            .then((result) => {
                setTodoItems([...todoItems, result.records[0]])
            })
            .catch((error) => console.warn(error))
            .finally(() => setLoading(false))
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
            .catch((error) => console.warn(error))
            .finally(() => setLoading(false))
    }

    const toggleDone = (todoItem, event) => {
        setLoading(true)
        fetch(`${TODO_LIST_ITEM_ENDPOINT}/${todoItem.id}`,{ 
            ...OPTIONS,
            method: 'PATCH',
            body: JSON.stringify({
                fields: { done: !todoItem.fields.done } 
            })
        })
            .then((response) => response.json())
            .then(() => {
                todoItems.forEach(item => {
                    if (item.id === todoItem.id) todoItem.fields.done = !todoItem.fields.done
                })
            })
            .catch((error) => console.warn(error))
            .finally(() => setLoading(false))
    }

    const changeSelectedTodo = (todo) => {
        if (!todo) {
            setSelectedTodo(null)
        } else {
            setSelectedTodo(todo)
        }
    }

    const createNewTodo = () => {
        setNewTodoMode(true);        
    }

    const addNewTodo = (newTodoName) => {
        if (newTodoName) {
            setSelectedTodo(newTodoName)
            setTodos([...todos, newTodoName])
        }
        setNewTodoMode(false)
    }

    const removeTodo = async () => {
        if (!selectedTodo) return;
        setLoading(true)
        try {
            const promises = filteredTodoItems.map(item =>
                fetch(`${TODO_LIST_ITEM_ENDPOINT}/${item.id}`, { ...OPTIONS, method: 'DELETE' }))
            const responses = await Promise.all(promises);
            const deletedItems = await Promise.all(responses.map((response) => response.json()));
            const deletedIds = deletedItems.map(it => it.id)
            const updatedTodoItems = todoItems.filter(it => !deletedIds.includes(it.id))
            setTodoItems(updatedTodoItems)
            setSelectedTodo(null)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    const handleSortToggle = (asc) => {
        setAscending(asc)
    }

    return (
        <div className={style.app}>
            {newTodoMode && <AddTodoForm onAddTodo={addNewTodo}></AddTodoForm>}
            {!newTodoMode && <div className={style.create}>Please create or <span>select Todo List</span></div>}
            {!newTodoMode && 
                <div className={style.todoTitle}>
                    <DropDown 
                        newItemText="+ Create New Todo"
                        placeholderText="Select todo"
                        items={
                            todos.map(it => ({ 
                                text: it,
                                isSelected: selectedTodo ? it === selectedTodo : false 
                            }))
                        }
                        onSelectItem={changeSelectedTodo}
                        onSelectNewItem={createNewTodo} />
                    {selectedTodo && <FontAwesomeIcon icon={faRectangleXmark} className={style.addButton} onClick={(e) => { removeTodo(e) }} />}
                </div>
            }
            {!newTodoMode && selectedTodo && 
                <AddTodoItemForm onAddTodoItem={addTodoItem}></AddTodoItemForm>
            }
            {!newTodoMode && filteredTodoItems.length > 0 && 
                <SortButton checked={ascending} onChange={handleSortToggle}></SortButton>
            }
            {!newTodoMode && !loading &&
                <TodoList 
                    className={style.list}
                    todoList={filteredTodoItems}
                    onToggle={toggleDone}
                    onRemoveTodoItem={removeTodoItem}
                />
            }
            {loading && <span id="wip">Work in progress...</span>}
            <a href='copyright' className={style.copyright}>&copy;Copyright</a>
        </div>
    );
}

export default TodoContainer;