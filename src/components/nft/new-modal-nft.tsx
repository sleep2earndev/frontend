import { fetchNFTs } from "@/api/nft";
import { Modal } from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { motion } from "motion/react";
import { NftData } from "../nft/card-nft";
import Image from "../ui/image";
import { useMemo } from "react";
import { Check } from "lucide-react";

interface ModalNftProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  [key: string]: unknown;
}

export default function NewModalNft({ open, onOpenChange }: ModalNftProps) {
  const { address } = useAccount();
  const { data } = useQuery({
    queryKey: ["nfts", address],
    queryFn: () => fetchNFTs(address as string),
    enabled: !!address,
  });

  const selectedNFT = useMemo<NftData | null>(() => {
    const selected = localStorage.getItem("nft-selected");
    if (selected) {
      const data = JSON.parse(selected);
      return data as NftData;
    }

    return null;
  }, [open]);

  function onChoose(data: NftData) {
    localStorage.setItem("nft-selected", JSON.stringify(data));
    onOpenChange(false);
  }

  return (
    <Modal title="Choose your NFT" open={open} onOpenChange={onOpenChange}>
      <div className="relative">
        <div className="grid grid-cols-2 gap-4">
          {(data || []).map((nft, index) => (
            <motion.button
              key={`nft-${nft.id}-${index}`}
              onClick={() => {
                onChoose(nft);
              }}
              className={`group relative overflow-hidden rounded-xl bg-muted/50 p-1 transition-all hover:bg-muted/70 ${
                selectedNFT?.id?.tokenId === nft.id?.tokenId
                  ? "ring-2 ring-primary shadow-neon-purple"
                  : ""
              }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={nft.media?.[0]?.gateway}
                  alt={nft.title}
                  className="h-full w-full object-cover"
                />
                {selectedNFT?.id?.tokenId === nft.id?.tokenId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="mb-1 text-sm font-medium">{nft.title}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
