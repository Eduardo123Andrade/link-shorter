import { toast as reactToast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  theme: 'dark',
  position: 'bottom-right',
};

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    reactToast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    reactToast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    reactToast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    reactToast.warn(message, { ...defaultOptions, ...options });
  },
};
