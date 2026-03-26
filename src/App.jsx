export default function MetricsNepalHomepage() {
  const navItems = [
    { label: "About us", href: "#about" },
    { label: "Insights", href: "#insights" },
    { label: "Papers", href: "#papers" },
    { label: "Careers", href: "#careers" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-blue-900/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            {/* Make sure logo.png exists in public folder */}
            <img src="/logo.png" alt="Metrics Nepal" className="h-24 w-auto" />
          </div>

          <nav className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-blue-900 transition hover:text-red-600"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative border-b border-blue-900/10 bg-gradient-to-br from-blue-50 via-white to-red-50">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-blue-900">Data-driven solutions</span>{" "}
                <span className="text-red-600">for an efficient Nepal</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Applying rigorous analysis to policy, markets, and public decision-making.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#insights"
                  className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Insights
                </a>
                <a
                  href="#papers"
                  className="rounded-xl border border-blue-900 px-6 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                >
                  Papers
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-900/20 bg-white p-8 shadow-sm">
              <div className="text-sm font-semibold text-blue-900">Metrics Nepal</div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                We’re an econometric data analysis firm dedicated to providing data-driven solutions to current private and policy issues. We are committed to applying cutting-edge methods to deliver on Nepal's business and policy potential.
              </p>
              <div className="mt-6">
                <a
                  href="mailto:contact@metricsnepal.com"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900">
            About us
          </div>
          <div className="mt-6 h-32 rounded-xl border border-blue-900/10 bg-blue-50" />
        </section>

        {/* INSIGHTS */}
        <section id="insights" className="scroll-mt-28 border-y border-red-200 bg-red-50">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              Insights
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-xl border border-red-200 bg-white" />
              ))}
            </div>
          </div>
        </section>

        {/* PAPERS */}
        <section id="papers" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900">
            Papers
          </div>
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl border border-blue-900/10 bg-blue-50" />
            ))}
          </div>
        </section>

        {/* CAREERS */}
        <section id="careers" className="scroll-mt-28 bg-blue-900 text-white">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Careers
            </div>
            <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-6 text-sm text-blue-100">
              No openings at this moment. We'll let you know if any opportunities open up!
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
