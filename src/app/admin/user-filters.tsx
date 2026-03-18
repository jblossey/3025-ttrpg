"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-input";

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") ?? "",
  );
  const [searchField, setSearchField] = useState<"name" | "email">(
    (searchParams.get("field") as "name" | "email") ?? "name",
  );

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue) {
      params.set("search", searchValue);
      params.set("field", searchField);
    } else {
      params.delete("search");
      params.delete("field");
    }
    params.delete("offset");
    router.push(`/admin?${params.toString()}`);
  }

  function clearFilters() {
    setSearchValue("");
    setSearchField("name");
    router.push("/admin");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="flex items-end gap-2">
        <TextInput
          label="Search"
          placeholder="Search users..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          size="sm"
        />
        <div className="space-y-1">
          <label className="block font-mono text-[9px] uppercase tracking-widest text-foreground/40">
            Field
            <select
              value={searchField}
              onChange={(e) =>
                setSearchField(e.target.value as "name" | "email")
              }
              className="mt-1 block rounded border border-primary/20 bg-card/60 px-2 py-1.5 font-mono text-[10px] text-foreground/80 outline-none backdrop-blur-sm focus:border-primary/40"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
          </label>
        </div>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={applyFilters}>
          Search
        </Button>
        {searchParams.get("search") && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export function UserPagination({
  total,
  limit,
  offset,
}: {
  total: number;
  limit: number;
  offset: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    const newOffset = (page - 1) * limit;
    if (newOffset > 0) {
      params.set("offset", String(newOffset));
    } else {
      params.delete("offset");
    }
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[9px] text-foreground/40">
        {total} users · Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
          className="text-[10px]"
        >
          ← Prev
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className="text-[10px]"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
