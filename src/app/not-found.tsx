import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        That page doesn’t exist. Head back home or browse the catalog.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-md bg-black px-5 py-3 text-white">
          Home
        </Link>
        <Link href="/products" className="rounded-md border px-5 py-3">
          Shop
        </Link>
      </div>
    </main>
  );
}
