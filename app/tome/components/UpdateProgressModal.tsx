"use client";

import { Modal, Button, Space, DatePicker, Input, Alert } from "antd";
import { useForm } from "@tanstack/react-form";
import dayjs, { Dayjs } from "dayjs";
import useUpdateProgress from "@/app/tome/hooks/books/useUpdateProgress";
import { BookApiEntity } from "@/app/api/books/types";

interface UpdateProgressModalProps {
  open: boolean;
  book: BookApiEntity;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateProgressModal({
  open,
  book,
  onClose,
  onSuccess,
}: UpdateProgressModalProps) {
  const updateProgress = useUpdateProgress();

  const form = useForm({
    defaultValues: {
      dateEffective: dayjs().format("YYYY-MM-DD"),
      currentPage: book.currentPage?.toString() || "0",
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProgress.mutateAsync({
          bookId: book.sid,
          dateEffective: value.dateEffective,
          currentPage: Number(value.currentPage),
        });
        onSuccess();
        onClose();
        form.reset();
      } catch (error) {
        // Error is handled by the mutation
        console.error("Error updating book progress:", error);
      }
    },
  });

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      title="Update Progress"
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {updateProgress.error && (
          <Alert
            title={updateProgress.error.message}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <form.Field
          name="dateEffective"
          validators={{
            onChange: ({ value }) =>
              !value ? "Please select a date" : undefined,
          }}
        >
          {(field) => (
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor={field.name}
                style={{ display: "block", marginBottom: 8 }}
              >
                Date
              </label>
              <DatePicker
                id={field.name}
                style={{ width: "100%" }}
                value={field.state.value ? dayjs(field.state.value) : null}
                onChange={(date: Dayjs | null) => {
                  field.handleChange(date ? date.format("YYYY-MM-DD") : "");
                }}
                onBlur={field.handleBlur}
                status={
                  field.state.meta.errors.length > 0 ? "error" : undefined
                }
              />
              {field.state.meta.errors.length > 0 && (
                <div style={{ color: "#ff4d4f", marginTop: 4, fontSize: 14 }}>
                  {field.state.meta.errors[0]}
                </div>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="currentPage"
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return "Please enter current page";
              }
              const numValue = Number(value);
              if (isNaN(numValue) || numValue < 0) {
                return "Current page must be 0 or greater";
              }
              if (book.totalPages && numValue > book.totalPages) {
                return `Current page cannot exceed total pages (${book.totalPages})`;
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor={field.name}
                style={{ display: "block", marginBottom: 8 }}
              >
                Current Page
              </label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter current page"
                status={
                  field.state.meta.errors.length > 0 ? "error" : undefined
                }
              />
              {field.state.meta.errors.length > 0 && (
                <div style={{ color: "#ff4d4f", marginTop: 4, fontSize: 14 }}>
                  {field.state.meta.errors[0]}
                </div>
              )}
            </div>
          )}
        </form.Field>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={form.state.isSubmitting || updateProgress.isPending}
            >
              Update Progress
            </Button>
          </Space>
        </div>
      </form>
    </Modal>
  );
}
