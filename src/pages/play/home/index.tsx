import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import FadeWrapper from "@/components/animation/fade";
import { Coins, Star, Timer, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { type NftData } from "@/components/nft/card-nft";
import { useAccount } from "wagmi";
import { motion } from "motion/react";
import Image from "@/components/ui/image";
import NewModalNft from "@/components/nft/new-modal-nft";
import { useSleep } from "@/hooks/sleep-provider";
import useEnergy from "@/hooks/use-energy";

export default function HomePage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const { address } = useAccount();

  const { energyUsed } = useEnergy();
  const { clearData, setStep } = useSleep();

  const selectedNFT = useMemo<NftData | null>(() => {
    const selected = localStorage.getItem("nft-selected");
    if (selected && address) {
      const data = JSON.parse(selected);
      return data as NftData;
    }

    return null;
  }, [openModal, address]);

  const attrNFT = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {} as any
  }, [selectedNFT]);

  function handleChooseNFT() {
    if (!address) return navigate("/play/wallet");
    setOpenModal(true);
  }

  async function handleStart() {
    if (!address) return navigate("/play/wallet");
    if (selectedNFT) handleChooseNFT();
    clearData();
    setStep("choose-category");
    navigate("/play/sleep");
  }

  const maxEnergy = attrNFT?.["Energy"] || 0;
  const remainingEnergy = maxEnergy - energyUsed;

  return (
    <FadeWrapper className="p-4 mb-32">
      <NewModalNft open={openModal} onOpenChange={setOpenModal} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8"
      >
        <div className="group relative overflow-hidden rounded-2xl bg-muted/50 p-1 backdrop-blur-sm">
          <button
            onClick={() => setOpenModal(true)}
            className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-[0.98] active:scale-95"
          >
            {!!address && !!selectedNFT ? (
              <>
                <Image
                  src={selectedNFT?.token?.image}
                  alt={selectedNFT?.token?.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-lg bg-black/50 px-3 py-2 text-sm backdrop-blur-sm">
                    {selectedNFT?.token?.name}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-foreground/60">Click to choose NFT</p>
              </div>
            )}

            {/* Change NFT Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 rounded-2xl">
              <span className="rounded-lg bg-muted/70 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Change NFT
              </span>
            </div>
          </button>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4 mt-8"
      >
        {/* Max Earn Card */}
        <div className="group relative overflow-hidden rounded-xl bg-muted/50 p-4 transition-all hover:bg-muted/70 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-full bg-primary/20 p-3 shadow-neon-purple">
              <Coins className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground/60">Max Earn</p>
              <p className="text-lg font-semibold">
                {attrNFT?.["Max Earn"] || 0} ETH
              </p>
            </div>
            <Star className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>

        {/* Energy Card */}
        <div className="group relative overflow-hidden rounded-xl bg-muted/50 p-4 transition-all hover:bg-muted/70 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="rounded-full bg-yellow-500/20 p-3 shadow-neon-pink">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">Energy Available</p>
                <p className="text-sm font-medium">
                  {remainingEnergy}/{maxEnergy}
                </p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(remainingEnergy / maxEnergy) * 100}%`,
                  }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-500/80"
                />
              </div>
            </div>
            <Timer className="h-5 w-5 text-yellow-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </motion.div>
      <div className="mt-6 flex justify-center">
        <Button size={"lg"} className="w-full px-8 py-6 text-lg" onClick={handleStart}>
          START
        </Button>
      </div>
    </FadeWrapper>
  );
}
