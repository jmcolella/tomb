"use client";

import { Input, Button, Typography, Alert } from "antd";
import { useForm } from "@tanstack/react-form";
import useSignup from "@/app/tome/hooks/auth/useSignup";

const { Title } = Typography;

export default function SignUpPage() {
  const { mutate: signUp, isPending: isSubmitting, error } = useSignup();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: ({ value }) => {
        if (!value.email) {
          return "Please enter your email";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
          return "Please enter a valid email address";
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      await signUp({
        email: value.email,
        password: value.password,
      });
    },
  });

  const isValid = form.state.isValid;

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
          Sign Up
        </Title>

        {error && (
          <Alert
            title={error?.message}
            type="error"
            showIcon
            closable
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
                if (!value) {
                  return "Please enter your password";
                }
                if (value.length < 6) {
                  return "Password must be at least 6 characters";
                }
                return undefined;
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
            disabled={!isValid}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
