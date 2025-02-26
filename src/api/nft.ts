export type NFT = {
  title: string;
  description: string;
  tokenId: string;
  media: { gateway: string }[]; // Gambar NFT
};

export async function fetchNFTs(ownerAddress: string): Promise<NFT[]> {
  const url = `https://eth-sepolia.g.alchemy.com/v2/${
    import.meta.env.VITE_API_KEY_ALCHEMY
  }/getNFTs/?owner=${ownerAddress}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.ownedNfts as NFT[]; // Casting ke tipe NFT[]
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}
