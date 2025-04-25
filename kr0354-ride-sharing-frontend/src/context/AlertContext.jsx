import { createContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Add alert
  const addAlert = (msg, type = 'info', timeout = 5000) => {
    const id = uuidv4();

    // Check if the same message already exists to prevent duplicates
    setAlerts(prevAlerts => {
      // Check if we already have this exact message and type
      const isDuplicate = prevAlerts.some(alert =>
        alert.msg === msg && alert.type === type
      );

      // If it's a duplicate, don't add it
      if (isDuplicate) {
        return prevAlerts;
      }

      return [...prevAlerts, { id, msg, type }];
    });

    if (timeout) {
      setTimeout(() => removeAlert(id), timeout);
    }

    return id;
  };

  // Remove alert
  const removeAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
