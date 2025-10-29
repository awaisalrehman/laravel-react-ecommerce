import { usePage } from '@inertiajs/react';
import { ActiveRoute } from '@/types';

export function useActiveRoute(): {
  name: string | null;
  path: string;
  is: (pattern: string | string[]) => boolean;
} {
  const { props } = usePage<{ activeRoute: ActiveRoute }>();
  const { name, path } = props.activeRoute ?? { name: null, path: '' };

  const matchPattern = (pattern: string) => {
    if (!name) return false;

    // wildcard match e.g. categories.* matches categories.index, categories.edit, etc.
    if (pattern.endsWith('.*')) {
      const base = pattern.replace('.*', '');
      return name.startsWith(base);
    }

    return name === pattern;
  };

  return {
    name,
    path,
    is: (pattern) =>
      Array.isArray(pattern)
        ? pattern.some((p) => matchPattern(p))
        : matchPattern(pattern),
  };
}
