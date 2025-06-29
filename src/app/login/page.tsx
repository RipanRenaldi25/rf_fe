"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash, FaUserLarge } from "react-icons/fa6";
import { IoKey } from "react-icons/io5";
import { toast } from "react-toastify";
import { z } from "zod";

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characrter" }),
});

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmitHandler = async (values: z.infer<typeof LoginFormSchema>) => {
    const { success, data, message } = await login(values);

    if (!success || !data) {
      toast.error(message);
      return;
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    toast.success(message, {
      onClose: () => {
        router.replace("/dashboard");
      },
      autoClose: 1000,
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.replace("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen flex relative items-center">
      <div className="w-1/2 flex flex-col items-center gap-10">
        <div>
          <Image src={"/logo.png"} alt="logo" width={70} height={70} />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold mb-6">Sign In</p>
          <Form {...form}>
            <form
              className="w-full max-w-sm space-y-4"
              onSubmit={form.handleSubmit(onSubmitHandler)}
              method="POST"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="rounded-lg overflow-hidden">
                      <div className="flex items-center">
                        <div className="bg-[#504B38] text-white h-full flex items-center justify-center p-2">
                          <FaUserLarge />
                        </div>
                        <FormControl>
                          <Input type="text" placeholder="Email" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage className="text-sm text-red-500 mt-1 px-2" />
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem className="overflow-hidden rounded-lg relative">
                      <div className="flex items-center relative">
                        <div className="flex items-center bg-[#504B38] justify-center p-2 text-white">
                          <IoKey />
                        </div>
                        <FormControl>
                          <Input
                            type={`${showPassword ? "text" : "password"}`}
                            placeholder="password"
                            {...field}
                          />
                        </FormControl>

                        <span
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                        >
                          {showPassword ? (
                            <FaRegEye className="size-5" />
                          ) : (
                            <FaRegEyeSlash className="size-5" />
                          )}
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex flex-col gap-10">
                <Link
                  href={"/forgot-password"}
                  className="text-sm text-gray-500 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </Link>
                <div className="flex flex-col gap-4 ">
                  <Button
                    type="submit"
                    className="bg-[#544b3d] text-white py-2 rounded-lg cursor-pointer"
                  >
                    Login
                  </Button>
                  <Button
                    type="button"
                    className="bg-[#544b3d] text-white py-2 rounded-lg"
                    asChild
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-1/2 h-screen relative">
        <Image
          src={"/login.png"}
          alt="side-image"
          fill
          className="w-full h-full object-cover object-center "
        />
      </div>
    </div>
  );
}
