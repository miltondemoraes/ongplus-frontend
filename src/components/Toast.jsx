import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose = () => {}, duration = 4000 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      // Pequeno delay para permitir que o React renderize o elemento antes de animá-lo
      requestAnimationFrame(() => {
        setShow(true);
      });
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // 300ms é a duração da transição
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [message, duration, onClose]);

  if (!message && !show) return null;

  const styles = {
    success: 'bg-teal-50 border-teal-200 text-teal-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-teal-600" />,
    error: <XCircle className="w-6 h-6 text-red-600" />,
  };

  return (
    <div 
      className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
    >
      <div className={`flex items-start p-5 border rounded-2xl shadow-xl max-w-md w-full ${styles[type]}`}>
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1 mr-4">
          <p className="text-base font-medium leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={() => { setShow(false); setTimeout(onClose, 300); }} 
          className="flex-shrink-0 ml-auto mt-0.5 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
