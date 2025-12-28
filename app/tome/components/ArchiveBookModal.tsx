"use client";

import { Modal, Button, Space } from "antd";
import useArchiveBook from "@/app/tome/hooks/books/useArchiveBook";
import { BookApiEntity } from "@/app/api/books/types";

interface ArchiveBookModalProps {
  open: boolean;
  book: BookApiEntity;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ArchiveBookModal({
  open,
  book,
  onClose,
  onSuccess,
}: ArchiveBookModalProps) {
  const archiveBook = useArchiveBook();

  const handleConfirm = async () => {
    try {
      await archiveBook.mutateAsync(book.sid);
      onSuccess();
      onClose();
    } catch (error) {
      // Error is handled by the mutation
      console.error("Error archiving book:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title="Archive Book"
      open={open}
      onCancel={handleCancel}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleConfirm}
              loading={archiveBook.isPending}
            >
              Confirm
            </Button>
          </Space>
        </div>
      }
    >
      <p>Are you sure you want to archive &quot;{book.title}&quot;?</p>
    </Modal>
  );
}
