"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

type Team = {
  label: string;
  value: string;
};

interface UserBoxProps {
  user: User | null;
}

export default function UserBox({ user }: UserBoxProps) {
  return (
    <Button
      variant="outline"
      className="flex items-center justify-start space-x-3 p-3 rounded-md bg-muted"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={`https://avatar.vercel.sh/png`}
          className="grayscale"
        />
        <AvatarFallback>{user?.firstName?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="font-medium text-base">{user?.firstName} {user?.lastName}</span>
    </Button>
  );
}