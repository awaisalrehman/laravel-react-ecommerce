import { SquareTerminal, Bot, ShoppingBag, CalendarCheck } from "lucide-react"
import type { NavMainItem } from "@/types"

export const sidebarNav = {
  navMain: [
    {
      title: "Products",
      href: "#", // Use "#" for parents with children
      icon: ShoppingBag,
      items: [
        {
          title: "Add New",
          href: "/admin/products/create",
        },
        {
          title: "List Products",
          href: "/admin/products",
        },
      ],
    },
    {
      title: "Categories",
      href: "#", // Use "#" for parents with children
      icon: SquareTerminal,
      items: [
        {
          title: "Add New",
          href: "/admin/categories/create",
        },
        {
          title: "List Categories",
          href: "/admin/categories",
        },
      ],
    },
    {
      title: "Tasks",
      href: "/admin/tasks", // Direct link for items without children
      icon: CalendarCheck,
    },
  ] as NavMainItem[],
}