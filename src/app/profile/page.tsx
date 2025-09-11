"use client";
// src/app/profile/page.tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, User as FirebaseUser } from "firebase/auth";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";
import { ChevronLeft } from "lucide-react";

export default function Profile() {
  const { signOut } = useUserStore();
  const router = useRouter();
  const auth = getAuth();

  const [displayName, setDisplayName] = useState<string>("User");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const user: FirebaseUser | null = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName ?? "User");
      setEmail(user.email ?? "");
    }
  }, [auth]);

  const goBack = () => {
    router.back();
  };

  const handleSignOut = () => {
    signOut().then(() => router.push("/"))
  }

  return (
    <>
      <section className="max-w-lg mx-auto p-6 space-y-6">
        <div className="header flex justify-between items-center">
          <button onClick={goBack} className="pr-4 py-2 text-gray-800 rounded">
            <ChevronLeft />
          </button>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        {/* User Info */}
        <Card>
          <CardContent className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/images/avatar.jpg" alt="User avatar" />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{displayName}</p>
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
            </div>
          </CardContent>
        </Card>

        {/* General Section */}
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Edit Profile</button>
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Notifications</button>
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Wishlist</button>
          </CardContent>
        </Card>

        <Separator />

        {/* Legal Section */}
        <Card>
          <CardHeader>
            <CardTitle>Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Terms of Use</button>
            <button className="w-full text-left py-2 hover:bg-gray-100 rounded">Privacy Policy</button>
          </CardContent>
        </Card>

        <Separator />

        {/* Personal Section */}
        <Card>
          <CardHeader>
            <CardTitle>Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left py-2 text-red-600 hover:bg-red-50 rounded">Report a Bug</button>
            <button
              className="w-full text-left py-2 text-red-600 hover:bg-red-50 rounded"
              onClick={handleSignOut }
            >
              Logout
            </button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
