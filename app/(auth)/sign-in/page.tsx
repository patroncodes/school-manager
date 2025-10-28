"use client";

import { defaultHome } from "@/lib/settings";
import { cn } from "@/lib/utils";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [isTypingUsername, setIsTypingUsername] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  useEffect(() => {
    const accessLevel = user?.publicMetadata?.accessLevel as string | undefined;

    if (accessLevel) {
      router.push(defaultHome[accessLevel]);
    }
  }, [user, router]);

  const togglePasswordState = () => {
    setShowPassword(!showPassword);
  };

  const inputClassname =
    "ring-0 focus:outline-none border-b border-orange-500 transition-all ease-in-out duration-300";

  return (
    <div className="bg-lamaSkylight flex-center h-screen w-screen">
      <div className="hidden h-full lg:flex lg:w-1/2">
        <Image
          src="/banner.png"
          alt="banner"
          width={400}
          height={600}
          className="h-full w-full"
        />
      </div>

      <div className="flex-center h-full w-full lg:w-1/2">
        <SignIn.Root fallback={<div>Loading...</div>}>
          <SignIn.Step
            name="start"
            className="flex w-full flex-col gap-4 rounded-md p-12 lg:w-[34rem]"
          >
            <div className="my-5 flex-center w-full flex-col">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  width={400}
                  height={400}
                  className="h-48 w-48 rounded-full"
                />
              </Link>

              <h2 className="text-gray-500">Sign in to your account</h2>
            </div>

            <Clerk.GlobalError className="text-sm text-red-300" />

            <div className="flex flex-col gap-4">
              <Clerk.Field
                name="identifier"
                className={cn(
                  "flex flex-col transition-all duration-300 ease-in-out",
                  isTypingUsername && "gap-1",
                )}
              >
                <Clerk.Label className="text-sm text-gray-400">
                  Username
                </Clerk.Label>
                <Clerk.Input
                  className={cn(
                    "",
                    inputClassname,
                    isTypingUsername && "rounded-b-md px-3 py-1",
                  )}
                  type="text"
                  onFocus={() => setIsTypingUsername(true)}
                  onBlur={(e) => {
                    if (e.target.value.trim() === "") {
                      setIsTypingUsername(false);
                    }
                  }}
                  required
                  autoFocus
                />

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isTypingUsername ? "max-h-10" : "max-h-0",
                  )}
                >
                  <Clerk.FieldError className="text-xs text-red-500" />
                </div>
              </Clerk.Field>

              <Clerk.Field
                name="password"
                className={cn(
                  "flex flex-col transition-all duration-300 ease-in-out",
                  isTypingPassword && "gap-1",
                )}
              >
                <Clerk.Label className="text-sm text-gray-400">
                  Password
                </Clerk.Label>
                <div className="relative w-full">
                  <Clerk.Input
                    className={cn(
                      "w-full",
                      inputClassname,
                      isTypingPassword && "rounded-b-md px-3 py-1",
                    )}
                    type={showPassword ? "text" : "password"}
                    onFocus={() => setIsTypingPassword(true)}
                    onBlur={(e) => {
                      if (e.target.value.trim() === "") {
                        setIsTypingPassword(false);
                      }
                    }}
                    required
                  />

                  <div className="absolute top-1/2 right-2 w-4 -translate-y-1/2 cursor-pointer bg-white">
                    {showPassword ? (
                      <EyeOff
                        color="#99a1af"
                        onClick={togglePasswordState}
                        size={18}
                      />
                    ) : (
                      <Eye
                        color="#99a1af"
                        onClick={togglePasswordState}
                        size={18}
                      />
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isTypingPassword ? "max-h-10" : "max-h-0",
                  )}
                >
                  <Clerk.FieldError className="text-xs text-red-500" />
                </div>
              </Clerk.Field>
            </div>

            <SignIn.Action
              submit
              className="my-3 cursor-pointer rounded-full bg-gradient-to-bl from-orange-500 via-orange-400 to-orange-600 py-5 text-base text-white"
            >
              Sign In
            </SignIn.Action>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
};

export default LoginPage;
