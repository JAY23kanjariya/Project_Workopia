"use client";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Error</h1>
            <p className="text-lg mb-6">Something went wrong.</p>
            <button onClick={() => router.back()} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Go Back</button>
        </div>
    );
}