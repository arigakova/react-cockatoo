import React from 'react';
import { useState } from 'react';
import InputWithLabel from './InputWithLabel';
import style from './Styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from  "prop-types";
function AddTodoForm({onAddTodoItem}) {

    const [todoTitle, setTodoTitle] = useState("");

    const handleTitleChange = (event) => {
        var newTodoTitle = event.target.value;
        setTodoTitle(newTodoTitle);
    }
    
    const handleAddTodo = (event) => {
        event.preventDefault()
        if (!todoTitle.trim()) return
        onAddTodoItem(todoTitle)
        setTodoTitle("");
    }

    return (
        <div>
            <form onSubmit={handleAddTodo} className={style.todoTitle}>
                <InputWithLabel todoTitle={todoTitle} handleTitleChange={handleTitleChange}>Title</InputWithLabel>
                <FontAwesomeIcon icon={faSquarePlus} className={style.addButton} onClick={(e)=>{handleAddTodo(e)}} />
            </form>
        </div>
    );
}

AddTodoForm.propTypes = {
    onAddTodoItem: PropTypes.func,
};

export default AddTodoForm;