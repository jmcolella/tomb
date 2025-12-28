"use client";

import { Input, Button } from "antd";
import { useForm } from "@tanstack/react-form";
import { AddBookApiInput } from "@/app/api/books/types";
import useAddBook from "@/app/tome/hooks/books/useAddBook";

interface BookFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function BookForm({ onSuccess, onError }: BookFormProps) {
  const addBookMutation = useAddBook();

  const form = useForm({
    defaultValues: {
      title: "",
      author: "",
      totalPages: "",
      currentPage: "",
    },
    onSubmit: async ({ value }) => {
      const payload: AddBookApiInput = {
        title: value.title,
        author: value.author,
        totalPages: Number(value.totalPages),
      };

      if (value.currentPage) {
        const currentPageNum = Number(value.currentPage);
        if (!isNaN(currentPageNum) && currentPageNum >= 0) {
          payload.currentPage = currentPageNum;
        }
      }

      try {
        const result = await addBookMutation.mutateAsync(payload);

        if (result.error) {
          onError?.(result.error);
        } else {
          form.reset();
          onSuccess?.();
        }
      } catch (error) {
        onError?.(
          error instanceof Error ? error.message : "Failed to add book"
        );
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) =>
            !value ? "Please enter a book title" : undefined,
        }}
      >
        {(field) => (
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor={field.name}
              style={{ display: "block", marginBottom: 8 }}
            >
              Book Title
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter book title"
              status={field.state.meta.errors.length > 0 ? "error" : undefined}
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
        name="author"
        validators={{
          onChange: ({ value }) => {
            return !value ? "Please enter an author name" : undefined;
          },
        }}
      >
        {(field) => (
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor={field.name}
              style={{ display: "block", marginBottom: 8 }}
            >
              Author Name
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter author name"
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
        name="totalPages"
        validators={{
          onChange: ({ value }) => {
            if (!value) {
              return "Please enter total pages";
            }
            const numValue = Number(value);
            if (isNaN(numValue) || numValue <= 0) {
              return "Total pages must be greater than 0";
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
              Total Pages
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter total pages"
              status={field.state.meta.errors.length > 0 ? "error" : undefined}
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
            if (value) {
              const numValue = Number(value);
              if (isNaN(numValue) || numValue < 0) {
                return "Current page must be 0 or greater";
              }
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
              Current Page (Optional)
            </label>
            <Input
              id={field.name}
              name={field.name}
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter current page"
              status={field.state.meta.errors.length > 0 ? "error" : undefined}
            />
            {field.state.meta.errors.length > 0 && (
              <div style={{ color: "#ff4d4f", marginTop: 4, fontSize: 14 }}>
                {field.state.meta.errors[0]}
              </div>
            )}
          </div>
        )}
      </form.Field>

      <Button
        type="primary"
        htmlType="submit"
        block
        loading={form.state.isSubmitting || addBookMutation.isPending}
      >
        Submit
      </Button>
    </form>
  );
}
