import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CreditCard, Zap, ShieldCheck, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-xl font-bold tracking-tight">Paygate</span>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#payment-methods" className="hover:text-foreground transition-colors">Payment Methods</a>
            <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center">
        <Badge variant="secondary" className="mb-6 text-xs">
          Portfolio project — SAMA-inspired architecture
        </Badge>
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight leading-tight md:text-6xl">
          A payment gateway
          <br />
          <span className="text-muted-foreground">built from scratch</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Paygate abstracts Stripe and Checkout.com behind a unified API — one integration
          for Visa, Mastercard, Apple Pay, and Mada. Built with Rails 8, PostgreSQL, Redis,
          and Sidekiq.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">
              Create account <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs">View docs</Link>
          </Button>
        </div>
      </section>

      {/* Payment methods */}
      <section id="payment-methods" className="border-y bg-muted/40 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Supported payment methods
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Visa", via: "Stripe" },
              { label: "Mastercard", via: "Stripe" },
              { label: "Apple Pay", via: "Stripe" },
              { label: "Mada", via: "Checkout.com" },
            ].map(({ label, via }) => (
              <div
                key={label}
                className="rounded-xl border bg-background p-6 text-center shadow-sm"
              >
                <CreditCard className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-semibold">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">via {via}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            Built for real production
          </h2>
          <p className="mb-16 text-center text-muted-foreground">
            Every subsystem you would find in an actual payment gateway.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Idempotent by default",
                desc: "Every charge mutation requires an Idempotency-Key. Retry safely without risk of double-billing.",
              },
              {
                icon: Zap,
                title: "Async webhook delivery",
                desc: "Outbound webhooks are dispatched via Sidekiq with exponential backoff (1m → 5m → 30m → 2h → 24h) and HMAC-SHA256 signatures.",
              },
              {
                icon: Globe,
                title: "Double-entry ledger",
                desc: "Every financial state change creates a corresponding LedgerEntry. Full audit trail with no mutable records.",
              },
              {
                icon: CreditCard,
                title: "Smart routing",
                desc: "PaymentRouterService uses Strategy pattern to automatically route charges to the right provider based on payment method.",
              },
              {
                icon: ShieldCheck,
                title: "API key management",
                desc: "Sandbox and live key pairs. Secret keys are bcrypt-hashed at rest, shown once, and revocable at any time.",
              },
              {
                icon: Zap,
                title: "Partitioned charges table",
                desc: "Monthly RANGE partitions on created_at with automated partition creation via PartitionManagerJob.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-xl border p-6">
                <Icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/40 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Ready to integrate?</h2>
          <p className="mb-8 text-muted-foreground">
            Register a sandbox account and process your first payment in under five minutes.
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Start for free <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Paygate — Portfolio project by Mahmoud Bakr</p>
      </footer>
    </div>
  );
}
