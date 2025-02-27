import { fetchNFTs } from "@/api/nft";
import FadeWrapper from "@/components/animation/fade";
import ListNft from "@/components/nft/list-nft";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router";
import { useAccount } from "wagmi";

export default function MarketplacePage() {
  const { address } = useAccount()
  const { data, isLoading } = useQuery({
    queryKey: ["nfts", import.meta.env.VITE_ADDRESS_NFT],
    queryFn: () => fetchNFTs(import.meta.env.VITE_ADDRESS_NFT),
    enabled: !!address
  });

  if (!address) {
    return <Navigate to="/play/wallet" />
  }

  return (
    <FadeWrapper className="p-4">
      <ListNft loading={isLoading} data={data} type="marketplace"/>
    </FadeWrapper>
  );
}
