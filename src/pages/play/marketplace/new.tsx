import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, Coins, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import Image from "@/components/ui/image";
import { NftData } from "@/components/nft/card-nft";
import { Navigate, useNavigate } from "react-router";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { fetchNFTs } from "@/api/nft";
import ListNft from "@/components/nft/list-nft";
import FadeWrapper from "@/components/animation/fade";
import abi from "@/abi/sleepnft.json";
import { parseEther } from "viem";
import { toast } from "sonner";
import { useLoading } from "@/components/loading-provider";
import IconMonad from "@/components/icon/monad";

export default function Marketplace() {
  const [selectedNFT, setSelectedNFT] = useState<
     
    (NftData) | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [sortBy, setSortBy] = useState("price-low");
  // const [isPurchasing, setIsPurchasing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasedNFT, setPurchasedNFT] = useState<
     
    (NftData) | null
  >(null);
  const { setLoading } = useLoading();


  const navigate = useNavigate();

  const { address } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: ["nfts", import.meta.env.VITE_ADDRESS_NFT],
    queryFn: () => fetchNFTs(import.meta.env.VITE_ADDRESS_NFT),
    enabled: !!address,
  });

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
    isLoading: isLoadingTransaction,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash,
    retryCount: 0,
    query: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchIntervalInBackground: false,
      refetchInterval: false,
      retry: false,
    },
  });

  const filteredNFTs = (data || [])?.filter((nft) => {
    const matchesSearch =
      nft.token.name || "".toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  function handleChoose(nft: NftData) {
    setSelectedNFT({
      ...nft,
    });
  }

  const handlePurchase = async (nft: NftData) => {
    // const tokenId = convertTokenIdNft(nft?.id?.tokenId as string);
    const tokenId = nft.token.tokenId
    writeContract({
      abi,
      address: import.meta.env.VITE_ADDRESS_NFT as `0x${string}`,
      functionName: "buyItem",
      args: [tokenId],
      value: parseEther(`${nft.price}`),
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setPurchasedNFT(selectedNFT);

      setShowSuccess(true);
      setSelectedNFT(null);
    }
  }, [isSuccess]);

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
    setLoading(isLoadingTransaction);
  }, [isLoadingTransaction]);

  if (!address) {
    return <Navigate to="/play/wallet" />;
  }

  return (
    <FadeWrapper className="min-h-screen bg-background text-foreground mb-32">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-background/80 via-background to-background/95" />
        {/* Decorative elements */}
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="mt-2 text-foreground/60">Find and buy sleep NFTs</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <Input
                placeholder="Search NFTs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 pl-10 text-foreground placeholder:text-foreground/40 border-0"
              />
            </div>
          </div>
        </div>
        {/* NFT Grid */}
        <ListNft
          data={filteredNFTs}
          loading={isLoading}
          version="new"
          onChoose={handleChoose}
        />

        {/* NFT Detail Dialog */}
        <Modal title="" open={!!selectedNFT} onOpenChange={() => setSelectedNFT(null)}>
          {selectedNFT && (
            <div>
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={selectedNFT.token?.image}
                  alt={selectedNFT.token?.name}
                  className="h-full w-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
                <div className="absolute bottom-0 w-full p-6">
                  <h2 className="text-2xl font-bold">{selectedNFT.token?.name}</h2>
                </div>
              </div>

              <div>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-muted/50 p-4 backdrop-blur-sm">
                    <div className="mb-1 text-sm text-foreground/60">
                      Max Earn Rate
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                      <Coins className="h-5 w-5" />
                      {selectedNFT.maxEarn} MON
                    </div>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4 backdrop-blur-sm">
                    <div className="mb-1 text-sm text-foreground/60">
                      Energy
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-yellow-500">
                      <Zap className="h-5 w-5" />
                      {selectedNFT.maxEnergy}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-2 text-sm text-foreground/60">Seller</div>
                  <div className="rounded-lg bg-muted/50 px-3 py-2 font-mono text-sm backdrop-blur-sm">
                    {selectedNFT.token?.contract}
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-sm text-foreground/60 mb-2">Price</div>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      <div className="bg-white rounded-full p-1 border border-background">
                        <IconMonad className="h-6 w-6" />
                      </div>
                      {selectedNFT.price}
                    </div>
                  </div>
                  <Button
                    className="px-8 py-6 text-lg hover:opacity-90"
                    onClick={() => handlePurchase(selectedNFT)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
                        Processing...
                      </div>
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Purchase Success Dialog */}
        <Modal
          title="Purchase Successful!"
          open={showSuccess}
          onOpenChange={setShowSuccess}
        >
          {purchasedNFT && (
            <div className="relative">
              <div className="relative">
                <div className="mb-8 flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="mb-6 flex items-center justify-center rounded-full "
                  >
                    <span className="text-4xl">🎉</span>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-foreground/60"
                  >
                    You are now the proud owner of <br />
                    {purchasedNFT.token.name}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6 overflow-hidden rounded-xl bg-muted/50 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={purchasedNFT?.token?.image}
                      alt={purchasedNFT.token.name}
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1 font-medium">{purchasedNFT.token.name}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-primary">
                          <Coins className="h-4 w-4" />
                          {purchasedNFT.maxEarn} MON
                        </div>
                        <div className="flex items-center gap-1 text-secondary">
                          <Zap className="h-4 w-4" />
                          {purchasedNFT.maxEnergy}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid gap-4"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent py-6 text-lg font-semibold hover:opacity-90 shadow-neon-purple"
                    onClick={() => {
                      setShowSuccess(false);
                      navigate("/play/sleep");
                    }}
                  >
                    Start Sleeping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-foreground/10 bg-muted/30 py-6 text-lg font-semibold hover:bg-muted/50 backdrop-blur-sm"
                    onClick={() => setShowSuccess(false)}
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </FadeWrapper>
  );
}
