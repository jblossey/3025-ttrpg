"use client";

import {
  LinkIcon,
  MessageSquareIcon,
  PlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { SectionWrapper } from "./section-wrapper";

interface Connection {
  id: string;
  name: string;
  description: string;
  relationship: string;
}

interface ConnectionsSectionProps {
  connections: Connection[];
  onConnectionsChange: (connections: Connection[]) => void;
}

interface ConnectionCardProps {
  connection: Connection;
  index: number;
  onChange: (connection: Connection) => void;
  onRemove: () => void;
}

function ConnectionCard({
  connection,
  index,
  onChange,
  onRemove,
}: ConnectionCardProps) {
  const nameId = `connection-name-${connection.id}`;
  const descId = `connection-desc-${connection.id}`;
  const relId = `connection-rel-${connection.id}`;

  return (
    <div className="bg-secondary/30 border-border group relative rounded border p-4">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive absolute top-2 right-2 transition-opacity md:opacity-0 md:group-hover:opacity-100"
      >
        <XIcon size={16} />
      </Button>

      <div className="mb-4 flex items-center gap-2">
        <div className="bg-primary/20 border-primary/50 flex h-8 w-8 items-center justify-center rounded-full border">
          <span className="text-primary font-mono text-xs font-bold">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <span className="text-muted-foreground font-mono text-xs">
          [CON-{String(index + 1).padStart(2, "0")}]
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor={nameId} className="mb-1 flex items-center gap-2">
            <UsersIcon size={12} className="text-primary" />
            <span className="text-muted-foreground font-mono text-xs uppercase">
              Name
            </span>
          </label>
          <Input
            id={nameId}
            value={connection.name}
            onChange={(e) => onChange({ ...connection, name: e.target.value })}
            placeholder="Connection's name..."
            className="bg-background/50 border-border/50 h-8 font-mono text-sm"
          />
        </div>

        <div>
          <label htmlFor={descId} className="mb-1 flex items-center gap-2">
            <MessageSquareIcon size={12} className="text-primary" />
            <span className="text-muted-foreground font-mono text-xs uppercase">
              Description
            </span>
          </label>
          <Textarea
            id={descId}
            value={connection.description}
            onChange={(e) =>
              onChange({ ...connection, description: e.target.value })
            }
            placeholder="Who are they?"
            className="bg-background/50 border-border/50 min-h-15 resize-none font-mono text-sm"
          />
        </div>

        <div>
          <label htmlFor={relId} className="mb-1 flex items-center gap-2">
            <LinkIcon size={12} className="text-primary" />
            <span className="text-muted-foreground font-mono text-xs uppercase">
              Connection
            </span>
          </label>
          <Textarea
            id={relId}
            value={connection.relationship}
            onChange={(e) =>
              onChange({ ...connection, relationship: e.target.value })
            }
            placeholder="How do they connect to you?"
            className="bg-background/50 border-border/50 min-h-15 resize-none font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export function ConnectionsSection({
  connections,
  onConnectionsChange,
}: ConnectionsSectionProps) {
  const namedConnections = connections.filter((c) => c.name.trim().length > 0);
  const summary =
    namedConnections.length > 0
      ? namedConnections
          .slice(0, 3)
          .map((c) => c.name)
          .join(", ") +
        (namedConnections.length > 3 ? ` +${namedConnections.length - 3}` : "")
      : "NONE";

  const addConnection = () => {
    onConnectionsChange([
      ...connections,
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        relationship: "",
      },
    ]);
  };

  const updateConnection = (index: number, connection: Connection) => {
    const newConnections = [...connections];
    newConnections[index] = connection;
    onConnectionsChange(newConnections);
  };

  const removeConnection = (index: number) => {
    onConnectionsChange(connections.filter((_, i) => i !== index));
  };

  return (
    <SectionWrapper
      title="Interpersonal Network"
      sectionId="06.NET"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="space-y-4">
        {connections.length === 0 ? (
          <div className="border-border flex flex-col items-center justify-center rounded border border-dashed py-8 text-center">
            <UsersIcon size={32} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground font-mono text-sm">
              NO CONNECTIONS REGISTERED
            </p>
            <p className="text-muted-foreground/70 mt-1 font-mono text-xs">
              Add interpersonal connections below
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {connections.map((connection, index) => (
              <ConnectionCard
                key={connection.id}
                connection={connection}
                index={index}
                onChange={(updated) => updateConnection(index, updated)}
                onRemove={() => removeConnection(index)}
              />
            ))}
          </div>
        )}

        <Button
          onClick={addConnection}
          variant="outline"
          className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary w-full border-dashed"
        >
          <PlusIcon size={16} className="mr-2" />
          <span className="font-mono text-sm">ADD CONNECTION</span>
        </Button>
      </div>
    </SectionWrapper>
  );
}
