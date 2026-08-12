interface SalesforceCloudProps {
  className?: string;
}

/** Salesforce-style cloud mark in the brand blue (#00A1E0). */
export function SalesforceCloud({ className = "" }: SalesforceCloudProps) {
  return (
    <svg viewBox="0 0 100 72" className={className} role="img" aria-label="Salesforce">
      <path
        fill="#00A1E0"
        d="M83 71H24C12.4 71 3 61.6 3 50c0-10.4 7.6-19 17.5-20.6C22.3 18.4 31.9 10 43.4 10c8.6 0 16.1 4.7 20 11.7 2.3-1.7 5.2-2.7 8.3-2.7 8.2 0 14.8 6.6 14.8 14.8 0 1.6-.3 3.2-.8 4.6C93.3 40.6 99 47.6 99 56c0 8.3-7.2 15-16 15Z"
      />
    </svg>
  );
}
