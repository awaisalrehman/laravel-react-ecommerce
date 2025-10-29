import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

// ─────────────────────────────
// Core App Entities
// ─────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface Auth {
  user: User | null;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Extended types for nested navigation
export interface NavMainItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavMainGroup {
  title: string;
  items: NavMainItem[];
}

// ─────────────────────────────
// Shared Data from Middleware
// ─────────────────────────────

export interface SharedData {
  name: string;
  auth: Auth;
  sidebarOpen: boolean;
  flash?: {
    success?: string;
    error?: string;
    message?: string;
  };
  [key: string]: unknown;
}

export interface PageProps extends InertiaPageProps, SharedData {}

// ─────────────────────────────
// Pagination Type
// ─────────────────────────────

export interface PaginationProps<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ─────────────────────────────
// Business Models
// ─────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: string;
  stock: number;
  image?: string | null;
  gallery?: string[] | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high' | string;
  due_date?: string;
  assignee?: {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
  };
  created_at?: string;
  updated_at?: string;
}
