import IconEnergy from "@/components/icon/energy";
import IconPlus from "@/components/icon/plus";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "react-router";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import FadeWrapper from "@/components/animation/fade";

export default function HomePage() {
  return (
    <FadeWrapper className="p-4">
      <Card>
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
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <IconEnergy />
          <div className="flex-1">
            <Progress value={50} className="text-primary" text="1/2" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <Button className="text-white">START</Button>
      </div>
    </FadeWrapper>
  );
}
