import { toast as reactToast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  theme: 'dark',
  position: 'bottom-right',
};

interface InfoProps {
  title: string;
  message: string;
}

function InfoContent({ title, message }: InfoProps) {
  return (
    <div>
      <strong className="text-sm text-gray-600">{title}</strong>
      <p className="text-xs text-gray-500">{message}</p>
    </div>
  );
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    reactToast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    reactToast.error(message, { ...defaultOptions, ...options });
  },
  info: ({ title, message }: InfoProps, options?: ToastOptions) => {
    reactToast.info(<InfoContent title={title} message={message} />, {
      ...defaultOptions,
      ...options,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    reactToast.warn(message, { ...defaultOptions, ...options });
  },
};
