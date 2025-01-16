import { NextRequest, NextResponse } from "next/server";
import getSession from "@/lib/getSession";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url as string);

  // Access the query parameter
  const subgraphId = searchParams.get("subgraphID") as string;
  console.log("Subgraph ID:", subgraphId);
  if (!subgraphId) {
    return NextResponse.json({ error: { message: "subgraphId is required" } }, { status: 400 });
  }

  const session = await getSession();
  const token = session?.accessToken;

  console.log("Session:", session);

  try {
    // Prepare the request options
    const response = await fetch(
      "http://index-node-community-quarantine-0.index-node-community-quarantine.default.svc.cluster.local:8080/exec",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: ["/bin/sh", "-c", `graphman restart "${subgraphId}"`],
          stdin: true,
          stdout: true,
          stderr: true,
          tty: true,
        }),
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Handle the response if needed
    const data = await response.json();
    console.log("Command executed successfully:", data);
  } catch (error) {
    console.error("Error executing command:", error);
  }
}
