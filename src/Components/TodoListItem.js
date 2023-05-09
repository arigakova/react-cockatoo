import React from 'react';
import style from './Styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';
import PropTypes from  "prop-types";

function TodoListItem({todo, onToggle, onRemoveTodoItem}) {
    return (     
        <li className={style.listItem}>
            {todo.fields.done}
            <input type="checkbox" className={style.checkbox} checked={!!todo.fields.done} onChange={(e) => onToggle(todo, e)}></input>
            <span className={style.todoText}>{todo.fields.title}</span>
            <FontAwesomeIcon icon={faTrash} className={style.removeButton} onClick={(e) => onRemoveTodoItem(todo.id,e)} data-tooltip-content="Remove" data-tooltip-id="registerTip"/>
            <Tooltip id="registerTip"/>
        </li>
    );
}

TodoListItem.propTypes = {
    id: PropTypes.string,
    onRemoveTodoItem: PropTypes.func,
    title: PropTypes.string,
};

export default TodoListItem;