import React from 'react';
import { useEffect, useRef } from 'react';
import style from './Styles.module.css';

const InputWithLabel = function({children, handleTitleChange, todoTitle}) {
    const inputRef = useRef(null)
    useEffect(() => {
        inputRef.current.focus()
    })

    return (
            <>
                <label htmlFor="todoTitle">{children}</label>
                <input 
                    type="text" placeholder="Enter your to do here"               
                    id="todoTitle"
                    name="title"
                    ref= {inputRef}
                    value={todoTitle}
                    onChange={handleTitleChange}
                    className={style.input} />
            </>
        )
};

export default InputWithLabel;