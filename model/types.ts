import { modelOptions } from "./index";

export interface TierOption {
  id: string;
  name: string;
}

export interface ModelOption {
  id: string;
  name: string;
  tiers?: TierOption[];
}

export type ModelId = (typeof modelOptions)[number]['id'];