import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodoContainer from "./TodoContainer";
import Copyright from './Components/Copyright';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<TodoContainer/>}></Route>
                <Route
                    path="/copyright"
                    element={<Copyright/>}
                    exact
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;