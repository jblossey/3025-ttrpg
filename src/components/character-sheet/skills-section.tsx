"use client";

import { Minus, Plus, X, Zap } from "lucide-react";
import { useState } from "react";
import { Rating } from "@/components/thegridcn/rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "./section-wrapper";

const MAX_DEPTH = 5; // Maximum nesting level

// Indentation sizes per depth level (in pixels for desktop, scaled down for mobile)
const INDENT_SIZE_DESKTOP = 24;
const INDENT_SIZE_MOBILE = 16;

interface SkillNode {
  id: string;
  name: string;
  proficiency: number; // 0-5
  children: SkillNode[];
}

interface SkillTree {
  id: string;
  rootSkill: SkillNode;
}

interface SkillsSectionProps {
  skillTrees: SkillTree[];
  onSkillTreesChange: (skillTrees: SkillTree[]) => void;
}

interface SkillNodeDisplayProps {
  node: SkillNode;
  depth: number;
  onUpdate: (node: SkillNode) => void;
  onRemove: () => void;
  onAddChild: () => void;
  isLastChild?: boolean;
}

function SkillNodeDisplay({
  node,
  depth,
  onUpdate,
  onRemove,
  onAddChild,
  isLastChild = false,
}: SkillNodeDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateChild = (index: number, updatedChild: SkillNode) => {
    const newChildren = [...node.children];
    newChildren[index] = updatedChild;
    onUpdate({ ...node, children: newChildren });
  };

  const removeChild = (index: number) => {
    onUpdate({
      ...node,
      children: node.children.filter((_, i) => i !== index),
    });
  };

  const addChildToNode = (index: number) => {
    const newChildren = [...node.children];
    newChildren[index] = {
      ...newChildren[index],
      children: [
        ...newChildren[index].children,
        {
          id: crypto.randomUUID(),
          name: "",
          proficiency: 0,
          children: [],
        },
      ],
    };
    onUpdate({ ...node, children: newChildren });
  };

  const isRoot = depth === 0;
  const hasChildren = node.children.length > 0;
  const canAddMore = depth < MAX_DEPTH;
  const childCount = countNodes(node) - 1;

  const indentMobile = depth > 0 ? depth * INDENT_SIZE_MOBILE : 0;
  const indentDesktop = depth > 0 ? depth * INDENT_SIZE_DESKTOP : 0;

  // Visual hierarchy through border thickness and opacity
  const borderOpacity = Math.max(0.3, 1 - depth * 0.15);

  return (
    <div className="relative">
      {/* Node container with indentation */}
      <div
        className="relative skill-node-indent"
        style={
          {
            marginLeft: `${indentMobile}px`,
            "--indent-desktop": `${indentDesktop}px`,
          } as React.CSSProperties
        }
      >
        {/* Tree lines for non-root nodes */}
        {depth > 0 && (
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `-${INDENT_SIZE_MOBILE / 2 + 1}px` }}
          >
            {/* Vertical line */}
            {!isLastChild && (
              <div
                className="absolute w-px bg-border/40"
                style={{
                  left: 0,
                  top: 0,
                  height: "100%",
                }}
              />
            )}
            {/* Horizontal connector */}
            <div
              className="absolute h-px bg-border/40"
              style={{
                left: 0,
                top: "50%",
                width: `${INDENT_SIZE_MOBILE / 2}px`,
              }}
            />
            {/* Connector dot */}
            <div
              className="absolute w-1.5 h-1.5 rounded-full border border-border/60 bg-background"
              style={{
                left: `${INDENT_SIZE_MOBILE / 2 - 3}px`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>
        )}

        {/* Node content */}
        <div
          data-depth={depth}
          className={cn(
            "group relative flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded border transition-all",
            isRoot
              ? "border-primary bg-primary/10"
              : "border-border bg-secondary/30 hover:border-primary/30",
          )}
          style={{
            borderLeftWidth: isRoot
              ? "2px"
              : `${Math.max(1, 2 - depth * 0.25)}px`,
            borderLeftColor: isRoot
              ? undefined
              : `rgba(255, 102, 0, ${borderOpacity})`,
          }}
        >
          {/* Expand/Collapse toggle for nodes with children */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "shrink-0 w-6 h-6 md:w-7 md:h-7 rounded",
                isRoot
                  ? "bg-primary text-primary-foreground hover:bg-primary/80"
                  : "bg-secondary border border-border hover:border-primary/50",
              )}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minus
                  className={cn(
                    "h-3 w-3 md:h-3.5 md:w-3.5",
                    !isRoot && "text-primary",
                  )}
                />
              ) : (
                <Plus
                  className={cn(
                    "h-3 w-3 md:h-3.5 md:w-3.5",
                    !isRoot && "text-primary",
                  )}
                />
              )}
            </Button>
          ) : (
            <div
              className={cn(
                "shrink-0 w-6 h-6 md:w-7 md:h-7 rounded flex items-center justify-center",
                isRoot
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary border border-border",
              )}
            >
              <Zap
                className={cn(
                  "h-3 w-3 md:h-3.5 md:w-3.5",
                  !isRoot && "text-primary/70",
                )}
              />
            </div>
          )}

          {/* Depth indicator - shows nesting level */}
          {depth > 0 && (
            <span className="hidden sm:flex shrink-0 text-[9px] font-mono text-muted-foreground/50 w-5 justify-center items-center rounded bg-secondary/50 py-0.5">
              L{depth}
            </span>
          )}

          {/* Skill name */}
          <div className="flex-1 min-w-0">
            <Input
              value={node.name}
              onChange={(e) => onUpdate({ ...node, name: e.target.value })}
              placeholder={isRoot ? "Root skill..." : `Specialization...`}
              className={cn(
                "h-7 md:h-8 bg-background/50 border-border/50 text-xs md:text-sm font-mono",
                isRoot && "font-bold",
                depth > 0 && "text-foreground/90",
              )}
            />
          </div>

          {/* Child count badge (when collapsed) */}
          {hasChildren && !isExpanded && (
            <span className="shrink-0 text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
              {childCount} sub
            </span>
          )}

          {/* Proficiency - desktop */}
          <div className="shrink-0 hidden sm:block">
            <Rating
              value={node.proficiency}
              max={5}
              size={depth === 0 ? "md" : "sm"}
              className="cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                const clicked = Math.ceil((x / width) * 5);
                onUpdate({
                  ...node,
                  proficiency: clicked === node.proficiency ? 0 : clicked,
                });
              }}
            />
          </div>

          {/* Proficiency - mobile (simplified) */}
          <div className="shrink-0 sm:hidden">
            <Rating
              value={node.proficiency}
              max={5}
              size="sm"
              showValue
              className="cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                const clicked = Math.ceil((x / width) * 5);
                onUpdate({
                  ...node,
                  proficiency: clicked === node.proficiency ? 0 : clicked,
                });
              }}
            />
          </div>

          {/* Actions */}
          <div className="shrink-0 flex items-center gap-0.5 md:gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
            {canAddMore && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onAddChild}
                className="p-0.5 md:p-1 text-muted-foreground hover:text-primary transition-colors"
                title="Add child specialization"
              >
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            )}
            {!isRoot && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onRemove}
                className="p-0.5 md:p-1 text-muted-foreground hover:text-destructive transition-colors"
                title="Remove skill"
              >
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Children - rendered with animation */}
      {hasChildren && isExpanded && (
        <div className="relative mt-1.5 md:mt-2 space-y-1.5 md:space-y-2">
          {node.children.map((child, index) => (
            <SkillNodeDisplay
              key={child.id}
              node={child}
              depth={depth + 1}
              onUpdate={(updated) => updateChild(index, updated)}
              onRemove={() => removeChild(index)}
              onAddChild={() => addChildToNode(index)}
              isLastChild={index === node.children.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SkillTreeDisplayProps {
  tree: SkillTree;
  index: number;
  onUpdate: (tree: SkillTree) => void;
  onRemove: () => void;
}

function SkillTreeDisplay({
  tree,
  index,
  onUpdate,
  onRemove,
}: SkillTreeDisplayProps) {
  const addChildToRoot = () => {
    onUpdate({
      ...tree,
      rootSkill: {
        ...tree.rootSkill,
        children: [
          ...tree.rootSkill.children,
          {
            id: crypto.randomUUID(),
            name: "",
            proficiency: 0,
            children: [],
          },
        ],
      },
    });
  };

  const nodeCount = countNodes(tree.rootSkill);
  const maxDepth = getMaxDepth(tree.rootSkill);

  return (
    <div className="relative p-3 md:p-4 bg-secondary/20 border border-border rounded-lg">
      {/* Tree header */}
      <div className="flex items-center justify-between mb-3 md:mb-4 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground truncate">
            SKILL TREE [{tree.rootSkill.name || "UNNAMED"}]
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tree content */}
      <SkillNodeDisplay
        node={tree.rootSkill}
        depth={0}
        onUpdate={(updated) => onUpdate({ ...tree, rootSkill: updated })}
        onRemove={() => {}}
        onAddChild={addChildToRoot}
      />

      {/* Tree footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 md:mt-4 pt-2 border-t border-border/50">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-[10px] md:text-xs font-mono text-muted-foreground">
            NODES: {nodeCount}
          </span>
          <span className="text-[10px] md:text-xs font-mono text-muted-foreground">
            DEPTH: {maxDepth}
          </span>
        </div>
        <span className="text-[10px] md:text-xs font-mono text-muted-foreground">
          AVG PROF: {calculateAvgProficiency(tree.rootSkill).toFixed(1)}
        </span>
      </div>
    </div>
  );
}

function getMaxDepth(node: SkillNode, currentDepth: number = 0): number {
  if (node.children.length === 0) return currentDepth;
  return Math.max(
    ...node.children.map((child) => getMaxDepth(child, currentDepth + 1)),
  );
}

function countNodes(node: SkillNode): number {
  return 1 + node.children.reduce((acc, child) => acc + countNodes(child), 0);
}

function calculateAvgProficiency(node: SkillNode): number {
  const nodes: SkillNode[] = [];
  const collect = (n: SkillNode) => {
    nodes.push(n);
    n.children.forEach(collect);
  };
  collect(node);
  if (nodes.length === 0) return 0;
  return nodes.reduce((acc, n) => acc + n.proficiency, 0) / nodes.length;
}

export function SkillsSection({
  skillTrees,
  onSkillTreesChange,
}: SkillsSectionProps) {
  const totalSkills = skillTrees.reduce(
    (acc, tree) => acc + countNodes(tree.rootSkill),
    0,
  );
  const namedTrees = skillTrees.filter(
    (t) => t.rootSkill.name.trim().length > 0,
  );
  const summary =
    namedTrees.length > 0
      ? namedTrees
          .slice(0, 2)
          .map((t) => t.rootSkill.name)
          .join(", ") +
        (namedTrees.length > 2 ? ` +${namedTrees.length - 2}` : "") +
        ` | ${totalSkills} NODES`
      : `${skillTrees.length} TREES | ${totalSkills} NODES`;

  const addSkillTree = () => {
    onSkillTreesChange([
      ...skillTrees,
      {
        id: crypto.randomUUID(),
        rootSkill: {
          id: crypto.randomUUID(),
          name: "",
          proficiency: 1,
          children: [],
        },
      },
    ]);
  };

  const updateTree = (index: number, tree: SkillTree) => {
    const newTrees = [...skillTrees];
    newTrees[index] = tree;
    onSkillTreesChange(newTrees);
  };

  const removeTree = (index: number) => {
    onSkillTreesChange(skillTrees.filter((_, i) => i !== index));
  };

  return (
    <SectionWrapper
      title="Skill Matrix"
      sectionId="08.SKL"
      defaultOpen={true}
      collapsedSummary={summary}
    >
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4 p-2 md:p-3 bg-secondary/30 border border-border rounded text-[10px] md:text-xs font-mono">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-primary/10 border-l-2 border-primary" />
            <span className="text-muted-foreground">Root</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex items-center">
              <Plus className="h-2.5 w-2.5 md:h-3 md:w-3 text-muted-foreground" />
              <span className="text-muted-foreground/50">/</span>
              <Minus className="h-2.5 w-2.5 md:h-3 md:w-3 text-muted-foreground" />
            </div>
            <span className="text-muted-foreground">Toggle</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Rating value={2} max={3} size="sm" />
            <span className="text-muted-foreground">Proficiency</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex items-center text-[8px] md:text-[10px] text-muted-foreground/60 bg-secondary/50 px-1 rounded">
              L1-L{MAX_DEPTH}
            </div>
            <span className="text-muted-foreground">Nesting</span>
          </div>
        </div>

        {/* Skill trees */}
        {skillTrees.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8 border border-dashed border-border rounded">
            <Zap className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-mono text-muted-foreground">
              NO SKILL TREES REGISTERED
            </p>
            <p className="text-xs font-mono text-muted-foreground/70 mt-1">
              Add skill trees to define character abilities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {skillTrees.map((tree, index) => (
              <SkillTreeDisplay
                key={tree.id}
                tree={tree}
                index={index}
                onUpdate={(updated) => updateTree(index, updated)}
                onRemove={() => removeTree(index)}
              />
            ))}
          </div>
        )}

        {/* Add tree button */}
        <Button
          onClick={addSkillTree}
          variant="outline"
          className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="font-mono text-xs md:text-sm">ADD SKILL TREE</span>
        </Button>

        {/* Summary */}
        <div className="flex justify-between items-center pt-2 border-t border-border/50">
          <span className="text-xs font-mono text-muted-foreground">
            SKILL TREES: {skillTrees.length}
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            TOTAL SKILLS:{" "}
            {skillTrees.reduce(
              (acc, tree) => acc + countNodes(tree.rootSkill),
              0,
            )}
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
}
