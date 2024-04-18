"use client";
import Image from "next/image";
import ThemeToggle from "../theme/ThemeToggle";
import { LOGO_IMAGE, SHOPNAME, enfont, lfont } from "@/constants/global";
import Searchbar from "@/components/SearchBar";
import UserAccountNav from "./user-account-nav";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <>
      <div className="grid grid-cols-8 w-full bg-gray-200 dark:bg-gray-900 text-center items-center">
        <div className="relative flex justify-center justify-self-start left-5">
          <Link href="/">
            <Image src={LOGO_IMAGE} height={10} width={80} alt="logo"></Image>
          </Link>
        </div>
        <div className="relative justify-self-start letf-5">
          <p className={`${lfont.className} text-4xl`}>{SHOPNAME}</p>
        </div>
        <div className="flex justify-start col-start-3 gap-10 text-xl">
          <Link href="/copywrite" target="_top">
            版权说明
          </Link>
        </div>
        {/*
        <div className="col-start-6 col-end-8">
          <Searchbar></Searchbar>
        </div>
        */}
        <div className="flex justify-around col-start-8">
          <div className="user">
            <UserAccountNav></UserAccountNav>
          </div>
          {/*

          <div className="flex flex-row gap-2 text-black/75 hover:text-black/90 dark:text-white/75 hover:dark:text-white/90 cursor-pointer items-center">
            <ShoppingCartIcon />
            <p>{itemCount}</p>
          </div>
          */}
          <div className="flex items-center">
            <ThemeToggle></ThemeToggle>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
