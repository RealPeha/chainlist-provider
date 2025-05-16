import fs from "fs";
import path from "path";

const run = async () => {
  try {
    const chains = (await fetch("https://chainlist.org/rpcs.json").then((x) =>
      x.json()
    )) as {
      chainId: number;
      shortName: string;
      name: string;
      rpc: {
        url: string;
      }[];
    }[];

    const newChains = chains.map((chain: any) => {
      return {
        id: chain.chainId,
        key: chain.shortName,
        name: chain.name,
        rpcs: chain.rpc
          .map((rpc: any) => rpc.url)
          .filter((url: any) => !url.startsWith("ws")),
      };
    });

    fs.writeFileSync(
      path.join(__dirname, "../src/chains.ts"),
      `
// This file is auto-generated. Do not edit manually.
const chains = ${JSON.stringify(newChains, null, 2)} as const

export type ChainId = typeof chains[number]['id']
export type ChainKey = typeof chains[number]['key']
export type ChainName = typeof chains[number]['name']

export interface ChainBasic {
  id: ChainId
  key: ChainKey
  name: ChainName
  rpcs: string[]
}

export const chainsById: Record<ChainId, ChainBasic> = Object.fromEntries(
  chains.map((chain: any) => [chain.id, chain])
);

export const chainsByKey: Record<ChainKey, ChainBasic> = Object.fromEntries(
  chains.map((chain: any) => [chain.key, chain])
);

export const chainsByName: Record<ChainName, ChainBasic> = Object.fromEntries(
  chains.map((chain: any) => [chain.name, chain])
);
`
    );
  } catch (err) {
    console.error("Error fetching chains:", err);
  }
};

run();
