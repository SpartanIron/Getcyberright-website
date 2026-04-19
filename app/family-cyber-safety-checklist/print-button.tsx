"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      data-testid="button-print-checklist"
    >
      Print or Save as PDF
    </button>
  );
}
