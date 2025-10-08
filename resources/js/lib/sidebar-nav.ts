import { SquareTerminal, Bot } from "lucide-react"

export const sidebarNav = {
  navMain: [
    {
      title: "Products",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Add New",
          url: "/admin/products/create",
        },
        {
          title: "List Products",
          url: "/admin/products",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Add New",
          url: "/admin/categories/create",
        },
        {
          title: "List Categories",
          url: "/admin/categories",
        },
      ],
    },
  ],
}
