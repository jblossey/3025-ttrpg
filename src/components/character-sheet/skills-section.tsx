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
        className="skill-node-indent relative"
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
            className="pointer-events-none absolute top-0 bottom-0"
            style={{ left: `-${INDENT_SIZE_MOBILE / 2 + 1}px` }}
          >
            {/* Vertical line */}
            {!isLastChild && (
              <div
                className="bg-border/40 absolute w-px"
                style={{
                  left: 0,
                  top: 0,
                  height: "100%",
                }}
              />
            )}
            {/* Horizontal connector */}
            <div
              className="bg-border/40 absolute h-px"
              style={{
                left: 0,
                top: "50%",
                width: `${INDENT_SIZE_MOBILE / 2}px`,
              }}
            />
            {/* Connector dot */}
            <div
              className="border-border/60 bg-background absolute h-1.5 w-1.5 rounded-full border"
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
            "group relative flex items-center gap-2 rounded border p-2 transition-all md:gap-3 md:p-3",
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
                "h-6 w-6 shrink-0 rounded md:h-7 md:w-7",
                isRoot
                  ? "bg-primary text-primary-foreground hover:bg-primary/80"
                  : "bg-secondary border-border hover:border-primary/50 border",
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
                "flex h-6 w-6 shrink-0 items-center justify-center rounded md:h-7 md:w-7",
                isRoot
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary border-border border",
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
            <span className="text-muted-foreground/50 bg-secondary/50 hidden w-5 shrink-0 items-center justify-center rounded py-0.5 font-mono text-[9px] sm:flex">
              L{depth}
            </span>
          )}

          {/* Skill name */}
          <div className="min-w-0 flex-1">
            <Input
              value={node.name}
              onChange={(e) => onUpdate({ ...node, name: e.target.value })}
              placeholder={isRoot ? "Root skill..." : `Specialization...`}
              className={cn(
                "bg-background/50 border-border/50 h-7 font-mono text-xs md:h-8 md:text-sm",
                isRoot && "font-bold",
                depth > 0 && "text-foreground/90",
              )}
            />
          </div>

          {/* Child count badge (when collapsed) */}
          {hasChildren && !isExpanded && (
            <span className="text-primary bg-primary/10 border-primary/20 shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]">
              {childCount} sub
            </span>
          )}

          {/* Proficiency - desktop */}
          <div className="hidden shrink-0 sm:block">
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
          <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity group-hover:opacity-100 md:gap-1 md:opacity-0">
            {canAddMore && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onAddChild}
                className="text-muted-foreground hover:text-primary p-0.5 transition-colors md:p-1"
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
                className="text-muted-foreground hover:text-destructive p-0.5 transition-colors md:p-1"
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
        <div className="relative mt-1.5 space-y-1.5 md:mt-2 md:space-y-2">
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
    <div className="bg-secondary/20 border-border relative rounded-lg border p-3 md:p-4">
      {/* Tree header */}
      <div className="border-border/50 mb-3 flex items-center justify-between border-b pb-2 md:mb-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="bg-primary/20 flex h-6 w-6 shrink-0 items-center justify-center rounded">
            <span className="text-primary font-mono text-xs font-bold">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <span className="text-muted-foreground truncate font-mono text-xs">
            SKILL TREE [{tree.rootSkill.name || "UNNAMED"}]
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive shrink-0 transition-colors"
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
      <div className="border-border/50 mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2 md:mt-4">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-muted-foreground font-mono text-[10px] md:text-xs">
            NODES: {nodeCount}
          </span>
          <span className="text-muted-foreground font-mono text-[10px] md:text-xs">
            DEPTH: {maxDepth}
          </span>
        </div>
        <span className="text-muted-foreground font-mono text-[10px] md:text-xs">
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
        <div className="bg-secondary/30 border-border flex flex-wrap items-center gap-2 rounded border p-2 font-mono text-[10px] md:gap-4 md:p-3 md:text-xs">
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="bg-primary/10 border-primary h-3 w-3 rounded border-l-2 md:h-4 md:w-4" />
            <span className="text-muted-foreground">Root</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex items-center">
              <Plus className="text-muted-foreground h-2.5 w-2.5 md:h-3 md:w-3" />
              <span className="text-muted-foreground/50">/</span>
              <Minus className="text-muted-foreground h-2.5 w-2.5 md:h-3 md:w-3" />
            </div>
            <span className="text-muted-foreground">Toggle</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Rating value={2} max={3} size="sm" />
            <span className="text-muted-foreground">Proficiency</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="text-muted-foreground/60 bg-secondary/50 flex items-center rounded px-1 text-[8px] md:text-[10px]">
              L1-L{MAX_DEPTH}
            </div>
            <span className="text-muted-foreground">Nesting</span>
          </div>
        </div>

        {/* Skill trees */}
        {skillTrees.length === 0 ? (
          <div className="border-border flex flex-col items-center justify-center rounded border border-dashed py-8 text-center">
            <Zap className="text-muted-foreground mb-2 h-8 w-8" />
            <p className="text-muted-foreground font-mono text-sm">
              NO SKILL TREES REGISTERED
            </p>
            <p className="text-muted-foreground/70 mt-1 font-mono text-xs">
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
          className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary w-full border-dashed"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="font-mono text-xs md:text-sm">ADD SKILL TREE</span>
        </Button>

        {/* Summary */}
        <div className="border-border/50 flex items-center justify-between border-t pt-2">
          <span className="text-muted-foreground font-mono text-xs">
            SKILL TREES: {skillTrees.length}
          </span>
          <span className="text-muted-foreground font-mono text-xs">
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
