import React from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm }:any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg text-center">
        <p>Are you sure you want to delete this student?</p>
        <div className="mt-4 flex justify-center gap-3">
          <button className="btn !bg-gray-400" onClick={onClose}>
            Cancel
          </button>
          <button className="btn !bg-red-600" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
