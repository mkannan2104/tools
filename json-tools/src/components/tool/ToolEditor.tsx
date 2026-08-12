"use client";

import type { ReactNode, TextareaHTMLAttributes } from "react";

interface ToolEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  actions?: ReactNode;
}

export function ToolEditor({ id, label, actions, ...props }: ToolEditorProps) {
  return (
    <div className="panel">
      <div className="panel__header">
        <label className="panel__title" htmlFor={id}>
          {label}
        </label>
        {actions ? <div className="panel__actions">{actions}</div> : null}
      </div>
      <div className="panel__body">
        <textarea id={id} className="editor" spellCheck={false} {...props} />
      </div>
    </div>
  );
}
