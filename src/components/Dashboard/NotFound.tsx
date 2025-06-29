"use client";
import Image from "next/image";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { ModalContext } from "@/context/Modal";

const NotFound = () => {
  const { setShowModal } = useContext(ModalContext);
  return (
    <section className="w-full flex flex-col justify-center items-center gap-4 h-full min-h-screen">
      <Image
        src="/not-found.png"
        alt="notfound image"
        width={300}
        height={300}
      />
      <h1>Uups! Maaf belum ada data, coba tambahkan data terlebih dahulu</h1>
      <Button
        type="button"
        className="bg-[#1CAFB4]"
        onClick={() => setShowModal(true)}
      >
        Tambah Data
      </Button>
    </section>
  );
};

export default NotFound;
