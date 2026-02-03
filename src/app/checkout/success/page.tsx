import Link from "next/link";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Payment received</h1>
      <p className="mt-3 text-muted-foreground">
        Thank you. We’ll email you and follow up to calculate shipping/freight and schedule delivery.
      </p>
      <div className="mt-8 rounded-lg border p-4 text-sm">
        <div className="font-medium">Stripe session</div>
        <div className="mt-1 text-muted-foreground break-all">
          {searchParams.session_id ?? "(missing)"}
        </div>
      </div>
      <div className="mt-10 flex gap-4">
        <Link className="rounded-md bg-black px-5 py-3 text-white" href="/">
          Back to home
        </Link>
        <Link className="rounded-md border px-5 py-3" href="/products">
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
