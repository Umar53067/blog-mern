import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './app/store.js'; 
import App from './App.jsx'
import {store} from './app/store.js'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>,
)
