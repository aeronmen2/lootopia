import React, { ReactNode } from 'react';
import ToastContext from './ToastContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the options type
type ToastOptions = {
  title: string;
  message: string;
  autoClose?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  [key: string]: any;
};

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  // Creating the toast object with methods like `success`, `error`, etc.
  const toastObject = {
    success: (options: ToastOptions) => {
      toast.success(options.message, {
        ...options,
        // You can also use `options.title` here if needed for custom rendering
      });
    },
    error: (options: ToastOptions) => {
      toast.error(options.message, {
        ...options,
      });
    },
    info: (options: ToastOptions) => {
      toast.info(options.message, {
        ...options,
      });
    },
    warning: (options: ToastOptions) => {
      toast.warning(options.message, {
        ...options,
      });
    },
    default: (options: ToastOptions) => {
      toast(options.message, {
        ...options,
      });
    },
  };

  return (
    <ToastContext.Provider value={{ toast: toastObject }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
