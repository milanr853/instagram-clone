import React from 'react';
import ReactDOM from 'react-dom/client';
import Wrapper from './Wrapper';
import store from './Redux/Store/store';
import { Provider } from 'react-redux';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Wrapper />
    </React.StrictMode>
  </Provider>
);


