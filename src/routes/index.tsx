import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useApp();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate({ to: "/login", replace: true });
    else navigate({ to: user.role === "manager" ? "/dashboard" : "/my-cases", replace: true });
  }, [user, navigate]);
  return null;
}
