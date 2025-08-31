import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import Loader from "./components/loader";
import { authClient } from "./lib/auth-client";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPendingComponent: () => <Loader />,
  context: {
    isAuthenticated: false,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { data } = authClient.useSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: needed
  useEffect(() => {
    router.invalidate();
  }, [data?.user]);

  return (
    <RouterProvider
      router={router}
      context={{ isAuthenticated: !!data?.user }}
    />
  );
}
