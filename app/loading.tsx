import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="flex items-center text-sm">
        <Loader2 className="animate-spin mr-2" />
        Loading...
      </span>
    </div>
  );
}
