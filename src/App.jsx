import { useEffect, useState } from "react";

export default function MetricsNepalHomepage() {
  const [locationKey, setLocationKey] = useState(() =>
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.hash}`
      : ""
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleLocationChange = () =>
      setLocationKey(`${window.location.pathname}${window.location.hash}`);
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);
  const navItems = [
    { label: "About us", href: "#about" },
    { label: "Insights", href: "#insights" },
    { label: "Papers", href: "#papers" },
    { label: "Careers", href: "#careers" },
  ];
  const articlePath = "/insights/private-schools-better";
  const articleHashPath = `#${articlePath}`;
  const article = {
    title: 'Are private schools really “better”?',
    content: [
      {
        type: "p",
        text: 'There’s a persistent narrative in Nepal that private schools are “better” than public or as we better know them, “government schools”. This is generally linked to visible educational outcomes - SEE pass rates, language proficiency, and standardized testing. But is this reflecting private schools or the students attending them?',
      },
      {
        type: "img",
        src: "/insights-private-schools-1.png",
        alt: "Private vs public school performance chart",
      },
      {
        type: "p",
        text: 'When you see graphs like above - we reinforce our logic - private students make up a much higher portion of the highest achievers even though they’re a smaller portion of the total student pool. This leads many of us to conclude that the “level” of education in private schools is simply higher. Here is where our logic is flawed.',
      },
      {
        type: "p",
        text: 'That logic would’ve stood if all students were randomized and divided into public and private school groups randomly. However, that’s not the case. We’ve repeatedly seen families with higher incomes, stronger educational backgrounds, and urban access enroll their children into private schools at a higher rate. These factors combined might independently affect student performance - outside of school choice.',
      },
      {
        type: "img",
        src: "/insights-private-schools-2.png",
        alt: "Student background differences chart",
      },
      {
        type: "p",
        text: 'This shows the observational gap largely reflects selection bias rather than school driven outcomes. Once we start digging a little bit deeper - we realize this isn’t binary either. There isn’t a single quality standard of a public or a private school. A private school in Achham won’t be the same as a private school in Pokhara, and a public school in Bajura won’t be the same as a public school in Kathmandu. The most visible examples are found in public school performances in dense urban centers compared to rural private schools.',
      },
      {
        type: "img",
        src: "/insights-private-schools-3.png",
        alt: "School quality variation chart",
      },
      {
        type: "p",
        text: 'This heterogeneity in schools, along with our previous understanding of student backgrounds leads us to fundamentally question assumptions we made at the beginning - the apparent “better” stature of private schools is now much less clear. When we make observational correlations, we overstate the value of any single factor, disregarding several other mechanisms.',
      },
      {
        type: "p",
        text: 'The relevant question is not whether a school is public or private, but how much value it adds given the students it serves. Policies and decisions based solely on sectoral comparisons risk misidentifying the problem. Improving educational outcomes requires focusing on measurable quality and student-level progress, rather than broad institutional categories.',
      },
    ],
  };
  const isArticlePage =
    typeof window !== "undefined" &&
    (locationKey.includes(articleHashPath) ||
      locationKey.startsWith(articlePath));

  if (isArticlePage) {
    const articleNavItems = [
      { label: "Home", href: "/" },
      { label: "Insights", href: "/#insights" },
      { label: "Contact", href: "mailto:contact@metricsnepal.com" },
    ];

    return (
      <div className="min-h-screen bg-white text-slate-900">
        <header className="sticky top-0 z-50 border-b border-blue-900/10 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
            <div className="flex items-center gap-3">
              <a
                href="https://metricsnepal.com"
                className="flex items-center"
                aria-label="Metrics Nepal home"
              >
                <img
                  src="/logo.png"
                  alt="Metrics Nepal"
                  className="h-20 w-auto sm:h-24"
                />
              </a>
            </div>

            <nav className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
              {articleNavItems.map((item) => (
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
          <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
            <div className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              Insights
            </div>
            <h1 className="mt-4 text-center text-3xl font-bold text-blue-900 sm:text-4xl">
              {article.title}
            </h1>
            <div className="mt-10 space-y-6 text-lg leading-8 text-slate-700">
              {article.content.map((block, index) =>
                block.type === "img" ? (
                  <img
                    key={`${block.src}-${index}`}
                    src={block.src}
                    alt={block.alt}
                    className="w-full rounded-2xl border border-blue-900/10 bg-white shadow-sm"
                  />
                ) : (
                  <p key={`${block.text}-${index}`}>{block.text}</p>
                )
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-blue-900/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div className="flex items-center gap-3">
            {/* Make sure logo.png exists in public folder */}
            <a href="https://metricsnepal.com" className="flex items-center" aria-label="Metrics Nepal home">
              <img src="/logo.png" alt="Metrics Nepal" className="h-24 w-auto sm:h-28 lg:h-32" />
            </a>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
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
          <div className="text-center text-lg font-semibold uppercase tracking-[0.3em] text-blue-900">
            About us
          </div>
          <div className="mt-6 flex items-center justify-center rounded-xl border border-blue-900/10 bg-blue-50 p-8 text-center text-lg text-slate-700">
            Metrics Nepal is a research platform applying rigorous economic analysis to real-world policy and market decisions in Nepal. We combine data, analytical methods, and economic reasoning to move beyond intuition-led approaches. Our work delivers clear insights, practical evaluations, and structured reports that quantify impact, uncover key drivers, and support better decision-making across both public and private sectors.
          </div>
        </section>

        {/* INSIGHTS */}
        <section id="insights" className="scroll-mt-28 border-y border-red-200 bg-red-50">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              Insights
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <a
                href={articleHashPath}
                className="group rounded-xl border border-red-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-md"
              >
                <img
                  src="/insights-private-schools-1.png"
                  alt={article.title}
                  className="h-40 w-full rounded-t-xl object-cover"
                />
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
                    Insights
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-blue-900">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Read the full analysis.
                  </p>
                </div>
              </a>
              {[2, 3].map((i) => (
                <div key={i} className="h-72 rounded-xl border border-red-200 bg-white" />
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
            <div className="text-center text-lg font-semibold uppercase tracking-[0.3em] text-blue-200">
              Careers
            </div>
            <div className="mt-6 flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-8 text-center text-lg text-blue-100">
              No openings at this moment. We'll let you know if any opportunities open up!
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
