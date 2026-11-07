import { CheckCircle2 } from 'lucide-react';
import './Toast.css';

export interface ToastMessage {
  id: number;
  text: string;
}

export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <CheckCircle2 size={20} aria-hidden="true" /> {toast.text}
        </div>
      )}
    </div>
  );
}
