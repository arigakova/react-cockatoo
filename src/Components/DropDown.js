import React, { useState, useEffect } from "react";
import style from './Styles.module.css';
import PropTypes from  "prop-types";

function DropDown({newItemText, placeholderText, items, onSelectItem, onSelectNewItem}) {
    const [selectedItem, setSelectedItem] = useState('');

    useEffect(() => {
        const activeItem = items.find(it => it.isSelected)
        if (activeItem) {
            setSelectedItem(activeItem.text)
        } else {
            var selectElement = document.getElementById("dropdown");
            selectElement.selectedIndex = 0;
        }
    }, [items]);

    function handleSelectChange(event) {
        const selectedValue = event.target.value
        if (selectedValue === "NEW_ITEM") {
            onSelectNewItem()
        } else {
            const item = items.find(it => it.text === selectedValue)
            if (item) {
                setSelectedItem(item)
                onSelectItem(selectedValue)
            }
        }
    }

    return (
        <>
            <label htmlFor="dropdown"></label>
            <select id="dropdown" value={selectedItem} onChange={handleSelectChange} className={style.dropdownbtn}>
                <option value="" disabled className={style.placeholder}>{placeholderText}</option>
                {items.map((item, index) => (
                    <option key={index} value={item.text} className={style.dropdowncontent}>
                        {item.text}
                    </option>
                ))}
                <optgroup label="">
                    <option value="NEW_ITEM">
                        {newItemText}
                    </option>
                </optgroup>
            </select>
        </>
    );
}

DropDown.propTypes = {
    newItemText: PropTypes.string,
    placeholderText: PropTypes.string,
    items: PropTypes.array,
    onSelectItem: PropTypes.func,
    onSelectNewItem: PropTypes.func
};

export default DropDown;
