import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import { TerminalSquareIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex sm:min-h-[87.5vh] min-h-[82vh] flex-col sm:items-center justify-center text-center sm:py-8 py-14">
      <h1 className="text-[4.80rem]  md:text-[6.5rem] leading-8 sm:px-8 md:leading-[4.5rem] font-bold md:mb-4 mb-9 sm:text-center font-pixel">
        MATSCRAFT
      </h1>
      <p className="mb-8 md:text-lg text-base  max-w-[1200px] text-muted-foreground text-left text-center">
        Play-to-Earn Minecraft server by MallardLabs, where players can earn
        $MATS through mining, trading, and other in-game activities.
      </p>
      <div className="sm:flex sm:flex-row grid grid-cols-2 items-center sm;gap-5 gap-3 mb-8">
        <Link
          href={`/docs${page_routes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          MatsCraft Wiki
        </Link>
        <Link
          href="/blog"
          className={buttonVariants({
            variant: "secondary",
            className: "px-6",
            size: "lg",
          })}
        >
          Read Blog
        </Link>
      </div>
      <div className="text-muted-foreground flex items-center gap-2 mx-auto">
        <TerminalSquareIcon className="w-5 h-5 sm:mr-1 mt-0.5" />
        <span className="line-through">
          {" "}
          {"matscraft.mallardlabs.xyz:19132"}
        </span>
      </div>
    </div>
  );
}
