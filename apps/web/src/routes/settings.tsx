import { createFileRoute, redirect } from "@tanstack/react-router";
import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: "/settings",
        },
      });
    }
  },
});

function RouteComponent() {
  const [mcps, setMcps] = useState<string>(
    JSON.stringify(
      {
        mcpServers: {
          context7: {
            type: "stdio",
            command: "npx",
            args: ["-y", "@upstash/context7-mcp"],
          },
        },
      },
      null,
      2,
    ),
  );

  const mcpsId = useId();

  return (
    <div className="container mx-auto flex flex-col gap-4 p-4">
      <h1 className="font-bold text-2xl">Settings</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor={mcpsId}>MCPs</Label>
        <Textarea
          id={mcpsId}
          name="mcps"
          value={mcps}
          onChange={(e) => setMcps(e.target.value)}
          className="resize-none font-mono"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
