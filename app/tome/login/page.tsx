"use client";

import { Input, Button, Typography, Alert } from "antd";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";

const { Title } = Typography;

export default function LoginPage() {
  const {
    mutate: signIn,
    isPending,
    error: signInError,
  } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/auth/signIn", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
    onSuccess: () => {
      window.location.href = "/tome/home";
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await signIn({
        email: value.email,
        password: value.password,
      });
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

        {signInError && (
          <Alert
            title={signInError.message}
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
            loading={form.state.isSubmitting || isPending}
            disabled={!form.state.isValid}
          >
            Login
          </Button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link href="/tome/signup">
            <Button type="link">Don&apos;t have an account? Sign up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
