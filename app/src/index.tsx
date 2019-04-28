import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import 'leaflet/dist/leaflet.css';
import { GlobalStyles, ViewportProvider } from './components';

ReactDOM.render(
  <ViewportProvider>
    <GlobalStyles />
    <App />
  </ViewportProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
