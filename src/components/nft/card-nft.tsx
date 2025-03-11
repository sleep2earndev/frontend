import { motion, HTMLMotionProps } from "motion/react";
import Image from "@/components/ui/image";
import IconEthereum from "../icon/ethereum";
import { useReadContract } from "wagmi";
import abi from "@/abi/sleepnft.json";
import { useMemo } from "react";
import { Coins, Zap } from "lucide-react";
import useCurrency from "@/hooks/useCurrency";
import LoadingDots from "../ui/loading-dots";
import { getAttributes } from "@/lib/utils";

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
  price?: number;
}

interface Props extends HTMLMotionProps<"div"> {
  data: NftData;
  onChoose?: (data: NftData) => void;
}

export default function CardNft(props: Props) {
  const { convertWei, convertTokenIdNft } = useCurrency();

  const tokenId = useMemo(() => {
    if (props.data?.id) {
      return convertTokenIdNft(props.data?.id?.tokenId as string);
    }
    return;
  }, [props.data]);

  const { data: priceContract, isLoading: isLoadingPrice } = useReadContract({
    abi,
    address: import.meta.env.VITE_ADDRESS_NFT as `0x${string}`,
    functionName: "getListingData",
    args: [[tokenId]],
  });

  const maxEnergy = getAttributes(
    props.data.metadata?.attributes || [],
    "Energy"
  );
  const maxEarn = getAttributes(
    props.data.metadata?.attributes || [],
    "Max Earn"
  );

  const price = convertWei(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Number((priceContract as any)?.[0]?.price || 0),
    18
  );

  function handleChoose() {
    props?.onChoose?.({
      ...props.data,
      price,
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
            src={props.data?.media?.[0]?.gateway}
            alt={props.data?.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-foreground/60">Price</div>
            {isLoadingPrice ? (
              <LoadingDots />
            ) : (
              <div className="flex items-center gap-1 font-medium">
                <div className="bg-white rounded-full p-1 border border-background">
                  <IconEthereum className="h-4 w-4" />
                </div>
                {price}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-primary">
              <Coins className="h-4 w-4" />
              {maxEarn} ETH
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <Zap className="h-4 w-4" />
              {maxEnergy}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
