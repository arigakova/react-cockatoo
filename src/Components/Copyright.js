import React from 'react';
import style from './Styles.module.css';
import { Link } from 'react-router-dom';

function Copyright() {
    return (
        <div className={style.disclaimer}>
            <p>This is a learning project and is not intended for commercial use. The content of this project is provided for educational purposes only and is not intended to be a substitute for professional advice or guidance. The author and publisher disclaim any liability for any damages or losses resulting from the use or misuse of this project. Use at your own risk.</p>
            <Link className={style.link} to={"/"}>Back to Todo</Link>
        </div>
    );
}

export default Copyright;