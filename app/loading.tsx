import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="flex flox-col items-center text-sm">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={30}
          height={30}
          className="animate-pulse"
        />
        {/* <Loader2 className="animate-spin mr-2" /> */}
        {/* Loading... */}
      </span>
    </div>
  );
}
