import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  beforeLoad: async ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({
        to: search.redirect || "/",
      });
    }
  },
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
