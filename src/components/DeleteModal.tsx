export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  studentName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
}){
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)]  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p className="mb-4">
          Are you sure you want to delete <span className="font-medium">{studentName}</span> ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};