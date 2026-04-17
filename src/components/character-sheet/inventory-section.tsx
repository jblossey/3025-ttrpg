"use client";

import { GripVerticalIcon, Package, PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SectionWrapper } from "./section-wrapper";

interface Item {
  id: string;
  name: string;
  quantity: number;
}

interface InventorySectionProps {
  items: Item[];
  onItemsChange: (items: Item[]) => void;
}

export function InventorySection({
  items,
  onItemsChange,
}: InventorySectionProps) {
  const namedItems = items.filter((i) => i.name.trim().length > 0);
  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);
  const summary = `${namedItems.length} ITEMS | QTY: ${totalQty}`;

  const addItem = () => {
    onItemsChange([
      ...items,
      {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
      },
    ]);
  };

  const updateItem = (index: number, item: Item) => {
    const newItems = [...items];
    newItems[index] = item;
    onItemsChange(newItems);
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <SectionWrapper
      title="Carried Items"
      sectionId="07.INV"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="text-muted-foreground hidden items-center gap-2 px-2 py-1 font-mono text-xs uppercase sm:flex">
          <div className="w-6" />
          <div className="flex-1">Item Designation</div>
          <div className="w-16 text-center">QTY</div>
          <div className="w-8" />
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="border-border rounded border border-dashed py-6 text-center">
            <Package className="text-muted-foreground mx-auto mb-2 h-6 w-6" />
            <p className="text-muted-foreground font-mono text-sm">
              INVENTORY EMPTY
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="bg-secondary/30 border-border group hover:border-primary/30 flex items-center gap-2 rounded border p-2 transition-colors"
              >
                <div className="text-muted-foreground/50 cursor-grab">
                  <GripVerticalIcon size={16} />
                </div>
                <span className="text-primary w-6 font-mono text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Input
                  value={item.name}
                  onChange={(e) =>
                    updateItem(index, { ...item, name: e.target.value })
                  }
                  placeholder="Item name..."
                  className="bg-background/50 border-border/50 h-8 flex-1 font-mono text-sm"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, {
                      ...item,
                      quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                    })
                  }
                  min={1}
                  className="bg-background/50 border-border h-8 w-16 rounded border text-center font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeItem(index)}
                  className="text-muted-foreground hover:text-destructive transition-opacity md:opacity-0 md:group-hover:opacity-100"
                >
                  <XIcon size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add item button */}
        <Button
          onClick={addItem}
          variant="outline"
          className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary w-full border-dashed"
        >
          <PlusIcon size={16} className="mr-2" />
          <span className="font-mono text-sm">ADD ITEM</span>
        </Button>

        {/* Footer stats */}
        <div className="border-border/50 flex items-center justify-between border-t pt-2">
          <span className="text-muted-foreground font-mono text-xs">
            ITEMS: {items.length}
          </span>
          <span className="text-muted-foreground font-mono text-xs">
            TOTAL QTY: {items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
}
