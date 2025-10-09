import { SquareTerminal, Bot, ShoppingBag, CalendarCheck } from "lucide-react"

export const sidebarNav = {
  navMain: [
    {
      title: "Products",
      url: "#",
      icon: ShoppingBag,
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
      icon: SquareTerminal,
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
    {
      title: "Tasks",
      url: "/admin/tasks",
      icon: CalendarCheck,
    },
  ],
}
