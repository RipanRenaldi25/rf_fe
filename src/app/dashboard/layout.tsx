"use client";
import { AddRakDialog } from "@/components/Dashboard/Activities/AddRactDialog";
import { Modal } from "@/components/Dashboard/Activities/Modal";
import NavHeader from "@/components/Dashboard/NavHeader";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { InventoryContext } from "@/context/InventoryContext";
import { ModalContext } from "@/context/Modal";
import { ShelfContext } from "@/context/ShelfContext";
import {
  WeekSummaryContext,
  WeekSummaryProvider,
} from "@/context/WeekSummaryContext";
import { getAllInventories, getShelfs } from "@/lib/api/inventoryApi";
import { getLastWeekCategorySummary } from "@/lib/api/StatisticAPI";
import { getUserLogin } from "@/lib/api/userApi";
import { makeCapitalizeText } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BsCalculator } from "react-icons/bs";
import { FiActivity } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { toast } from "react-toastify";
import SidebarWrapper from "./SidebarWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Layout rendered");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddRact, setShowAddRact] = useState<boolean>(false);
  const pathName = usePathname();

  const menus = useMemo(
    () => [
      {
        menu: "Dashboard",
        url: "/dashboard",
        isActive: pathName === "/dashboard",
        icon: MdDashboard,
      },
      {
        menu: "Activites",
        url: "/dashboard/activities",
        isActive: pathName === "/dashboard/activities",
        icon: FiActivity,
      },
      {
        menu: "Calculator",
        url: "/dashboard/calculator",
        isActive: pathName === "/dashboard/calculator",
        icon: BsCalculator,
      },
    ],
    [pathName]
  );

  const [fetchedData, setFetchedData] = useState<
    {
      type: string;
      total: number;
    }[]
  >([]);

  const [inventoryData, setInventoryData] = useState<
    ITransactionWithMaterial[]
  >([]);

  useEffect(() => {
    async function fetchUserData() {
      const { message, success, data } = await getUserLogin();
      if (!success) {
        return;
      }
      if (JSON.stringify(data) !== JSON.stringify(userData)) {
        {
          setUser(data);
        }
      }
    }

    async function fetchShelf() {
      const { message, success, data } = await getShelfs();
      if (!success || !data) {
        return;
      }
      setShelfs(data);
    }

    async function fetchInventoryData() {
      const { message, success, data } = await getAllInventories();
      if (!success) {
        return;
      }

      setInventoryData(data.data);
    }

    Promise.all([fetchUserData(), fetchShelf(), fetchInventoryData()]);
  }, []);

  const { summary } = useContext(WeekSummaryContext);

  const [user, setUser] = useState<IUser2>({
    company_name: "",
    email: " ",
    id: "",
    name: "",
    phone_number: "",
  });

  const userData = useMemo(() => user, [user]);

  const [shelfs, setShelfs] = useState<IShelf[]>([]);

  return (
    <article>
      <NavHeader userData={userData} />
      <WeekSummaryProvider>
        <InventoryContext value={{ inventoryData, setInventoryData }}>
          <SidebarProvider>
            <main className="flex w-full">
              <div className="w-54">
                <Sidebar className="fixed left-0 top-18 " variant="sidebar">
                  {/* <SidebarContent className="bg-white gap-0">
                    <SidebarGroup>
                      <header className="flex items-center justify-center py-4 border-b-1 border-black font-bold">
                        <p>Weekly Snap</p>
                      </header>
                      <SidebarGroupContent className="border-black ">
                        <SidebarMenu className="px-2 py-4 border-b-1 border-black">
                          {summary?.length > 0 ? (
                            summary.map((data: any) => (
                              <SidebarMenuItem key={data.type}>
                                <div className="flex items-center justify-between ">
                                  <p>{makeCapitalizeText(data.type)}</p>
                                  <p className="tracking-widest">
                                    {data.total} Kg
                                  </p>
                                </div>
                              </SidebarMenuItem>
                            ))
                          ) : (
                            <h1>Belum ada data</h1>
                          )}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup className=" border-b-1 border-black p-6 ">
                      <SidebarMenu className="flex flex-col gap-4">
                        <SidebarMenuItem className=" shadow-gray-400">
                          <SidebarMenuButton asChild>
                            <Button
                              className="cursor-pointer bg-[#99BC85]/10 text-black font-bold shadow-[2px_2px_2px_rgba(0,0,0,0.1)]"
                              onClick={() => setShowModal(true)}
                            >
                              Input
                            </Button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className=" shadow-gray-400">
                          <SidebarMenuButton asChild>
                            <Button
                              className="bg-[#BF3131]/10 text-black font-bold shadow-[2px_2px_2px_rgba(0,0,0,0.1)]"
                              asChild
                            >
                              <Link href="/dashboard/output">Output</Link>
                            </Button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroup>

                    <SidebarGroup>
                      <SidebarGroupLabel className="text-md font-semibold">
                        User Panel
                      </SidebarGroupLabel>
                      <SidebarGroupContent className="p-2 relative">
                        <SidebarMenu>
                          {menus.map((menu, i) => (
                            <SidebarMenuItem
                              key={menu.url}
                              className={`cursor-pointer pl-4 py-2 rounded-md transition-colors  ${
                                menu.isActive
                                  ? "bg-gray-200 text-black"
                                  : "text-gray-700"
                              }`}
                            >
                              <SidebarMenuButton asChild>
                                <Link href={menu.url} className="text-lg">
                                  <span>
                                    <menu.icon />
                                  </span>
                                  {menu.menu}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarContent> */}
                  <SidebarWrapper setShowModal={setShowModal} />
                </Sidebar>
              </div>
              <article className="w-[calc(100%-256px)] p-20">
                <ModalContext
                  value={{
                    showModal,
                    setShowModal,
                    showAddRact,
                    setShowAddRact,
                  }}
                >
                  {showModal && (
                    <div
                      className="h-screen w-full bg-[rgba(0,0,0,.3)] fixed inset-0 z-95"
                      onClick={() => {
                        setShowModal(false);
                        setShowAddRact(false);
                      }}
                    ></div>
                  )}
                  {showAddRact && (
                    <div
                      className="h-screen w-full bg-[rgba(0,0,0,.3)] fixed inset-0 z-[96]"
                      onClick={() => {
                        setShowModal(false);
                        setShowAddRact(false);
                      }}
                    ></div>
                  )}
                  <ShelfContext value={{ shelfs, setShelfs }}>
                    <Modal showModal={showModal} setShowModal={setShowModal} />
                    {showAddRact && (
                      <AddRakDialog
                        open={showAddRact}
                        onOpenChange={setShowAddRact}
                      />
                    )}
                    {children}
                  </ShelfContext>
                </ModalContext>
              </article>
            </main>
          </SidebarProvider>
        </InventoryContext>
      </WeekSummaryProvider>
    </article>
  );
}
