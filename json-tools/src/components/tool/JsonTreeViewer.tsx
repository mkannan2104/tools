"use client";

import { Check, ChevronDown, ChevronRight, Copy, Link2 } from "lucide-react";
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { copyToClipboard } from "@/services/browser/clipboard";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function joinPath(parent: string, key: string, isIndex: boolean): string {
  if (!parent) return isIndex ? `[${key}]` : key;
  return isIndex ? `${parent}[${key}]` : `${parent}.${key}`;
}

function collectExpandablePaths(value: unknown, path = ""): string[] {
  if (Array.isArray(value)) {
    const self = path ? [path] : ["$"];
    return self.concat(
      value.flatMap((item, index) =>
        collectExpandablePaths(
          item,
          joinPath(path === "$" ? "" : path, String(index), true),
        ),
      ),
    );
  }

  if (isObject(value)) {
    const self = path ? [path] : ["$"];
    return self.concat(
      Object.entries(value).flatMap(([key, child]) =>
        collectExpandablePaths(child, joinPath(path === "$" ? "" : path, key, false)),
      ),
    );
  }

  return [];
}

function valueToCopy(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

function TinyCopyButton({
  label,
  value,
  kind,
}: {
  label: string;
  value: string;
  kind: "path" | "value";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      className="tree-copy"
      onClick={handleCopy}
      title={copied ? "Copied" : label}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? (
        <Check size={13} strokeWidth={2} aria-hidden="true" />
      ) : kind === "path" ? (
        <Link2 size={13} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy size={13} strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
}

function matchesQuery(value: unknown, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  try {
    return JSON.stringify(value).toLowerCase().includes(q);
  } catch {
    return String(value).toLowerCase().includes(q);
  }
}

function TreeNode({
  name,
  value,
  path,
  query,
  expanded,
  onToggle,
  depth = 0,
}: {
  name?: string;
  value: unknown;
  path: string;
  query: string;
  expanded: Set<string>;
  onToggle: (path: string) => void;
  depth?: number;
}): ReactNode {
  const expandable = Array.isArray(value) || isObject(value);
  const nodeKey = path || "$";
  const open = !expandable || expanded.has(nodeKey);
  const visible = matchesQuery(value, query) || matchesQuery(name ?? "", query);

  if (!visible && query) return null;

  if (Array.isArray(value)) {
    return (
      <div className="tree-node" style={{ marginLeft: depth === 0 ? 0 : undefined }}>
        <div className="tree-node__row">
          <button
            type="button"
            className="tree-toggle"
            onClick={() => onToggle(nodeKey)}
            aria-expanded={open}
            aria-label={open ? "Collapse array" : "Expand array"}
          >
            {open ? (
              <ChevronDown size={14} strokeWidth={2} />
            ) : (
              <ChevronRight size={14} strokeWidth={2} />
            )}
          </button>
          <div className="tree-node__main">
            {name !== undefined ? <span className="tree-key">{name}</span> : null}
            {name !== undefined ? <span>: </span> : null}
            <span>
              [{value.length}]
              {!open ? " …" : ""}
            </span>
          </div>
          <span className="tree-actions">
            <TinyCopyButton kind="path" label="Copy path" value={path || "$"} />
            <TinyCopyButton kind="value" label="Copy value" value={valueToCopy(value)} />
          </span>
        </div>
        {open
          ? value.map((item, index) => (
              <TreeNode
                key={`${nodeKey}-${index}`}
                name={String(index)}
                value={item}
                path={joinPath(path, String(index), true)}
                query={query}
                expanded={expanded}
                onToggle={onToggle}
                depth={depth + 1}
              />
            ))
          : null}
      </div>
    );
  }

  if (isObject(value)) {
    const entries = Object.entries(value);
    return (
      <div className="tree-node" style={{ marginLeft: depth === 0 ? 0 : undefined }}>
        <div className="tree-node__row">
          <button
            type="button"
            className="tree-toggle"
            onClick={() => onToggle(nodeKey)}
            aria-expanded={open}
            aria-label={open ? "Collapse object" : "Expand object"}
          >
            {open ? (
              <ChevronDown size={14} strokeWidth={2} />
            ) : (
              <ChevronRight size={14} strokeWidth={2} />
            )}
          </button>
          <div className="tree-node__main">
            {name !== undefined ? <span className="tree-key">{name}</span> : null}
            {name !== undefined ? <span>: </span> : null}
            <span>
              {"{"}
              {entries.length}
              {"}"}
              {!open ? " …" : ""}
            </span>
          </div>
          <span className="tree-actions">
            <TinyCopyButton kind="path" label="Copy path" value={path || "$"} />
            <TinyCopyButton kind="value" label="Copy value" value={valueToCopy(value)} />
          </span>
        </div>
        {open
          ? entries.map(([key, child]) => (
              <TreeNode
                key={`${nodeKey}-${key}`}
                name={key}
                value={child}
                path={joinPath(path, key, false)}
                query={query}
                expanded={expanded}
                onToggle={onToggle}
                depth={depth + 1}
              />
            ))
          : null}
      </div>
    );
  }

  const rendered =
    typeof value === "string"
      ? JSON.stringify(value)
      : value === null
        ? "null"
        : String(value);

  const typeClass =
    typeof value === "string"
      ? "tree-string"
      : typeof value === "number"
        ? "tree-number"
        : typeof value === "boolean"
          ? "tree-boolean"
          : "tree-null";

  if (query && !matchesQuery(`${name ?? ""}:${rendered}`, query)) return null;

  return (
    <div className="tree-node" style={{ marginLeft: depth === 0 ? 0 : undefined }}>
      <div className="tree-node__row">
        <span className="tree-toggle tree-toggle--spacer" aria-hidden="true" />
        <div className="tree-node__main">
          {name !== undefined ? (
            <>
              <span className="tree-key">{name}</span>
              <span>: </span>
            </>
          ) : null}
          <span className={typeClass}>{rendered}</span>
        </div>
        <span className="tree-actions">
          {path ? (
            <TinyCopyButton kind="path" label="Copy path" value={path} />
          ) : null}
          <TinyCopyButton kind="value" label="Copy value" value={valueToCopy(value)} />
        </span>
      </div>
    </div>
  );
}

export function JsonTreeViewer({ data }: { data: unknown }) {
  const [query, setQuery] = useState("");
  const expandablePaths = useMemo(
    () => collectExpandablePaths(data),
    [data],
  );
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(expandablePaths),
  );
  const [pathsKey, setPathsKey] = useState(expandablePaths.join("\0"));
  const nextPathsKey = expandablePaths.join("\0");
  if (nextPathsKey !== pathsKey) {
    setPathsKey(nextPathsKey);
    setExpanded(new Set(expandablePaths));
    setQuery("");
  }

  const onToggle = useCallback((path: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  function expandAll() {
    setExpanded(new Set(expandablePaths));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  return (
    <div className="tree-viewer-wrap">
      <div className="panel__header panel__header--tree">
        <span className="panel__title">Tree view</span>
        <div className="panel__actions">
          <ButtonLike onClick={expandAll}>Expand all</ButtonLike>
          <ButtonLike onClick={collapseAll}>Collapse all</ButtonLike>
          <input
            className="tree-search"
            type="search"
            placeholder="Search..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search JSON tree"
          />
        </div>
      </div>
      <div className="tree-viewer">
        <TreeNode
          value={data}
          path=""
          query={query}
          expanded={expanded}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
}

function ButtonLike({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className="tree-toolbar-btn" onClick={onClick}>
      {children}
    </button>
  );
}
