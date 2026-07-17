import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ExperienceLevel, Lang, RoleId, SchoolContext } from "../lib/types";
import { SCHOOL } from "../lib/mock-data";

interface AppState {
  role: RoleId;
  setRole: (r: RoleId) => void;
  experience: ExperienceLevel;
  setExperience: (e: ExperienceLevel) => void;
  context: SchoolContext;
  setContext: (c: SchoolContext) => void;
  setServerContext: (c: { school?: string; branch?: string | null; year?: string }) => void;
  offline: boolean;
  setOffline: (v: boolean) => void;
  activeChild: string;
  setActiveChild: (id: string) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  permissions: string[];
  setPermissions: (p: string[]) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleId>("teacher");
  const [experience, setExperience] = useState<ExperienceLevel>("standard");
  const [context, setContext] = useState<SchoolContext>({
    school: SCHOOL.name,
    branch: SCHOOL.branch,
    year: SCHOOL.year,
  });
  const setServerContext = useCallback((next: { school?: string; branch?: string | null; year?: string }) => {
    setContext((current) => ({
      school: next.school ?? current.school,
      branch: next.branch ?? current.branch,
      year: next.year ?? current.year,
    }));
  }, []);
  const [offline, setOffline] = useState(false);
  const [activeChild, setActiveChild] = useState("ch1");
  const [lang, setLang] = useState<Lang>("en");
  const [permissions, setPermissions] = useState<string[]>([]);

  const value = useMemo(
    () => ({ role, setRole, experience, setExperience, context, setContext, setServerContext, offline, setOffline, activeChild, setActiveChild, lang, setLang, permissions, setPermissions }),
    [role, experience, context, setServerContext, offline, activeChild, lang, permissions],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// Experience-level helper: is the current level at least the required one?
const ORDER: ExperienceLevel[] = ["beginner", "standard", "advanced"];
export function atLeast(current: ExperienceLevel, required: ExperienceLevel) {
  return ORDER.indexOf(current) >= ORDER.indexOf(required);
}
