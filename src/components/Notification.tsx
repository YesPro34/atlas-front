export default function Notification({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } shadow-lg transition-opacity duration-300`}>
      {message}
    </div>
  );
}