import FadeWrapper from "@/components/animation/fade";
import CardNft, { type NftData } from "@/components/nft/card-nft";
import OldCardNft from "@/components/ui/card-nft";
import { cn } from "@/lib/utils";

export default function ListNft({
  version = "old",
  type = 'marketplace',
  ...props
}: {
  loading: boolean;
  data: NftData[];
  type?: "marketplace" | "choose";
  onChoose?: (data: NftData) => void;
  className?: string;
  version?: "old" | "new";
}) {
  switch (version) {
    case "old":
      return <Old type={type} {...props} />;

    default:
      return <New type={type} {...props} />;
  }
}

function Old({
  loading,
  data = [],
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
          <OldCardNft data={nft} type={type} onChoose={onChoose} />
        </FadeWrapper>
      ))}
    </div>
  );
}

function New({
  loading,
  data = [],
  onChoose = () => {},
  className,
  ...props
}: {
  loading: boolean;
  data: NftData[];
  type: "marketplace" | "choose";
  onChoose?: (data: NftData) => void;
  className?: string;
  version?: "old" | "new";
}) {
  if (loading) return <p className="text-white/60 text-center">Loading...</p>;
  if (data?.length === 0)
    return <p className="text-white/60 text-center">No NFT Found</p>;
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
      {...props}
    >
      {data.map((nft, index) => (
        <CardNft data={nft} onChoose={onChoose} key={`${nft.id}-${index}`} />
      ))}
    </div>
  );
}
