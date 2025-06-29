import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

const NavHeader = ({ userData = {} }: { userData: any }) => {
  return (
    <header className="fixed top-0 left-0 right-0  z-5 h-18 bg-white">
      <div className="flex justify-between items-center border-b-3 py-2 px-4">
        <Link href={"/dashboard"}>
          <Image src="/logo.png" alt="logo" width={40} height={40} />
        </Link>
        <div className="flex items-center gap-2">
          <p>HI! {userData?.name}!</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar className="size-10">
                <AvatarImage src={"https://github.com/shadcn.png"} />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 text-center w-40 bg-white border-2 rounded-md">
              <DropdownMenuItem className="hover:bg-[rgba(255,255,255,.4)]">
                <Link
                  href="/"
                  onClick={() => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                  }}
                >
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default React.memo(NavHeader);
