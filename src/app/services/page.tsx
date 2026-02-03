import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
          <p className="mt-2 text-muted-foreground">
            Architecture, interior design, and staging.
          </p>
        </div>
        <Link href="/contact" className="rounded-md bg-black px-4 py-2 text-white">
          Contact
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card title="Architecture" desc="Planning, layout, and end-to-end execution." />
        <Card title="Interior Design" desc="Concept, sourcing, and full-room design." />
        <Card title="Staging" desc="Prep and presentation to sell faster." />
      </div>

      <div className="mt-12 rounded-xl border p-6">
        <div className="text-lg font-medium">Next: booking flow</div>
        <p className="mt-2 text-muted-foreground">
          We’ll add an intake form + calendar scheduling (and connect it to email).
        </p>
      </div>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border p-6">
      <div className="text-lg font-medium">{title}</div>
      <p className="mt-2 text-muted-foreground">{desc}</p>
    </div>
  );
}
