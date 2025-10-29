import { ChevronRight, type LucideIcon } from "lucide-react"
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

export function NavMain({
  items,
}: {
  items: NavMainItem[]
}) {
  const { url: currentUrl } = usePage()
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())

  // Check if a menu item or any of its children is active
  const isItemActive = (item: NavMainItem) => {
    if (item.href === currentUrl) return true
    if (item.items?.some(subItem => subItem.href === currentUrl)) return true
    return false
  }

  // Check if a specific sub-item is active
  const isSubItemActive = (href: string) => {
    return href === currentUrl
  }

  // Initialize open menus based on active items
  useEffect(() => {
    const initiallyOpen = new Set<string>()
    items.forEach(item => {
      if (item.items && isItemActive(item)) {
        initiallyOpen.add(item.title)
      }
    })
    setOpenMenus(initiallyOpen)
  }, [items, currentUrl])

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }

  const handleParentClick = (item: NavMainItem, event: React.MouseEvent) => {
    if (item.items?.length) {
      event.preventDefault()
      toggleMenu(item.title)
    }
    // If no children, navigation will proceed normally via the Link component
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
              if (open) {
                setOpenMenus(prev => new Set(prev).add(item.title))
              } else {
                setOpenMenus(prev => {
                  const newSet = new Set(prev)
                  newSet.delete(item.title)
                  return newSet
                })
              }
            }}
          >
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                tooltip={item.title}
                isActive={isItemActive(item)}
              >
                <Link 
                  href={item.items?.length ? "#" : item.href}
                  onClick={(e: React.MouseEvent) => handleParentClick(item, e)}
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
                            <Link href={subItem.href}>
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