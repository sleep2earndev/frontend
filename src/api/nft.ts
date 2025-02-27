import { NftData } from "@/components/ui/card-nft";

export async function fetchNFTs(ownerAddress: string): Promise<NftData[]> {
  const url = `${import.meta.env.VITE_ALCHEMY_URL}/v2/${
    import.meta.env.VITE_API_KEY_ALCHEMY
  }/getNFTs/?owner=${ownerAddress}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.ownedNfts as NftData[]; // Casting ke tipe NFT[]
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}
