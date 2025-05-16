import { Network } from "ethers";
import {
  DynamicProvider,
  DynamicProviderOptions,
  FallbackStrategy,
} from "ethers-dynamic-provider";
import { ChainId, ChainKey, chainsById, chainsByKey } from "./chains";

type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export interface ChainListProviderOptions extends DynamicProviderOptions {}

export class ChainListProvider extends DynamicProvider {
  constructor(
    chain: ChainId | ChainKey,
    options: Optional<ChainListProviderOptions, "strategy"> = {}
  ) {
    const info =
      typeof chain === "string" ? chainsByKey[chain] : chainsById[chain];

    if (!info) {
      throw new Error(`Chain ${chain} not found in chain list`);
    }

    const network = new Network(info.name, info.id);

    super(
      info.rpcs,
      {
        staticNetwork: network,
        strategy: new FallbackStrategy(),
        ...options,
      },
      network
    );
  }
}
