"use client";
import { useState } from "react";
import { Button } from "@/components/login/button";
import { Input } from "@/components/login/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/login/card";
import { Label } from "@/components/login/label";
import { Checkbox } from "@/components/login/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import "../app/globals.css";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Logo from "@/components/logo";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const identifier = (document.getElementById("identifier") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;
    if (!identifier || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login successful");

      await fetch("/api/auth/session?update");

      if (session?.user?.role === "admin") {
        router.push("/admin_dash");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100">
        <CardHeader>
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Logo className="w-6 h-6" />
            <span className="text-lg font-bold">TravelSafe</span>
          </Link>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="identifier"
                  className="text-sm font-medium text-gray-200"
                >
                  Email or Username
                </Label>
                <Input
                  id="identifier"
                  placeholder="name@example.com or username"
                  type="text"
                  className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="Your Password"
                    type={showPassword ? "text" : "password"}
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-medium text-gray-200"
                >
                  Remember me
                </Label>
              </div>
              <div className="text-right">
                <a href="#" className="text-sm text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?
            <a href="/signup" className="text-blue-400 hover:underline mx-1">
              Signup
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
