import { Badge } from "./badge";
import { Button } from "./button";

export default function CardNft() {
  return (
    <div className="nft-card" role="button">
      <div className="border border-white">
        <img src="https://placehold.co/160x160" alt="NFT" />
      </div>
      <div className="flex justify-center">
        <Badge variant={"outline"} className="bg-background/30 text-[#F59D0B] border-[#F59D0B]">
          #123123123123
        </Badge>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold">1000</span>
        <Button className="text-white text-xs custom-box-shadow" size={'sm'}>Buy</Button>
      </div>
    </div>
  );
}
