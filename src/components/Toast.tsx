"use client"
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`rounded-lg p-4 shadow-lg ${
          type === 'success'
            ? 'bg-green-100 border-l-4 border-green-500'
            : 'bg-red-100 border-l-4 border-red-500'
        }`}
      >
        <div className="flex items-center">
          {type === 'success' ? (
            <svg
              className="w-6 h-6 text-green-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-red-500 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          )}
          <p
            className={`text-sm font-medium ${
              type === 'success' ? 'text-green-900' : 'text-red-900'
            }`}
          >
            {message}
          </p>
          <button
            onClick={onClose}
            className={`ml-4 text-${
              type === 'success' ? 'green' : 'red'
            }-500 hover:text-${type === 'success' ? 'green' : 'red'}-700`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 