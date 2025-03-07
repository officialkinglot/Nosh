 import React from 'react'; // Ensure React is imported
import ReactDOM from 'react-dom/client'; // Use ReactDOM for rendering
import App from './App.jsx'; // Import the main App component
import './index.css'; // Import global styles
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter for routing
import StoreContextProvider from './Context/StoreContext.jsx'; // Import the context provider

// Create a root for ReactDOM
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode> {/* Enable StrictMode for development warnings */}
    <BrowserRouter> {/* Wrap the app with BrowserRouter for routing */}
      <StoreContextProvider> {/* Wrap the app with the context provider */}
        <App /> {/* Render the main App component */}
      </StoreContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
