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
    <div className="bg-secondary/30 border border-border rounded p-4 relative group">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive 
                   md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <XIcon size={16} />
      </Button>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
          <span className="text-xs font-mono font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          [CON-{String(index + 1).padStart(2, "0")}]
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor={nameId} className="flex items-center gap-2 mb-1">
            <UsersIcon size={12} className="text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase">
              Name
            </span>
          </label>
          <Input
            id={nameId}
            value={connection.name}
            onChange={(e) => onChange({ ...connection, name: e.target.value })}
            placeholder="Connection's name..."
            className="h-8 bg-background/50 border-border/50 text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor={descId} className="flex items-center gap-2 mb-1">
            <MessageSquareIcon size={12} className="text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase">
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
            className="min-h-15 bg-background/50 border-border/50 resize-none text-sm font-mono"
          />
        </div>

        <div>
          <label htmlFor={relId} className="flex items-center gap-2 mb-1">
            <LinkIcon size={12} className="text-primary" />
            <span className="text-xs font-mono text-muted-foreground uppercase">
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
            className="min-h-15 bg-background/50 border-border/50 resize-none text-sm font-mono"
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
          <div className="flex flex-col items-center justify-center text-center py-8 border border-dashed border-border rounded">
            <UsersIcon size={32} className="text-muted-foreground mb-2" />
            <p className="text-sm font-mono text-muted-foreground">
              NO CONNECTIONS REGISTERED
            </p>
            <p className="text-xs font-mono text-muted-foreground/70 mt-1">
              Add interpersonal connections below
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
        >
          <PlusIcon size={16} className="mr-2" />
          <span className="font-mono text-sm">ADD CONNECTION</span>
        </Button>
      </div>
    </SectionWrapper>
  );
}
