import type { ReactNode } from "react";

interface SectionProps {
  title?: string;
  description?: string;
  className?: string;
  id?: string;
  children?: ReactNode;
}

export function Section({ title, description, children, className, id }: SectionProps): JSX.Element {
  return (
    <section id={id} className={`mx-auto w-full max-w-7xl px-0 sm:px-4 lg:px-0 ${className || ""}`}>
      {(title || description) && (
        <div className="mx-auto max-w-3xl">
          {title ? (
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
          ) : null}
        </div>
      )}
      {children}
    </section>
  );
}
