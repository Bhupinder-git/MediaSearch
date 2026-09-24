import React from "react";

const Spinner = () => {
  return (
    <div
      className="flex min-h-48 items-center justify-center gap-3 text-text-secondary"
      role="status"
      aria-live="polite"
    >
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-outline-variant border-t-accent-terracotta" />
      <span className="text-[13px] font-medium">Loading media...</span>
    </div>
  );
};

export default Spinner;
