"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { SubgraphIndexingStatus } from "@/app/api/status/route";
import { Button } from "@/components/ui/button";

// export interface SubgraphIndexingStatus {
//   subgraph: string;
//   synced: boolean;
//   health: "healthy" | "unhealthy" | "failed";
//   fatalError?: SubgraphError;
//   nonFatalErrors?: SubgraphError[];
//   chains: ChainIndexingStatus[];
//   entityCount: string;
//   node?: string;
// }

export default function SubgraphSearch() {
  const [subgraphID, setSubgraphID] = useState(""); // To store the input value
  const [result, setResult] = useState<SubgraphIndexingStatus | null>(null); // To store the result from the API

  const handleSearch = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed, running function...");

      if (!subgraphID) {
        console.log("Please enter a valid subgraph ID.");
        return;
      }

      try {
        // Make a GET request to your API route
        const response = await fetch(`/api/status?subgraphID=${subgraphID}`);
        if (response.ok) {
          const data = await response.json();
          setResult(data.data[0]); // Handle the response and set it to state
          console.log("data", data);
        } else {
          console.error("Failed to fetch subgraph data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  return (
    <div className="flex flex-col max-w-6xl w-full px-10 gap-3">
      <h1 className="flex justify-center">Subgraph Search</h1>
      <Input
        type="text"
        placeholder="Search for a subgraph"
        value={subgraphID}
        onChange={(e) => setSubgraphID(e.target.value)} // Update the state on input change
        onKeyDown={handleSearch} // Trigger the function on key down
      />
      {result && (
        <div className="flex flex-col gap-3">
          <div className="mt-3">
            <div className="flex gap-3">
              <h2>ID</h2>
              <p>{result.subgraph}</p>
            </div>
            <div className="flex gap-3">
              <h2>Sync Status</h2>
              <p>{result.synced === true ? true : false}</p>
            </div>
            <div className="flex gap-3">
              <h2>Health</h2>
              <p>{result.health}</p>
            </div>
            <div className="flex gap-3">
              <h2>Entity Count</h2>
              <p>{result.entityCount}</p>
            </div>
            <div className="flex gap-3">
              <h2>Node</h2>
              <p>{result.node}</p>
            </div>
            <div className="flex gap-3">
              <h2>Chain</h2>
              <p>{result.chains[0].network}</p>
            </div>
            {result.chains[0].chainHeadBlock ? (
              <div>
                <div className="flex gap-3">
                  <h2>Chain head block number</h2>
                  <p>{result.chains[0].chainHeadBlock?.number}</p>
                </div>
                <div className="flex gap-3">
                  <h2>Chain head block hash</h2>
                  <p>{result.chains[0].chainHeadBlock?.hash}</p>
                </div>
              </div>
            ) : (
              <div>Chain head block couldn't be found!</div>
            )}
            {result.chains[0].latestBlock ? (
              <div>
                <div className="flex gap-3">
                  <h2>Latest block number</h2>
                  <p>{result.chains[0].latestBlock?.number}</p>
                </div>
                <div className="flex gap-3">
                  <h2>Latest block hash</h2>
                  <p>{result.chains[0].latestBlock?.hash}</p>
                </div>
              </div>
            ) : (
              <div>Latest block couldn't be found!</div>
            )}
            {result.chains[0].latestBlock && result.chains[0].chainHeadBlock ? (
              <div className="flex gap-3">
                <h2>Sync Percentage</h2>
                <p>
                  {(
                    (parseInt(result.chains[0].latestBlock?.number) /
                      parseInt(result.chains[0].chainHeadBlock?.number)) *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            ) : (
              <div>Sync percentage couldn't be calculated!</div>
            )}
          </div>
          <div className="flex gap-3 w-full justify-center">
            <Button className="w-full">Restart Subgraph</Button>
            <Button className="w-full">Rewind Subgraph</Button>
            <Button className="w-full">Reassign Subgraph</Button>
          </div>
        </div>
      )}
    </div>
  );
}
