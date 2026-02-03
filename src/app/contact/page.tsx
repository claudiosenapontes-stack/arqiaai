export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-2 text-muted-foreground">
        Tell us what you’re looking for — we’ll respond with next steps.
      </p>

      <form className="mt-10 space-y-4 rounded-xl border p-6">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="Your name" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="mt-1 w-full rounded-md border px-3 py-2" placeholder="you@email.com" />
        </div>
        <div>
          <label className="text-sm font-medium">Message</label>
          <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={5} placeholder="Furniture request or service inquiry" />
        </div>
        <button type="button" className="rounded-md bg-black px-5 py-3 text-white">
          Send (next)
        </button>
        <p className="text-xs text-muted-foreground">
          Next: wire this form to email + CRM + calendar booking.
        </p>
      </form>
    </main>
  );
}
