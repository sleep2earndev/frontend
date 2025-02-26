import { fetchNFTs } from "@/api/nft";
import FadeWrapper from "@/components/animation/fade";
import CardNft from "@/components/ui/card-nft";
import { useQuery } from "@tanstack/react-query";

export default function MarketplacePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["nfts", import.meta.env.VITE_ADDRESS_CONTRACT],
    queryFn: () => fetchNFTs(import.meta.env.VITE_ADDRESS_CONTRACT),
  });

  return (
    <FadeWrapper className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-32">
        {isLoading ? "Loading" : ""}
        {data?.map((nft, index) => (
          <FadeWrapper
            key={`card-nft-${index}`}
            transition={{ delay: index * 0.1 }}
          >
            <CardNft data={nft} />
          </FadeWrapper>
        ))}
      </div>
    </FadeWrapper>
  );
}
