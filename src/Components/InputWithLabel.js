import React from 'react';
import { useEffect, useRef } from 'react';
import style from './Styles.module.css';
import PropTypes from  "prop-types";

const InputWithLabel = function({children, handleChange, value, placeholder}) {
    const inputRef = useRef(null)
    
    useEffect(() => {
        inputRef.current.focus()
    })

    return (
            <>
                <label htmlFor="input">{children}</label>
                <input 
                    type="text" placeholder={placeholder}
                    id="input"
                    name="title"
                    ref= {inputRef}
                    value={value}
                    onChange={handleChange}
                    className={style.input} />
            </>
        )
};

InputWithLabel.propTypes =  {
    children: PropTypes.node.isRequired,
};

export default InputWithLabel;