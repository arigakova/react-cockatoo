import React from 'react';
import TodoListItem from './TodoListItem';
import PropTypes from  "prop-types";

function TodoList({ todoList, onToggle, onRemoveTodoItem }) {
    return (
        <ul>
            {
                todoList.map(todo => 
                    <TodoListItem 
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onRemoveTodoItem={onRemoveTodoItem} />
                )
            }
        </ul>
    );
}
TodoList.propTypes = {
    onRemoveTodoItem: PropTypes.func,
    todoList: PropTypes.array,
}
export default TodoList;