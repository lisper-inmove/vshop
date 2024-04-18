"use client";
import React from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { trpcClient } from "@/trpc-config/client";
import { useRouter } from "next/navigation";
import {
  ACCONUT_CANNOT_BE_NULL,
  EMAIL_CANNOT_BE_NULL,
  LTR_EMAIL,
  LTR_PASSWORD,
  LTR_PHONE,
  LTR_SIGN_UP,
  LTR_CONFIRM_PASSWORD,
  PASSWORD_CANNOT_BE_NULL,
  PASSWORD_NOT_MATCHED,
  PHONE_CANNOT_BE_NULL,
  SIGNUP_FAILED,
  SIGNUP_SUCCESS,
  LTR_ALREADY_HAVE_ACCOUNT,
  LTR_SIGN_IN,
  LTR_HAVE_NO_ACCOUNT,
  SIGNIN_SUCCESS,
  SIGNIN_FAILED,
} from "@/constants/literals";
import useUser from "@/user/use-user";

export default function UserAuth() {
  // const searchParams = useSearchParams();
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signInAccount, setSignInAccount] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [isLogin, setIsLogin] = useState(false);
  const { toast } = useToast();
  const { setUserinfo } = useUser();

  const router = useRouter();

  const { mutate: signUp } = trpcClient.userRouter.signUp.useMutation({
    onSuccess: (user) => {
      toast({
        description: SIGNUP_SUCCESS,
        variant: "default",
      });
      setUserinfo({
        email: user.email,
        phone: user.phone,
        token: user.token,
        refreshToken: user.refreshToken,
      });
      router.push("/");
    },
    onError: (error) => {
      toast({
        description: SIGNUP_FAILED,
        variant: "destructive",
      });
    },
  });
  const { mutate: signIn } = trpcClient.userRouter.signIn.useMutation({
    onSuccess: (user) => {
      toast({
        description: SIGNIN_SUCCESS,
        variant: "default",
      });
      setUserinfo({
        email: user.email,
        phone: user.phone,
        token: user.token,
        refreshToken: user.refreshToken,
      });
      router.push("/");
    },
    onError: (error) => {
      toast({
        description: SIGNIN_FAILED,
        variant: "destructive",
      });
    },
  });

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUpPhone === "") {
      toast({
        description: PHONE_CANNOT_BE_NULL,
        variant: "destructive",
      });
      return;
    }
    if (signUpEmail === "") {
      toast({
        description: EMAIL_CANNOT_BE_NULL,
        variant: "destructive",
      });
      return;
    }
    if (signUpPassword === "") {
      toast({
        description: PASSWORD_CANNOT_BE_NULL,
        variant: "destructive",
      });
      return;
    }
    if (confirmPassword === "") {
      toast({
        description: PASSWORD_CANNOT_BE_NULL,
        variant: "destructive",
      });
      return;
    }
    if (signUpPassword !== confirmPassword) {
      toast({
        description: PASSWORD_NOT_MATCHED,
        variant: "destructive",
      });
      return;
    }
    signUp({
      email: signUpEmail,
      phone: signUpPhone,
      password: signUpPassword,
    });
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signInAccount === "") {
      toast({
        description: ACCONUT_CANNOT_BE_NULL,
        variant: "destructive",
      });
      return;
    }
    if (signInPassword === "") {
      toast({
        description: PASSWORD_CANNOT_BE_NULL,
        variant: "destructive",
      });
    }
    signIn({
      account: signInAccount,
      password: signInPassword,
    });
  };

  return !isLogin ? (
    <div className="mt-20 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-center text-neutral-800 dark:text-neutral-200">
        {LTR_SIGN_UP}
      </h2>

      <form className="my-8" onSubmit={handleSignUp}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="phone">{LTR_PHONE}</Label>
          <Input
            id="phone"
            placeholder="177********"
            type="phone"
            value={signUpPhone}
            onChange={(e) => setSignUpPhone(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">{LTR_EMAIL}</Label>
          <Input
            id="email"
            placeholder="xxx@email.com"
            type="email"
            value={signUpEmail}
            onChange={(e) => setSignUpEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">{LTR_PASSWORD}</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={signUpPassword}
            onChange={(e) => setSignUpPassword(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">{LTR_CONFIRM_PASSWORD}</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {LTR_SIGN_UP} &rarr;
          <BottomGradient />
        </button>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        <div className="text-center">
          {LTR_ALREADY_HAVE_ACCOUNT}
          <p
            className="inline text-blue-800 dark:blue-300 underline cursor-pointer"
            onClick={() => setIsLogin(true)}
          >
            {LTR_SIGN_IN}
          </p>
        </div>
      </form>
    </div>
  ) : (
    <div className="mt-20 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-center text-neutral-800 dark:text-neutral-200">
        {LTR_SIGN_IN}
      </h2>

      <form className="my-8" onSubmit={handleSignIn}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="account">
            {LTR_PHONE}/{LTR_EMAIL}
          </Label>
          <Input
            id="account"
            placeholder="177********/a@b.com"
            type="text"
            value={signInAccount}
            onChange={(e) => setSignInAccount(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">{LTR_PASSWORD}</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={signInPassword}
            onChange={(e) => setSignInPassword(e.target.value)}
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          {LTR_SIGN_IN} &rarr;
          <BottomGradient />
        </button>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        <div className="text-center">
          {LTR_HAVE_NO_ACCOUNT}
          <p
            className="inline text-blue-800 dark:blue-300 underline cursor-pointer"
            onClick={() => setIsLogin(false)}
          >
            {LTR_SIGN_UP}
          </p>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
