import { createContext } from 'react';

type ToastOptions = {
  title: string;
  message: string;
  autoClose?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  [key: string]: any;
};

// Define the context type
interface ToastContextType {
  toast: {
    success: (options: ToastOptions) => void;
    error: (options: ToastOptions) => void;
    info: (options: ToastOptions) => void;
    warning: (options: ToastOptions) => void;
    default: (options: ToastOptions) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

export default ToastContext;
