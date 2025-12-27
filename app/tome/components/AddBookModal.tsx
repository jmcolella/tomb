"use client";

import { useState } from "react";
import { Modal, Alert } from "antd";
import BookForm from "@/app/components/BookForm";

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBookModal({
  open,
  onClose,
  onSuccess,
}: AddBookModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    setErrorMessage(null);
    onSuccess();
    onClose();
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
  };

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  return (
    <Modal title="Add Book" open={open} onCancel={handleClose} footer={null}>
      {errorMessage && (
        <Alert
          description={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <BookForm onSuccess={handleSuccess} onError={handleError} />
    </Modal>
  );
}
