import React from 'react';
import { useEffect, useRef } from 'react';

const InputWithLabel = function({children, handleTitleChange,todoTitle}) {
const inputRef = useRef(null)
useEffect(() => {
    inputRef.current.focus()
})

return (
        <>
            <label htmlFor="todoTitle">{children}</label>
            <input 
                id="todoTitle"
                name="title"
                ref= {inputRef}
                value={todoTitle}
                onChange={handleTitleChange} />
        </>
    )
};

export default InputWithLabel;