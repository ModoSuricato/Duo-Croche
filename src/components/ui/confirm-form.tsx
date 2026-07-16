"use client";

export function ConfirmForm({
  action,
  confirmText,
  children,
  className,
}: {
  action: (formData: FormData) => void;
  confirmText: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}
