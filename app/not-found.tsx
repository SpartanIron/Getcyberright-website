import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Sora, sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "480px" }}>
        <h1
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#0d9488",
            margin: "0 0 8px",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 600,
            color: "#1a1a1a",
            margin: "0 0 16px",
          }}
        >
          Page Not Found
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            lineHeight: 1.6,
            margin: "0 0 32px",
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or head back to our homepage.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#0d9488",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
            }}
            data-testid="link-home"
          >
            Go to Homepage
          </Link>
          <Link
            href="/tools"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#f0fdfa",
              color: "#0d9488",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
              border: "1px solid #0d9488",
            }}
            data-testid="link-tools"
          >
            Security Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
