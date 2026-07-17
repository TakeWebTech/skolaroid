import { useMemo, useState, type ReactNode } from "react";
import { Input } from "../ui/input";
import { Icon } from "./icon";
import { NoResults } from "./states";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sticky?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string;
  searchable?: (row: T) => string;
  searchPlaceholder?: string;
  filters?: ReactNode;
  toolbar?: ReactNode;
  mobileCard: (row: T) => ReactNode;
}

// Table with search, active filters, sticky identity column and a mobile card
// fallback (spec §5.2). Never a wide grid on phones.
export function DataTable<T>({ columns, rows, getKey, searchable, searchPlaceholder = "Search…", filters, toolbar, mobileCard }: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query || !searchable) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => searchable(r).toLowerCase().includes(q));
  }, [rows, query, searchable]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {searchable && (
          <div className="relative flex-1">
            <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="pl-9" />
          </div>
        )}
        {filters}
        {toolbar}
      </div>

      {filtered.length === 0 ? (
        <NoResults onClear={() => setQuery("")} />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card sm:block">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-border text-left text-[13px] text-muted-foreground">
                  {columns.map((c) => (
                    <th key={c.key} className={`px-4 py-3 font-medium ${c.sticky ? "sticky left-0 bg-card" : ""} ${c.className ?? ""}`}>{c.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={getKey(row)} className="border-b border-border last:border-0 hover:bg-muted/40">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.sticky ? "sticky left-0 bg-card font-medium" : ""} ${c.className ?? ""}`}>{c.render(row)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-2 sm:hidden">
            {filtered.map((row) => (
              <li key={getKey(row)} className="rounded-xl border border-border bg-card p-3">{mobileCard(row)}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
