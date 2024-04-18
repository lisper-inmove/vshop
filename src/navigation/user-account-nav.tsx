"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { enfont } from "@/constants/global";
import { LTR_LOGOUT, LTR_MY_ORDERS, LTR_SETTING } from "@/constants/literals";
import useUser from "@/user/use-user";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const UserAccountNav = () => {
  const { userinfo, clearUserinfo } = useUser();
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        {userinfo.email ? (
          <Avatar className="flex items-center justify-center text-3xl bg-black/10 dark:bg-white/40 uppercase">
            <AvatarFallback className={`${enfont.className}`}>
              {userinfo.email.substring(0, 1)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link href="/userauth">
            <LogInIcon />
          </Link>
        )}
      </DropdownMenuTrigger>
      {userinfo.email ? (
        <DropdownMenuContent className="bg-white dark:bg-black w-60 translate-x-10 cursor-pointer">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5 leading-none">
              <p className="font-medium text-sm text-black dark:text-white">
                {userinfo.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              router.push("/order-list");
            }}
          >
            {LTR_MY_ORDERS}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={clearUserinfo}>
            {LTR_LOGOUT}
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  );
};

export default UserAccountNav;
