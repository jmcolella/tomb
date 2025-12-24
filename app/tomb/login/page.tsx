"use client";

import { useState } from "react";
import { Input, Button, Typography, Alert } from "antd";
import { useForm } from "@tanstack/react-form";
import { signIn } from "@/app/server/auth/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title } = Typography;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setError(null);

      const result = await signIn(value.email, value.password);

      if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      }
      // If successful, redirect happens in the server action
    },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Login
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 24 }}
          />
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "Please enter your email";
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                  return "Please enter a valid email address";
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
                  Email
                </label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter your email"
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
            name="password"
            validators={{
              onChange: ({ value }) => {
                return !value ? "Please enter your password" : undefined;
              },
            }}
          >
            {(field) => (
              <div style={{ marginBottom: 24 }}>
                <label
                  htmlFor={field.name}
                  style={{ display: "block", marginBottom: 8 }}
                >
                  Password
                </label>
                <Input.Password
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Enter your password"
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

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSubmitting || form.state.isSubmitting}
            disabled={!form.state.isValid}
          >
            Login
          </Button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/tomb/signup">
            <Button type="link">Don't have an account? Sign up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
