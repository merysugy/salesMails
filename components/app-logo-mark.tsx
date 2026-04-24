import Image from "next/image";

import { cn } from "@/lib/utils";

type AppLogoMarkProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function AppLogoMark({
  className,
  imageClassName,
  priority,
}: AppLogoMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center leading-none",
        className,
      )}
    >
      <Image
        src="/logo.svg"
        alt=""
        width={74}
        height={50}
        className={cn(
          "h-11 w-auto max-w-[4.75rem] object-contain object-center md:h-12",
          imageClassName,
        )}
        priority={priority}
      />
    </span>
  );
}
