import { useToast } from '../context/ToastContext';
import Alert from './Alert';

export default function ToastDisplay() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => {}} // Auto-closes after 3 seconds
        />
      ))}
    </>
  );
}
