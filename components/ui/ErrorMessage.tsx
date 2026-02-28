interface ErrorMessageProps {
  message?: string;
  onDismiss?: () => void;
}

export default function ErrorMessage({
  message,
  onDismiss,
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex justify-between items-center">
      <p className="text-red-800">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="cursor-pointer text-red-600 hover:text-red-800 font-semibold"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
