import { NftData } from "@/components/nft/card-nft";
import backendService from "./service";

export async function fetchNFTs(ownerAddress: string): Promise<NftData[]> {
  const url = `${import.meta.env.VITE_RESERVOIR_URL}/users/${ownerAddress}/tokens/v10`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': import.meta.env.VITE_RESERVOIR_API_KEY
      }
    });
    const data = await response.json();
    return data.tokens as NftData[];
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}

interface Attributes {
  "name": string,
  "description": string,
  "image": string,
  "attributes": {
    "trait_type": string,
    "value": unknown
  }[]
}

export async function fetchAttributes(url: string): Promise<Attributes | null> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return null;
  }
}