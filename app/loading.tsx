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
      </span>
    </div>
  );
}
