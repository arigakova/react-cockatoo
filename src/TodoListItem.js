import React from 'react';
import style from './Styles.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'react-tooltip';


function TodoListItem({todo, onToggle, onRemoveTodoItem}) {
    return (     
        <li className={style.listItem}>
            {todo.fields.done}
            <input type="checkbox" checked={!!todo.fields.done} onChange={(e) => onToggle(todo, e)}></input>
            <span className={style.todoText}>{todo.fields.title}</span>
            <FontAwesomeIcon icon={faTrash} className={style.removeButton} onClick={(e) => onRemoveTodoItem(todo.id,e)} data-tooltip-content="Remove" data-tooltip-id="registerTip"/>
            <Tooltip id="registerTip"/>
        </li>
    );
}

export default TodoListItem;