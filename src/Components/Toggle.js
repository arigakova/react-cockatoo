import React, { useEffect, useState } from 'react';
import style from './Styles.module.css';
import PropTypes from  "prop-types";

function Toggle({ checked, onChange }) {
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        setIsChecked(checked)
    }, [])

    const handleClick = () => {
        setIsChecked(!isChecked);
        onChange(!isChecked)
    }

    return (
        <div className={style.toggleposition}>
            <input
                className={style.toggle}
                id="switch"
                type="checkbox"
                checked={isChecked}
                onChange={handleClick}
            />
            <label htmlFor="switch" className={style.turn}>{!isChecked?"Sort by A-Z" : "Sort by Z-A"}</label>
        </div>
    );
}

Toggle.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
}

export default Toggle;
