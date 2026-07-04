import type { ReactNode } from "react";

export function FormShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-3xl bg-white border border-border shadow-card p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-border pt-8 mt-8 first:border-0 first:pt-0 first:mt-0">
      <legend className="font-display font-bold text-xl text-ink mb-6">{title}</legend>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </fieldset>
  );
}

export function Field({
  label,
  required,
  error,
  hint,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "md:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
      {hint && !error && <span className="text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const inputCls =
  "h-10 rounded-lg border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";
export const textareaCls =
  "min-h-[110px] rounded-lg border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-y";
