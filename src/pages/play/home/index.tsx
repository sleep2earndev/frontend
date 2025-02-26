import IconEnergy from "@/components/icon/energy";
import IconPlus from "@/components/icon/plus";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink, useNavigate } from "react-router";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import FadeWrapper from "@/components/animation/fade";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { fetchNFTs } from "@/api/nft";

export default function HomePage() {
  const navigate = useNavigate();
  const { address } = useAccount();

  const { data } = useQuery({
    queryKey: ["nfts-user", address],
    queryFn: () => fetchNFTs(address as string),
  });

  return (
    <FadeWrapper className="p-4">
      <Card className="border-2 border-white">
        <CardContent>
          <div className="pt-6">
            <NavLink
              to={"/play/marketplace"}
              className="p-12 flex justify-center items-center flex-col gap-2"
              role="button"
            >
              <IconPlus className="w-12 h-12 text-white/30" />
              <p className="text-white/30">Add My Pillow</p>
            </NavLink>
          </div>
        </CardContent>
      </Card>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <IconEnergy />
          <div className="flex-1">
            <Progress value={50} className="text-primary" text="1/2" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button
          className="text-white"
          onClick={() => {
            navigate("/play/sleep");
          }}
        >
          START
        </Button>
      </div>
    </FadeWrapper>
  );
}
