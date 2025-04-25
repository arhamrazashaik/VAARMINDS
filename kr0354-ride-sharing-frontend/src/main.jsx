import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Alert from './components/common/Alert';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlertProvider>
      <AuthProvider>
        <App />
        <Alert />
      </AuthProvider>
    </AlertProvider>
  </StrictMode>
);
