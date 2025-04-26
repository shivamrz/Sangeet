"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";


export function Appbar() {
    const session=useSession();
    
    return (
        <header className="w-full bg-transparent py-4">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* App Logo and Name */}
                <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-1 rounded-full">
                    <div className="bg-slate-900 p-2 rounded-full">
                    <Music2 className="h-6 w-6 text-violet-400" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                    Sangeet
                </h1>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Sign In Button */}
                    {session.data?.user ? (
                        <Button
                        onClick={() => signOut({callbackUrl: "/"})}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                        >
                        Logout
                        </Button>
                    ) : (
                        <Button
                        onClick={() => signIn(undefined, {callbackUrl: "/dashboard"})}
                        className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                        >
                        Sign In
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );        
}