import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useApp } from "../../store/app-context";
import { useT } from "../../lib/i18n";
import { clearAuth, logout, readAuth } from "../../lib/auth-api";
import { ROLES } from "../../lib/roles";
import { cn } from "../ui/utils";
import { Icon } from "../shared/icon";
import { ContextSwitcher, ExperienceSwitcher } from "./switchers";
import { GlobalSearch, HelpButton, NotificationsButton } from "./top-bar-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function AppShell() {
  const { role, offline, permissions } = useApp();
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const def = ROLES[role];
  const visibleNav = def.nav.filter((item) => !item.permission || permissions.includes(item.permission));
  // Mobile bottom nav shows the first 4 groups + a "More" entry.
  const bottomItems = visibleNav.slice(0, 4);
  const moreItems = visibleNav.slice(4);
  const portalPrefixes = ["/teacher", "/student", "/parent", "/admin", "/principal", "/accountant", "/platform"];

  useEffect(() => {
    const activePrefix = portalPrefixes.find((prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`));
    if (activePrefix && activePrefix !== ROLES[role].home) {
      navigate(ROLES[role].home, { replace: true });
    }
  }, [location.pathname, navigate, role]);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t(def.label)}</p>
          {visibleNav.map((item) => (
            <SidebarLink key={item.key} to={item.to} icon={item.icon} label={t(item.label)} end={item.to === def.home} />
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <SidebarLink to="/profile" icon="Settings" label={t("Profile & Preferences")} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-card/95 px-3 py-2.5 backdrop-blur sm:px-4">
          <div className="lg:hidden"><MobileMenu /></div>
          {role === "platform" ? <PlatformScope /> : <ContextSwitcher />}
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block"><GlobalSearch /></div>
            <ExperienceSwitcher />
            <NotificationsButton />
            <div className="hidden sm:block"><HelpButton /></div>
            <ProfileMenu />
          </div>
        </header>

        {offline && (
          <div className="flex items-center gap-2 bg-warning-subtle px-4 py-1.5 text-[13px] text-warning-subtle-foreground">
            <Icon name="CloudOff" className="size-4" /> {t("You are offline. Attendance and drafts are saved on this device and will sync when you reconnect.")}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card/95 backdrop-blur lg:hidden">
        {bottomItems.map((item) => (
          <BottomLink key={item.key} to={item.to} icon={item.icon} label={t(item.label)} end={item.to === def.home} />
        ))}
        {moreItems.length > 0 ? (
          <MoreSheet items={moreItems} />
        ) : (
          <BottomLink to="/profile" icon="User" label={t("Profile")} />
        )}
      </nav>
    </div>
  );
}

function Brand() {
  const t = useT();
  return (
    <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Icon name="GraduationCap" className="size-5" />
      </span>
      <div className="leading-tight">
        <p className="font-semibold">SMLS</p>
        <p className="text-[11px] text-muted-foreground">{t("School Management")}</p>
      </div>
    </div>
  );
}

function PlatformScope() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-left text-[13px]">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon name="ShieldCheck" className="size-4" />
      </span>
      <span className="hidden min-w-0 sm:block">
        <span className="block truncate font-medium leading-tight">SMLS Platform</span>
        <span className="block truncate text-[12px] leading-tight text-muted-foreground">All tenants</span>
      </span>
    </div>
  );
}

function SidebarLink({ to, icon, label, end }: { to: string; icon: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
          isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-muted",
        )
      }
    >
      <Icon name={icon} className="size-[18px]" />
      {label}
    </NavLink>
  );
}

function BottomLink({ to, icon, label, end }: { to: string; icon: string; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
          isActive ? "text-primary" : "text-muted-foreground",
        )
      }
    >
      <Icon name={icon} className="size-5" />
      {label}
    </NavLink>
  );
}

function MoreSheet({ items }: { items: { key: string; to: string; icon: string; label: string }[] }) {
  const { pathname } = useLocation();
  const t = useT();
  const active = items.some((i) => pathname.startsWith(i.to));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
        <Icon name="LayoutGrid" className="size-5" />
        {t("More")}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="mb-2 w-52">
        {items.map((i) => (
          <DropdownMenuItem key={i.key} asChild>
            <NavLink to={i.to}><Icon name={i.icon} className="size-4" /> {t(i.label)}</NavLink>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/profile"><Icon name="Settings" className="size-4" /> {t("Profile & Preferences")}</NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenu() {
  const { role, permissions } = useApp();
  const t = useT();
  const def = ROLES[role];
  const visibleNav = def.nav.filter((item) => !item.permission || permissions.includes(item.permission));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-lg border border-border bg-card">
        <Icon name="Menu" className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{t(def.label)}</DropdownMenuLabel>
        {visibleNav.map((i) => (
          <DropdownMenuItem key={i.key} asChild>
            <NavLink to={i.to} end={i.to === def.home}><Icon name={i.icon} className="size-4" /> {t(i.label)}</NavLink>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu() {
  const { role } = useApp();
  const t = useT();
  const navigate = useNavigate();

  async function signOut() {
    const session = readAuth();
    clearAuth();
    navigate("/signin");
    if (session?.refreshToken) {
      try {
        await logout(session.refreshToken);
      } catch {
        // Local sign-out has already completed. Server cleanup can be retried by session expiry.
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Avatar className="size-9 border border-border">
          <AvatarFallback className="bg-primary/10 text-[13px] font-semibold text-primary">RS</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="font-medium">Ravi Sharma</p>
          <p className="text-[12px] font-normal text-muted-foreground">{t(ROLES[role].label)}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><NavLink to="/profile"><Icon name="User" className="size-4" /> {t("Profile")}</NavLink></DropdownMenuItem>
        <DropdownMenuItem asChild><NavLink to="/profile"><Icon name="Settings" className="size-4" /> {t("Preferences")}</NavLink></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}><Icon name="LogOut" className="size-4" /> {t("Sign out")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
