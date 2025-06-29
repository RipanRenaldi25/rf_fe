// components/Dashboard/SidebarWrapper.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { WeekSummaryContext } from "@/context/WeekSummaryContext";
import { makeCapitalizeText } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useContext, useMemo } from "react";
import { BsCalculator } from "react-icons/bs";
import { FiActivity } from "react-icons/fi";
import { MdDashboard, MdOutlineProductionQuantityLimits } from "react-icons/md";

interface SidebarWrapperProps {
  setShowModal: any;
}

// Gunakan memo untuk mencegah rerender tanpa perlu
const SidebarWrapper = ({ setShowModal }: SidebarWrapperProps) => {
  console.log("wrapper rerendered");
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
      {
        menu: "Product",
        url: "/dashboard/product?page=1",
        isActive: pathName === "/dashboard/product",
        icon: MdOutlineProductionQuantityLimits,
      },
    ],
    [pathName]
  );

  const { summary } = useContext(WeekSummaryContext);

  return (
    <SidebarContent className="bg-white gap-0">
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
                    <p className="tracking-widest">{data.total} Kg</p>
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
                  menu.isActive ? "bg-gray-200 text-black" : "text-gray-700"
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
    </SidebarContent>
  );
};

export default memo(SidebarWrapper);
