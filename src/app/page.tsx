"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInitialUsername } from "@/lib/utils";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { TbCheckbox } from "react-icons/tb";
import { VscQuote } from "react-icons/vsc";

const testimonialData = [
  {
    content:
      "Remnant Flow makes fabric waste management simple and effective. A must-have for every garment business!",
    profile: {
      imageUrl: "/default-photo.jpg",
      fullName: "John Doe",
      username: "John_Doe",
    },
  },
  {
    content:
      "Remnant Flow makes fabric waste management simple and effective. A must-have for every garment business!",
    profile: {
      imageUrl: "/default-photo.jpg",
      fullName: "John Doe",
      username: "John_Doe",
    },
  },
  {
    content:
      "Remnant Flow makes fabric waste management simple and effective. A must-have for every garment business!",
    profile: {
      imageUrl: "/default-photo.jpg",
      fullName: "John Doe",
      username: "John_Doe",
    },
  },
  {
    content:
      "Remnant Flow makes fabric waste management simple and effective. A must-have for every garment business!",
    profile: {
      imageUrl: "/default-photo.jpg",
      fullName: "John Doe",
      username: "John_Doe",
    },
  },
  {
    content:
      "Remnant Flow makes fabric waste management simple and effective. A must-have for every garment business!",
    profile: {
      imageUrl: "/default-photo.jpg",
      fullName: "John Doe",
      username: "John_Doe",
    },
  },
  {
    content:
      "Remnant Flow makes fabric waste management simple and effective. A must-have for every garment business!",
    profile: {
      imageUrl: "/default-photo.jpg",
      fullName: "John Doe",
      username: "John_Doe",
    },
  },
];

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.replace("/dashboard");
    }
  }, []);
  return (
    <article className="px-4 py-3 space-y-8">
      <header className="flex justify-between items-center sticky top-0 bg-white z-95 py-4">
        <div className="flex gap-2 items-center">
          <Image src="/logo.png" alt="logo" width={30} height={30} />
          <h1 className="text-lg font-semibold">RemnantFlow</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant={"outline"} asChild>
            <Link href={"/register"}>Register</Link>
          </Button>
          <Button asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
        </div>
      </header>
      <main className="space-y-10">
        <section className="hero relative p-8 rounded-xl overflow-hidden flex gap-5  after:absolute after:inset-0 after:bg-black/5 ">
          <div className="absolute bg-cover bg-center opacity-90 inset-0 bg-[url('/hero-bg.png')]"></div>
          <div className="absolute inset-0 bg-cover bg-center opacity-60" />
          <div className="w-1/2 flex flex-col justify-between relative z-10">
            <h1 className="text-6xl font-bold">Track, Manage, and Reuse</h1>
            <div className="text-xl font-semibold">
              <p>Start managing your fabric waste smarter</p>
              <p>Use Remnant Flow for efficient, sustainable production</p>
            </div>
            <div>
              <Button className="bg-[#504B38] cursor-pointer " asChild>
                <Link href={"/register"}>Get Started</Link>
              </Button>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-center z-10">
            <Image
              src="/hero-image.png"
              alt="hero image"
              width={350}
              height={100}
              className="object-cover object-center"
            />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-2 text-3xl font-semibold items-center justify-center">
            <h1>Let’s separate the following categories for better</h1>
            <h1> order and efficiency!</h1>
          </div>
          <div className="grid grid-cols-3 w-full gap-10">
            <div className="relative p-8 h-[500px]">
              <Image className="absolute" fill src={"/card1.png"} alt="card1" />
              <div className="relative w-full h-full flex flex-col">
                <div className="text-white flex items-center gap-2 rounded-full bg-[#504B38] px-4 py-1 w-min">
                  <div className="size-2 rounded-full bg-white"></div>
                  <h1>Reutilization</h1>
                </div>
                <Card className="bg-white/70 mt-10 ">
                  <CardContent className="">
                    <p>
                      Sisa bahan yang memerlukan proses tambahan (misalnya
                      dipotong, dijahit ulang, disusun kembali) sebelum dapat
                      dimanfaatkan untuk produksi baru.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative  p-8">
              <Image className="absolute" fill src={"/card2.png"} alt="card1" />
              <div className="relative">
                <div className="text-white flex items-center gap-2 rounded-full bg-[#504B38] px-4 py-1 w-min">
                  <div className="size-2 rounded-full bg-white"></div>
                  <h1>Waste</h1>
                </div>
                <Card className="bg-white/70 mt-10">
                  <CardContent className="">
                    <p>
                      Sisa bahan yang sudah tidak layak digunakan lagi, sehingga
                      hanya bisa dibuang atau didaur ulang di luar proses
                      produksi utama.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative   p-8">
              <Image className="absolute" fill src={"/card3.png"} alt="card1" />
              <div className="relative">
                <div className="text-white flex items-center gap-2 rounded-full bg-[#504B38] px-4 py-1 w-min">
                  <div className="size-2 rounded-full bg-white"></div>
                  <h1>Reuse</h1>
                </div>
                <Card className="bg-white/70 mt-10">
                  <CardContent className="">
                    <p>
                      Sisa bahan yang masih utuh atau dalam kondisi baik,
                      sehingga bisa langsung digunakan kembali untuk produksi
                      tanpa melalui proses tambahan.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Why Choose Remnant Flow?</h1>
            <p className="text-lg font-semibold">Smart. Sustainable. Simple.</p>
          </div>
          <div className="flex gap-10">
            <Image
              src={"/hero-image2.png"}
              alt="hero image 2"
              height={200}
              width={300}
              className="object-cover objec-center"
            />
            <div className="flex-1 flex flex-col gap-4 justify-around">
              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg text-lg font-semibold">
                <TbCheckbox />
                <h1>Easy Tracking</h1>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg text-lg font-semibold">
                <TbCheckbox />
                <h1>Minimize Waste</h1>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg text-lg font-semibold">
                <TbCheckbox />
                <h1>Data-Driven Decisions</h1>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg text-lg font-semibold">
                <TbCheckbox />
                <h1>Cloud-Based & Accessible</h1>
              </div>
              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg text-lg font-semibold">
                <TbCheckbox />
                <h1>Sustainable Production Support</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <Image alt="logo" src={"/logo.png"} width={60} height={60} />
        </section>

        <section className="bg-gray-100 flex items-center justify-around py-8 ">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-5xl font-bold">2025</h1>
            <h1 className="font-semibold">Remnant Founded</h1>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-5xl font-bold">50K+</h1>
            <h1 className="font-semibold">Active User</h1>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-5xl font-bold">1K+</h1>
            <h1 className="font-semibold">Active Partner</h1>
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <div className="flex flex-col items-center gap-3 justify-center">
            <div className="px-4 rounded-sm  border-2 w-min text">
              <h1>Testimonial</h1>
            </div>
            <h1 className="font-bold text-3xl">Our Trusted Client</h1>
          </div>

          <div className="grid grid-cols-3 grid-rows-2 gap-5">
            {testimonialData.map((val, i) => {
              return (
                <Card className="shadow-md" key={i}>
                  <CardContent>
                    <div className="p-3 rounded-full border-1 w-min font-thin">
                      <VscQuote className="text-gray-400 size-5" />
                    </div>
                    <h1>
                      Remnant Flow makes fabric waste management simple and
                      effective. A must-have for every garment business!
                    </h1>
                    <div className="mt-8 space-y-2">
                      <hr />
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={val?.profile?.imageUrl ?? ""} />
                          <AvatarFallback>
                            {getInitialUsername(val?.profile?.fullName ?? "RN")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <h1 className="font-bold ">{val.profile.fullName}</h1>
                          <h1 className="text-xs">{val.profile.username}</h1>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="absolute left-0 right-0"></footer>
    </article>
  );
}
