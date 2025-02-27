import FadeWrapper from "@/components/animation/fade";
import CardNft, { NftData } from "@/components/ui/card-nft";
import { cn } from "@/lib/utils";

export default function ListNft({
  loading,
  data,
  type = "marketplace",
  onChoose = () => {},
  className,
  ...props
}: {
  loading: boolean;
  data: NftData[];
  type: "marketplace" | "choose";
  onChoose?: (data: NftData) => void;
  className?: string;
}) {
  if (loading) return <p className="text-white/60 text-center">Loading...</p>;
  if (data?.length === 0)
    return <p className="text-white/60 text-center">No NFT Found</p>;
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)} {...props}>
      {data?.map((nft, index) => (
        <FadeWrapper
          key={`card-nft-${index}-${type}`}
          transition={{ delay: index * 0.1 }}
        >
          <CardNft data={nft} type={type} onChoose={onChoose} />
        </FadeWrapper>
      ))}
    </div>
  );
}
