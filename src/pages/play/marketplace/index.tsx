import FadeWrapper from "@/components/animation/fade";
import CardNft from "@/components/ui/card-nft";

export default function MarketplacePage() {
  return (
    <FadeWrapper>
      <div className="grid grid-cols-2 gap-4 mb-32">
        {Array.from({ length: 10 }).map((_, index) => (
          <FadeWrapper key={`card-nft-${index}`} transition={{delay: index * 0.1}}>
            <CardNft />
          </FadeWrapper>
        ))}
      </div>
    </FadeWrapper>
  );
}
