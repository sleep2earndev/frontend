import { motion, HTMLMotionProps } from "motion/react";
import Image from "@/components/ui/image";

import { useReadContract } from "wagmi";
import abi from "@/abi/sleepnft.json";
import { useMemo } from "react";
import { Coins, Zap } from "lucide-react";
import useCurrency from "@/hooks/useCurrency";
import LoadingDots from "../ui/loading-dots";
import { useQuery } from "@tanstack/react-query";
import { fetchAttributes } from "@/api/nft";
import { cn, convertIpfsToHttp, getAttributes } from "@/lib/utils";
import IconMonad from "../icon/monad";

export interface NftData {
  token: {
    contract: string,
    tokenId: string,
    name: string,
    image: string,
    imageSmall: string,
    imageLarge: string,
    metadata: {
      imageOriginal: string,
      imageMimeType: string,
      tokenURI: string
    },
  }
  ownership: {
    tokenCount: string
    onSaleCount: string
    floorAsk: {
      id: unknown,
      price: unknown,
      maker: unknown,
      kind: unknown,
      validFrom: unknown,
      validUntil: unknown,
      source: unknown
    },
    acquiredAt: string
  },
  price?: number,
  maxEnergy?: number,
  maxEarn?: number
}

interface Props extends HTMLMotionProps<"div"> {
  data: NftData;
  onChoose?: (data: NftData) => void;
}

export default function CardNft({ onChoose = () => { }, ...props }: Props) {
  const { convertWei } = useCurrency();


  const tokenId = useMemo(() => {
    return props.data.token.tokenId;
  }, [props.data]);

  const { data: priceContract, isLoading: isLoadingPrice } = useReadContract({
    abi,
    address: import.meta.env.VITE_ADDRESS_NFT as `0x${string}`,
    functionName: "getListingData",
    args: [[tokenId]],
  });

  const { data: metadata, isPending: isPendingMetadata } = useQuery({
    queryKey: ['attributes', props.data.token.tokenId],
    queryFn: () => {
      const url = convertIpfsToHttp(props.data.token.metadata.tokenURI)
      return fetchAttributes(url)
    },
    enabled: !!props.data.token.metadata?.tokenURI,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const maxEnergy = getAttributes(metadata?.attributes || [], 'Max Earn')
  const maxEarn = getAttributes(metadata?.attributes || [], 'Energy')

  const price = convertWei(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Number((priceContract as any)?.[0]?.price || 0),
    18
  );

  function handleChoose() {
    onChoose?.({
      ...props.data,
      price,
      maxEnergy,
      maxEarn
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      {...props}
      onClick={handleChoose}
    >
      <div className="overflow-hidden rounded-xl bg-muted/50 p-1 backdrop-blur-sm">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={props.data.token.image}
            alt={props.data.token.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          <div className="absolute bottom-0 w-full p-4">
            <h3 className="text-lg font-semibold">{props.data.token.name}</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-foreground/60">Price</div>
            {isLoadingPrice ? (
              <LoadingDots />
            ) : (
              <div className="flex items-center gap-1 font-medium">
                <div className="bg-white rounded-full p-1 border border-background">
                  <IconMonad className="h-4 w-4" />
                </div>
                {price}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-primary">
              <Coins className={cn("h-4 w-4", {
                'text-gray-500': isPendingMetadata
              })} />
              {isPendingMetadata ? <LoadingDots /> : `${maxEarn} MON`}
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Zap className={cn("h-4 w-4", {
                'text-gray-500': isPendingMetadata
              })} />
              {isPendingMetadata ? <LoadingDots /> : maxEnergy}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
