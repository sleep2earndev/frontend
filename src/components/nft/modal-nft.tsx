import { fetchNFTs } from "@/api/nft";
import { Modal } from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import ListNft from "./list-nft";
import { NftData } from "../ui/card-nft";

interface ModalNftProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  [key: string]: unknown;
}

export default function ModalNft({ open, onOpenChange }: ModalNftProps) {
  const { address } = useAccount();
  const { data, isLoading } = useQuery({
    queryKey: ["nfts", address],
    queryFn: () => fetchNFTs(address as string),
    enabled: !!address,
  });

  function onChoose(data: NftData) {
    localStorage.setItem("nft-selected", JSON.stringify(data));
    onOpenChange(false);
  }

  return (
    <Modal title="Choose your NFT" open={open} onOpenChange={onOpenChange}>
      <div className="mt-2 max-h-[calc(100vh-20vh)] overflow-y-auto px-2">
        <ListNft
          loading={isLoading}
          data={data as NftData[]}
          type="choose"
          onChoose={onChoose}
        />
      </div>
    </Modal>
  );
}
