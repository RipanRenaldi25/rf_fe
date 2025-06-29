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
import { Label } from "@/components/ui/label";
import { register } from "@/lib/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import { z } from "zod";

const RegisterSchema = z
  .object({
    company_name: z.string().nonempty({ message: "Company name is required" }),
    phone_number: z.string().min(5, {
      message: "Phone number atleast 5",
    }),
    email: z.string().email("email must be valid email"),
    password: z.string().min(6, {
      message: "Password at least 6 character",
    }),
    confirm_password: z
      .string()
      .min(6, { message: "Confirm_password at least 6 character" }),
  })
  .refine((data) => data.confirm_password === data.password, {
    message: "Password and confirm_password do not match",
    path: ["confirm_password"],
  });

export default function Register() {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      company_name: "",
      confirm_password: "",
      email: "",
      password: "",
      phone_number: "",
    },
  });
  const router = useRouter();

  const onSubmitHandler = async (
    values: Omit<z.infer<typeof RegisterSchema>, "confirm_password">
  ) => {
    const { message, success, data } = await register({
      company_name: values.company_name,
      email: values.email,
      name: values.company_name,
      password: values.password,
      phone_number: values.phone_number,
    });
    if (!success || !data) {
      toast.error(message);
      return;
    }
    toast.success(message, {
      autoClose: 1000,
      onClose: () => {
        router.replace("/login");
      },
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.replace("/dashboard");
    }
  }, []);

  return (
    <article className="min-h-screen flex">
      <section className="w-1/2 relative">
        <Image
          alt="background"
          src={"/register2.png"}
          fill
          className="w-full object-cover object-center"
        />
        <h1>Section 1</h1>
      </section>
      <section className="w-1/2 flex p-10 flex-col  gap-3">
        <div className="flex items-center justify-center">
          <Image src={"/logo.png"} alt="logo" width={50} height={50} />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label htmlFor="company_name">Nama Perusahaan</Label>
                    <FormControl>
                      <Input
                        type="text"
                        id="company_name"
                        placeholder="Nama Perusahaan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="phone_number"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label htmlFor="phone_number">No Telepon</Label>
                    <FormControl>
                      <Input
                        type="text"
                        id="phone_number"
                        {...field}
                        placeholder="Nomor Telepon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        id="email"
                        placeholder="Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          placeholder="Password"
                        />
                      </FormControl>
                      <span
                        onClick={() =>
                          setShowPassword((prevValue) => !prevValue)
                        }
                        className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <FaRegEye className="size-5" />
                        ) : (
                          <FaRegEyeSlash className="size-5 " />
                        )}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label htmlFor="confirm_password">
                      Konfirmasi Password
                    </Label>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Konfirmasi Password"
                        />
                      </FormControl>
                      <span
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() =>
                          setConfirmPassword((prevValue) => !prevValue)
                        }
                      >
                        {showConfirmPassword ? (
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

            <Button type="submit" className="bg-[#504B38]">
              Register
            </Button>
            <p className="flex items-center justify-center gap-2">
              <span className="opacity-50">Punya akun? </span>
              <Link href="/login" className="opacity-100 font-semibold">
                Log In
              </Link>
            </p>
          </form>
        </Form>
      </section>
    </article>
  );
}
