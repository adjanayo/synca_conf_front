import { useEffect } from "react";
import { Outlet } from "react-router-dom";

/**
 * Separate from the public AppLayout on purpose (ROADMAP_ADMIN.md A3) --
 * no public Nav/Footer here. Injects <meta name="robots" content="noindex">
 * on mount (not baked into index.html — only admin routes need it) and
 * removes it on unmount so navigating back to public pages doesn't
 * accidentally noindex the whole site.
 */
export function AdminLayout() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}
