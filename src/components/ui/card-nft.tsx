// import { Badge } from "./badge";
import IconEnergy from "@/components/icon/energy";
import { Button } from "./button";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import abi from "@/abi/sleepnft.json";
import useCurrency from "@/hooks/useCurrency";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLoading } from "@/components/loading-provider";
import IconWallet from "@/components/icon/wallet";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { NftData } from "@/components/nft/card-nft";

export default function CardNft({
  data,
  type = "marketplace",
  onChoose = () => { },
}: {
  data: NftData;
  type?: "marketplace" | "choose";
  onChoose?: (data: NftData) => void;
}) {
  const { setLoading } = useLoading();
  const { convertWei } = useCurrency();

  const [loadingImage, setLoadingImage] = useState(true);
  const [openSuccess, setOpenSuccess] = useState(false);

  const queryClient = useQueryClient();

  const tokenId = useMemo(() => {
    return data.token?.tokenId;
  }, [data]);

  const { data: priceContract, isLoading: isLoadingPrice } = useReadContract({
    abi,
    address: import.meta.env.VITE_ADDRESS_NFT as `0x${string}`,
    functionName: "getListingData",
    args: [[tokenId]],
  });

  const maxEnergy = 0
  const maxEarn = 0

  const {
    writeContract,
    isPending,
    data: hash,
  } = useWriteContract({
    mutation: {
      retry: false,
    },
  });
  const {
    isError: isErrorTransaction,
    error: errorTransaction,
    isLoading,
    isSuccess
  } = useWaitForTransactionReceipt({
    hash,
    retryCount: 0,
  });

  function handleBuyNft() {
    writeContract({
      abi,
      address: import.meta.env.VITE_ADDRESS_NFT as `0x${string}`,
      functionName: "buyItem",
      args: [tokenId],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: (priceContract as any)?.[0]?.price,
    });
  }

  function handleChoose() {
    onChoose(data);
  }

  const price = convertWei(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Number((priceContract as any)?.[0]?.price || 0),
    18
  );

  useEffect(() => {
    if (isSuccess) {
      setOpenSuccess(true)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isErrorTransaction) {
      let message;
      try {
        const _error = JSON.parse(JSON.stringify(errorTransaction));
        message = _error?.shortMessage;
      } catch {
        console.warn("Error transaction", errorTransaction);
        message = "Transaction error";
      }
      toast.error(message);
    }
  }, [isErrorTransaction]);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  function handleCloseSuccess() {
    setOpenSuccess(false)

    queryClient.invalidateQueries({
      queryKey: ['nfts'],
      exact: false
    })
  }

  return (
    <div className="nft-card" role="button">
      <div className="border border-white relative w-full max-w-[143px] aspect-square">
        <Modal open={openSuccess} title="Payment Success!🎉" onOpenChange={handleCloseSuccess}>
          <img
            src={data.token?.image}
            alt={data.token?.name}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "https://placehold.co/143x143";
            }}
            onLoad={() => setLoadingImage(false)}
            className="w-full max-w-[143px] aspect-square mx-auto mt-8"
          />

          <div className="flex justify-center mt-6">
            <Badge
              variant={"outline"}
              className={cn("bg-background/30 text-[#F59D0B] border-[#F59D0B]", {
                "opacity-30": !price,
              })}
            >
              {price ? `${price} MON` : "Not listed"}
            </Badge>
          </div>
          <Button className="w-full mt-6">Close</Button>
        </Modal>
        {loadingImage && (
          <motion.div
            className="w-full max-w-[143px] aspect-square flex flex-col items-center justify-center absolute inset-0 mx-auto"
            exit={{ opacity: 0 }}
          >
            <Loader2 className="animate-spin" />
          </motion.div>
        )}

        <img
          src={data.token?.image}
          alt={data.token?.name}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = "https://placehold.co/143x143";
          }}
          onLoad={() => setLoadingImage(false)}
          className="w-full aspect-square"
        />

      </div>

      <div className="flex justify-center">
        {type === "marketplace" && !isLoadingPrice && (
          <Badge
            variant={"outline"}
            className={cn("bg-background/30 text-[#F59D0B] border-[#F59D0B]", {
              "opacity-30": !price,
            })}
          >
            {price ? `${price} MON` : "Not listed"}
          </Badge>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 text-xs font-bold">
            <IconWallet className="w-4 h-4" />
            {maxEarn || 0}
          </div>
          <div className="flex gap-2 text-xs font-bold">
            <IconEnergy className="w-4 h-4" />
            {maxEnergy || 0}
          </div>
        </div>

        {type === "marketplace" && (
          <Button
            className="text-white text-xs custom-box-shadow"
            size={"sm"}
            disabled={isPending || !price}
            onClick={handleBuyNft}
          >
            Buy
          </Button>
        )}

        {type === "choose" && (
          <Button
            className="text-white text-xs custom-box-shadow bg-[#F59D0B]"
            size={"sm"}
            disabled={isPending}
            onClick={handleChoose}
          >
            Choose
          </Button>
        )}
      </div>
    </div>
  );
}
