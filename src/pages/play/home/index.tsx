import IconEnergy from "@/components/icon/energy";
import IconPlus from "@/components/icon/plus";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import FadeWrapper from "@/components/animation/fade";
import { HandCoins, InfoIcon, Loader2, RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";
import ModalNft from "@/components/nft/modal-nft";
import { NftData } from "@/components/ui/card-nft";
import { useAccount } from "wagmi";
import { motion } from "motion/react";

export default function HomePage() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const { address } = useAccount();

  const selectedNFT = useMemo<NftData | null>(() => {
    const selected = localStorage.getItem("nft-selected");
    if (selected) {
      const data = JSON.parse(selected);
      return data as NftData;
    }

    return null;
  }, [openModal]);

  const attrNFT = useMemo(() => {
    return selectedNFT?.metadata?.attributes?.reduce((acc, item) => {
      acc[item.trait_type] = item.value;
      return acc;
    }, {} as { [key: string]: unknown });
  }, [selectedNFT]);

  function handleChooseNFT() {
    if (!address) return navigate("/play/wallet");
    setOpenModal(true);
  }

  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <FadeWrapper className="p-4">
      <ModalNft open={openModal} onOpenChange={setOpenModal} />
      <Card className="border-2 border-white">
        <CardContent>
          <div className="pt-6">
            <div className="relative" role="button" onClick={handleChooseNFT}>
              {selectedNFT ? (
                <div className="relative">
                  {loadingImage && (
                    <motion.div
                      className="w-full aspect-square flex flex-col items-center justify-center absolute inset-0"
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="animate-spin" />
                    </motion.div>
                  )}
                  <img
                    src={selectedNFT.media?.[0]?.gateway}
                    className="aspect-square w-full"
                    title={selectedNFT.title}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = "/placeholder.svg";
                    }}
                    onLoad={() => setLoadingImage(false)}
                  />
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="bg-white border-background text-background absolute right-2 bottom-2"
                    onClick={handleChooseNFT}
                  >
                    <RefreshCcw />
                  </Button>
                </div>
              ) : (
                <div className="p-12 flex justify-center items-center flex-col gap-2">
                  <IconPlus className="w-12 h-12 text-white/30" />
                  <p className="text-white/30">Add My Pillow</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-2">
          <HandCoins />
          <div className="flex-1 flex flex-col">
            <Progress
              value={attrNFT?.["Max Earn"] ? 100 : 0}
              classNameIndicator="bg-green-500"
              text={`${attrNFT?.["Max Earn"] || 0} ETH`}
            />
            <div className="flex gap-1.5 items-center mt-1">
              <InfoIcon className="w-3 h-3 mt-0.5 text-white/60" />
              <small className="text-xs text-white/50">
                Max earn for one time sleep
              </small>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <IconEnergy />
          <div className="flex-1">
            <Progress
              value={attrNFT?.["Energy"] ? 100 : 0}
              className="text-primary"
              text={
                attrNFT?.["Energy"]
                  ? `${attrNFT?.["Energy"]}/${attrNFT?.["Energy"]}`
                  : "0/0"
              }
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          className="text-white"
          onClick={() => {
            if (!address) return navigate("/play/wallet");
            if (selectedNFT) handleChooseNFT();
            navigate("/play/sleep");
          }}
        >
          START
        </Button>
      </div>
    </FadeWrapper>
  );
}
