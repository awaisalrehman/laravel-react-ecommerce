import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | string;
  due_date?: string; // e.g., "2025-10-09"
  assignee?: {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
  };
  created_at?: string;
  updated_at?: string;
}


export interface PaginationProps<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PageProps {
  auth?: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  flash?: {
    success?: string;
    error?: string;
  };
  [key: string]: any;
}
