import { fetchAttributes, fetchNFTs } from "@/api/nft";
import { Modal } from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { motion } from "motion/react";
import { NftData } from "@/components/nft/card-nft";
import Image from "../ui/image";
import { useMemo } from "react";
import { Check } from "lucide-react";
import { convertIpfsToHttp, getAttributes } from "@/lib/utils";
import { useLoading } from "../loading-provider";

interface ModalNftProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  [key: string]: unknown;
}

export default function NewModalNft({ open, onOpenChange }: ModalNftProps) {
  const { setLoading } = useLoading()
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


  async function onChoose(data: NftData) {
    setLoading(true)
    const url = convertIpfsToHttp(data.token.metadata.tokenURI)
    const metadata = await fetchAttributes(url)
    
    localStorage.setItem("nft-selected", JSON.stringify({
      ...data,
      maxEarn: getAttributes(metadata?.attributes || [], 'Max Earn') || 0,
      maxEnergy: getAttributes(metadata?.attributes || [], 'Energy') || 0
    } as NftData));
    setLoading(false)
    onOpenChange(false);
  }

  return (
    <Modal title="Choose your NFT" open={open} onOpenChange={onOpenChange}>
      <div className="relative">
        <div className="grid grid-cols-2 gap-4 mt-2">
          {(data || []).map((nft, index) => (
            <motion.button
              key={`nft-${nft.token.tokenId}-${index}`}
              onClick={() => {
                onChoose(nft);
              }}
              className={`group relative overflow-hidden rounded-xl bg-muted/50 p-1 transition-all hover:bg-muted/70 ${selectedNFT?.token?.tokenId === nft.token?.tokenId
                  ? "ring-2 ring-primary shadow-neon-purple"
                  : ""
                }`}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={nft.token.image}
                  alt={nft.token.name}
                  className="h-full w-full object-cover"
                />
                {selectedNFT?.token?.tokenId === nft.token?.tokenId && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-sm">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <div className="mb-1 text-sm font-medium">{nft.token?.name}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
