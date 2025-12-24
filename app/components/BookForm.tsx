"use client";

import { Input, Button } from "antd";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBook } from "@/app/server/books/api";

interface BookFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function BookForm({ onSuccess, onError }: BookFormProps) {
  const queryClient = useQueryClient();

  const addBookMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      // Invalidate and refetch books query
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      author: "",
      totalPages: "",
    },
    onSubmit: async ({ value }) => {
      const result = await addBookMutation.mutateAsync({
        title: value.title,
        author: value.author,
        totalPages: Number(value.totalPages),
      });

      if (result.error) {
        onError?.(result.error);
      } else {
        form.reset();
        onSuccess?.();
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
