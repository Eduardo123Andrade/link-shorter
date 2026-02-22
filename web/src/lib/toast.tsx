import { toast as reactToast, ToastOptions } from 'react-toastify';
import { InfoIcon } from '@phosphor-icons/react/Info';
import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';

const baseOptions: ToastOptions = {
  position: 'bottom-right',
  theme: 'light',
};

const infoStyle: ToastOptions = {
  style: { background: '#E8EAF0', color: '#4D505C', borderRadius: '12px' },
  icon: <InfoIcon size={24} weight="fill" color="#2C46B1" />,
};

const errorStyle: ToastOptions = {
  style: { background: '#FBE2E6', color: '#B12C4D', borderRadius: '12px' },
  icon: <WarningCircleIcon size={24} weight="fill" color="#B12C4D" />,
};

interface ToastContentProps {
  title: string;
  message: string;
}

function ToastContent({ title, message }: ToastContentProps) {
  return (
    <div>
      <strong className="text-sm font-bold">{title}</strong>
      <p className="text-xs opacity-80">{message}</p>
    </div>
  );
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    reactToast.success(message, { ...baseOptions, ...options });
  },
  error: ({ title, message }: ToastContentProps, options?: ToastOptions) => {
    reactToast.error(<ToastContent title={title} message={message} />, {
      ...baseOptions,
      ...errorStyle,
      ...options,
    });
  },
  info: ({ title, message }: ToastContentProps, options?: ToastOptions) => {
    reactToast.info(<ToastContent title={title} message={message} />, {
      ...baseOptions,
      ...infoStyle,
      ...options,
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    reactToast.warn(message, { ...baseOptions, ...options });
  },
};
