import React from 'react';
import TodoListItem from './TodoListItem';

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

export default TodoList;