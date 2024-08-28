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
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login successful");
      clearForm();
      router.push("/");
    }
  };

  const clearForm = () => {
    (document.getElementById("email") as HTMLInputElement).value = "";
    (document.getElementById("password") as HTMLInputElement).value = "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100">
        <CardHeader>
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <BeanIcon className="w-6 h-6" />
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
                  htmlFor="email"
                  className="text-sm font-medium text-gray-200"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
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
interface BeanIconProps extends React.SVGProps<SVGSVGElement> {}
function BeanIcon(props: BeanIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z" />
      <path d="M5.341 10.62a4 4 0 1 0 5.279-5.28" />
    </svg>
  );
}
