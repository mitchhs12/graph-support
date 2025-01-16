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

async function handleRestart(subgraphId: string) {
  try {
    const response = await fetch(`/api/restart?subgraphID=${subgraphId}`);
    if (response.ok) {
      console.log("Subgraph restarted successfully!");
    } else {
      console.error("Failed to restart subgraph.");
    }
  } catch (error) {
    console.error("Error restarting subgraph:", error);
  }
}

async function handleRewind(subgraphId: string, blockNumber: number) {
  try {
    const response = await fetch(`/api/rewind?subgraphID=${subgraphId}`);
    if (response.ok) {
      console.log("Subgraph restarted successfully!");
    } else {
      console.error("Failed to restart subgraph.");
    }
  } catch (error) {
    console.error("Error restarting subgraph:", error);
  }
}

async function handleReassign(subgraphId: string, newIndexNode: string) {
  try {
    const response = await fetch(`/api/reassign?subgraphID=${subgraphId}`);
    if (response.ok) {
      console.log("Subgraph restarted successfully!");
    } else {
      console.error("Failed to restart subgraph.");
    }
  } catch (error) {
    console.error("Error restarting subgraph:", error);
  }
}

export default function SubgraphSearch() {
  const [subgraphID, setSubgraphID] = useState(""); // To store the input value
  const [result, setResult] = useState<SubgraphIndexingStatus | null>(null); // To store the result from the API
  const [newBlockNumber, setNewBlockNumber] = useState(0);
  const [newIndexNode, setNewIndexNode] = useState("");

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
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex gap-3">
                <h2>ID</h2>
                <p className="truncate">{result.subgraph}</p>
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
            </div>
            <div>
              {result.chains[0].latestBlock ? (
                <div>
                  <div className="flex gap-3">
                    <h2 className="text-nowrap">Subgraph earliest block number</h2>
                    <p>{result.chains[0].earliestBlock?.number}</p>
                  </div>
                  <div className="flex gap-3">
                    <h2 className="text-nowrap">Subgraph earliest block hash</h2>
                    <p>{result.chains[0].earliestBlock?.hash}</p>
                  </div>
                </div>
              ) : (
                <div>Chain head block couldn't be found!</div>
              )}
              {result.chains[0].latestBlock ? (
                <div>
                  <div className="flex gap-3">
                    <h2 className="text-nowrap">Subgraph latest block number</h2>
                    <p className="truncate">{result.chains[0].latestBlock?.number}</p>
                  </div>
                  <div className="flex gap-3">
                    <h2 className="text-nowrap">Subgraph latest block hash</h2>
                    <p className="truncate">{result.chains[0].latestBlock?.hash}</p>
                  </div>
                </div>
              ) : (
                <div>Subgraph latest block couldn't be found!</div>
              )}
              {result.chains[0].chainHeadBlock ? (
                <div>
                  <div className="flex gap-3">
                    <h2 className="text-nowrap">Chain head block number</h2>
                    <p>{result.chains[0].chainHeadBlock?.number}</p>
                  </div>
                  <div className="flex gap-3">
                    <h2 className="text-nowrap">Chain head block hash</h2>
                    <p className="truncate">{result.chains[0].chainHeadBlock?.hash}</p>
                  </div>
                </div>
              ) : (
                <div>Chain head block couldn't be found!</div>
              )}
            </div>
            <div>
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
          </div>
          <div className="flex flex-col gap-6 md:flex-row w-full justify-center">
            <div className="w-full">
              <Button
                onClick={() => {
                  handleRestart(result.subgraph);
                }}
                className="w-full"
              >
                Restart Subgraph
              </Button>
            </div>
            <div className="w-full">
              <div className="flex flex-col w-full gap-3">
                <Input
                  type="number"
                  placeholder="Block number"
                  onChange={(e) => setNewBlockNumber(parseInt(e.target.value))}
                />
                <Button
                  disabled={
                    newBlockNumber
                      ? newBlockNumber >= parseInt(result.chains[0].earliestBlock?.number!) &&
                        newBlockNumber < parseInt(result.chains[0].latestBlock?.number!)
                        ? false
                        : true
                      : true
                  }
                  onClick={() => {
                    handleRewind(result.subgraph, newBlockNumber);
                  }}
                  className="w-full"
                >
                  Rewind Subgraph
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Input type="text" placeholder="New Index Node" onChange={(e) => setNewIndexNode(e.target.value)} />
              <Button
                disabled={newIndexNode ? false : true}
                onClick={() => {
                  handleReassign(result.subgraph, newIndexNode);
                }}
                className="w-full"
              >
                Reassign Subgraph
              </Button>
            </div>
            {/* <div> <Button
              onClick={() => {
                checkAllocation(result.subgraph);
              }}
              className="w-full"
            >
              Check Allocation
            </Button> </div>*/}
          </div>
        </div>
      )}
    </div>
  );
}
