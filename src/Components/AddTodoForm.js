import React from 'react';
import { useState } from 'react';
import InputWithLabel from './InputWithLabel';
import style from './Styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import PropTypes from  "prop-types";

function AddTodoForm({onAddTodo}) {

    const [todoName, setTodoName] = useState("");

    const handleNameChange = (event) => {
        var newTodoName = event.target.value;
        setTodoName(newTodoName);
    }
    
    const handleAddTodo = (event) => {
        event.preventDefault()
        if (!todoName.trim()) return
        onAddTodo(todoName)
        setTodoName("");
    }

    const handleCancelAddTodo = (event) => {
        event.preventDefault()
        setTodoName("");
        onAddTodo(null)
    }

    return (
        <form onSubmit={handleAddTodo} className={`${style.todoTitle} ${style.newTodoForm}`}>
            <InputWithLabel value={todoName} handleChange={handleNameChange} placeholder="Enter your new todo name here">NEW</InputWithLabel>
            <FontAwesomeIcon icon={faSquarePlus} className={style.addButton} onClick={(e)=>{handleAddTodo(e)}} />
            <FontAwesomeIcon icon={faRectangleXmark} className={style.addButton} onClick={(e)=>{handleCancelAddTodo(e)}} />
        </form>
    );
}

AddTodoForm.propTypes = {
    onAddTodo: PropTypes.func,
};

export default AddTodoForm;