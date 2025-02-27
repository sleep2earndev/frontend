// import { Badge } from "./badge";
import IconEnergy from "@/components/icon/energy";
import { Button } from "./button";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import abi from "@/abi/sleepnft.json";
import { useQuery } from "@tanstack/react-query";
import useCurrency from "@/hooks/useCurrency";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useLoading } from "@/components/loading-provider";
import IconWallet from "@/components/icon/wallet";
import { cn } from "@/lib/utils";

export interface NftData {
  metadata?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attributes?: { trait_type: string; value: any }[];
  };
  contract?: {
    address?: string;
  };
  id?: {
    tokenId?: string;
  };
  media?: { gateway?: string }[];
  title?: string;
}

export default function CardNft({ data, type = 'marketplace', onChoose = () => { } }: { data: NftData, type?: 'marketplace' | 'choose', onChoose?: (data: NftData) => void }) {
  const { setLoading } = useLoading();
  const { convertWei, convertTokenIdNft } = useCurrency();

  const tokenId = useMemo(() => {
    if (data.id) {
      return convertTokenIdNft(data?.id?.tokenId as string)
    }
    return
  }, [data])

  const maxEnergy = data?.metadata?.attributes?.find(
    (attr) => attr.trait_type === "Energy"
  )?.value;
  const maxEarn = data?.metadata?.attributes?.find(
    (attr) => attr.trait_type === "Max Earn"
  )?.value;

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
  } = useWaitForTransactionReceipt({
    hash,
    retryCount: 0,
  });

  function handleBuyNft() {
    writeContract({
      abi,
      address: data?.contract?.address as `0x${string}`,
      functionName: "buyNFT",
      args: [tokenId],
    });
  }

  function handleChoose() {
    onChoose(data)
  }

  async function fetchNFTs() {
    const url = `${import.meta.env.VITE_OPENSEA_URL}/api/v2/listings/collection/${import.meta.env.VITE_COLLECTION_SLUG_NFT
      }/nfts/${tokenId}/best`;
    try {
      const response = await fetch(url, {
        headers: { "X-API-KEY": import.meta.env.VITE_API_KEY_OPENSEA },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      return [];
    }
  }

  const { data: detail } = useQuery({
    queryKey: ["nft-detail", `${data?.contract?.address}-${data?.id?.tokenId}`],
    queryFn: fetchNFTs,
  });

  const price = convertWei(
    Number(detail?.price?.current?.value || 0),
    detail?.price?.current?.decimals
  );

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

  return (
    <div className="nft-card" role="button">
      <div className="border border-white">
        <img src={data?.media?.[0]?.gateway} alt={data?.title} />
      </div>

      <div className="flex justify-center">
        <Badge
          variant={"outline"}
          className={cn("bg-background/30 text-[#F59D0B] border-[#F59D0B]", {
            'opacity-30': !price
          })}
        >
          {price ? `${price} ETH` : 'Not listed'}
        </Badge>
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

        {
          type === 'marketplace' && <Button
            className="text-white text-xs custom-box-shadow"
            size={"sm"}
            disabled={isPending || !price}
            onClick={handleBuyNft}
          >
            Buy
          </Button>
        }

        {
          type === 'choose' && <Button
            className="text-white text-xs custom-box-shadow bg-[#F59D0B]"
            size={"sm"}
            disabled={isPending}
            onClick={handleChoose}
          >
            Choose
          </Button>
        }
      </div>
    </div>
  );
}
