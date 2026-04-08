export interface SSRSection {
  heading?: string;
  text: string;
}

interface SSRContentProps {
  title: string;
  description: string;
  sections?: SSRSection[];
  links?: { label: string; href: string }[];
}

export default function SSRContent({ title, description, sections, links }: SSRContentProps) {
  return (
    <article data-ssr="true">
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>{title}</h1>
        <p style={{ fontSize: "1.125rem", lineHeight: 1.7, marginBottom: "2rem", color: "#555" }}>{description}</p>
        {sections?.map((s, i) => (
          <section key={i} style={{ marginBottom: "1.5rem" }}>
            {s.heading && <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>{s.heading}</h2>}
            <p style={{ lineHeight: 1.7 }}>{s.text}</p>
          </section>
        ))}
        {links && links.length > 0 && (
          <nav style={{ marginTop: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>Explore More</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {links.map((l, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  <a href={l.href} style={{ color: "#0d7377", textDecoration: "underline" }}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
