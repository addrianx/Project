// Toast — Floating notification popup

window.Toast = function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-20 right-4 z-50 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl font-medium text-xs bg-blue-600 text-white">
        <span>ℹ️</span> <span>{message}</span>
        <button onClick={onClose} className="ml-2">✕</button>
      </div>
    </div>
  );
};
