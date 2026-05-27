import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-black text-black mb-4">404</h1>
        <p className="text-gray-500 text-lg mb-8">Page not found.</p>
        <Link href="/">
          <Button className="bg-[#E50914] hover:bg-[#b40710] text-white font-semibold">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
