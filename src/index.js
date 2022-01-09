import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { DataProvider } from "./app/context";

ReactDOM.render(
  <BrowserRouter basename="/">
    <DataProvider>
      <App />
    </DataProvider>
  </BrowserRouter>
, document.getElementById('root'));

serviceWorker.unregister();