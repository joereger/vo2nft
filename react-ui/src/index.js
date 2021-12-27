import ReactDOM from 'react-dom';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { UserProvider } from "./components/UserContext"

ReactDOM.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
    , 
    document.getElementById('root')
);

serviceWorker.unregister();
