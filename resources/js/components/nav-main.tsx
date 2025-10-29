import { ChevronRight } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import type { NavMainItem } from "@/types"

export function NavMain({ items }: { items: NavMainItem[] }) {
  const { url: currentUrl } = usePage()
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())
  
  const getHref = (href: NavMainItem["href"]) =>
    typeof href === "string" ? href : href?.url ?? ""

  const normalizePath = (path: string) => path.replace(/\/+$/, "")

  const isItemActive = (item: NavMainItem) => {
    const current = normalizePath(currentUrl)
    const href = normalizePath(getHref(item.href))

    if (current === href || current.startsWith(href + "/")) return true

    if (item.items?.some((sub) => isSubItemActive(sub.href))) return true

    return false
  }

  const isSubItemActive = (href: NavMainItem["href"]) => {
    const current = normalizePath(currentUrl)
    const target = normalizePath(getHref(href))
    return current === target || current.startsWith(target + "/")
  }

  useEffect(() => {
    const initiallyOpen = new Set<string>()
    items.forEach((item) => {
      if (item.items && isItemActive(item)) {
        initiallyOpen.add(item.title)
      }
    })
    setOpenMenus(initiallyOpen)
  }, [items, currentUrl])

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev)
      newSet.has(title) ? newSet.delete(title) : newSet.add(title)
      return newSet
    })
  }

  const handleParentClick = (item: NavMainItem, event: React.MouseEvent) => {
    if (item.items?.length) {
      event.preventDefault()
      toggleMenu(item.title)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openMenus.has(item.title)}
            onOpenChange={(open) => {
              setOpenMenus((prev) => {
                const newSet = new Set(prev)
                open ? newSet.add(item.title) : newSet.delete(item.title)
                return newSet
              })
            }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isItemActive(item)}
              >
                <Link
                  href={item.items?.length ? "#" : getHref(item.href)}
                  onClick={(e) => handleParentClick(item, e)}
                  className="flex items-center gap-2 w-full"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>

              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="data-[state=open]:rotate-90"
                      onClick={() => toggleMenu(item.title)}
                    >
                      <ChevronRight />
                      <span className="sr-only">Toggle {item.title} menu</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isSubItemActive(subItem.href)}
                          >
                            <Link href={getHref(subItem.href)}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
