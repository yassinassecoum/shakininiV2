/** Shakinini logo: small banana-filled shaker + condensed wordmark. */
export default function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo-${size}`} aria-label="Shakinini" role="img">
      <svg className="logo-mark" viewBox="0 0 32 40" aria-hidden="true">
        <rect x="6" y="0" width="20" height="7" rx="2" fill="currentColor" />
        <path d="M4 9h24l-2.2 28a3 3 0 0 1-3 2.8H9.2a3 3 0 0 1-3-2.8z" fill="currentColor" opacity=".22" />
        <path d="M5.2 22h21.6l-1 15a3 3 0 0 1-3 2.8H9.2a3 3 0 0 1-3-2.8z" fill="var(--logo-fill, currentColor)" />
      </svg>
      <span className="logo-word" aria-hidden="true">shakinini</span>
    </span>
  )
}
