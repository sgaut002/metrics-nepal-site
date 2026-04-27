import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  whitePaperCharts,
  whitePaperHeadlineMetrics,
  whitePaperSource,
} from "./whitePaperCharts";

const NAV_ITEMS = [
  { label: "About us", href: "#about" },
  { label: "Insights", href: "#insights" },
  { label: "Projects", href: "#papers" },
  { label: "Careers", href: "#careers" },
];

const ARTICLE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/#insights" },
  { label: "Contact", href: "mailto:contact@metricsnepal.com" },
];

const PRIVATE_SCHOOLS_PATH = "/insights/private-schools-better";
const WHITE_PAPER_PATH = "/insights/government-white-paper";
const PRIVATE_SCHOOLS_HASH_PATH = `#${PRIVATE_SCHOOLS_PATH}`;
const WHITE_PAPER_HASH_PATH = `#${WHITE_PAPER_PATH}`;

const PRIVATE_SCHOOLS_ARTICLE = {
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
      text: "When you see graphs like above - we reinforce our logic - private students make up a much higher portion of the highest achievers even though they’re a smaller portion of the total student pool. This leads many of us to conclude that the “level” of education in private schools is simply higher. Here is where our logic is flawed.",
    },
    {
      type: "p",
      text: "That logic would’ve stood if all students were randomized and divided into public and private school groups randomly. However, that’s not the case. We’ve repeatedly seen families with higher incomes, stronger educational backgrounds, and urban access enroll their children into private schools at a higher rate. These factors combined might independently affect student performance - outside of school choice.",
    },
    {
      type: "img",
      src: "/insights-private-schools-2.png",
      alt: "Student background differences chart",
    },
    {
      type: "p",
      text: "This shows the observational gap largely reflects selection bias rather than school driven outcomes. Once we start digging a little bit deeper - we realize this isn’t binary either. There isn’t a single quality standard of a public or a private school. A private school in Achham won’t be the same as a private school in Pokhara, and a public school in Bajura won’t be the same as a public school in Kathmandu. The most visible examples are found in public school performances in dense urban centers compared to rural private schools.",
    },
    {
      type: "img",
      src: "/insights-private-schools-3.png",
      alt: "School quality variation chart",
    },
    {
      type: "p",
      text: "This heterogeneity in schools, along with our previous understanding of student backgrounds leads us to fundamentally question assumptions we made at the beginning - the apparent “better” stature of private schools is now much less clear. When we make observational correlations, we overstate the value of any single factor, disregarding several other mechanisms.",
    },
    {
      type: "p",
      text: "The relevant question is not whether a school is public or private, but how much value it adds given the students it serves. Policies and decisions based solely on sectoral comparisons risk misidentifying the problem. Improving educational outcomes requires focusing on measurable quality and student-level progress, rather than broad institutional categories.",
    },
  ],
};

const WHITE_PAPER_TITLE = "What’s in the Government’s White Paper?";
const WHITE_PAPER_DISCLAIMER =
  "Figures are descriptive and do not imply causal relationships. Reference years and definitions vary across indicators.";
const WHITE_PAPER_SUBTITLE =
  "A fast consulting-style data brief summarizing key descriptive indicators from the Government of Nepal’s Baisakh 2083 / April 2026 economic status paper.";
const WHITE_PAPER_TAB_ORDER = Object.keys(whitePaperCharts);
const CHART_COLORS = ["#18356d", "#b04646", "#5f6b7a", "#d48657"];

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPlainNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatChartValue(chart, datum) {
  const value = datum[chart.yKey] ?? datum.value;

  if (chart.id === "west-asia-exposure") {
    return datum.label.includes("Remittance")
      ? `${formatPlainNumber(value)}%`
      : formatCompactNumber(value);
  }

  if (chart.unit === "%") {
    return `${formatPlainNumber(value)}%`;
  }

  if (chart.unit === "% of GDP") {
    return `${formatPlainNumber(value)}%`;
  }

  if (chart.unit === "MW") {
    return `${formatPlainNumber(value)} MW`;
  }

  if (chart.unit === "workers") {
    return formatCompactNumber(value);
  }

  if (chart.unit === "taxpayers") {
    return formatCompactNumber(value);
  }

  return formatPlainNumber(value);
}

function formatAxisTick(chart, value) {
  if (chart.unit === "%" || chart.unit === "% of GDP") {
    return `${value}%`;
  }

  if (chart.unit === "MW" || chart.unit === "workers" || chart.unit === "taxpayers") {
    return formatCompactNumber(value);
  }

  return formatPlainNumber(value);
}

function compactLabel(value, limit = 18) {
  if (typeof value !== "string") return value;
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

function HamburgerButton({ controlsId, isOpen, onClick }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-xl border border-blue-900/15 p-3 text-blue-900 transition hover:bg-blue-50 md:hidden"
      aria-expanded={isOpen}
      aria-controls={controlsId}
      aria-label="Toggle navigation menu"
      onClick={onClick}
    >
      <span className="flex h-4 w-5 flex-col justify-between">
        <span className="block h-0.5 w-full rounded-full bg-current" />
        <span className="block h-0.5 w-full rounded-full bg-current" />
        <span className="block h-0.5 w-full rounded-full bg-current" />
      </span>
    </button>
  );
}

function MobileDrawer({ items, menuId, onClose }) {
  return (
    <div className="md:hidden">
      <button
        type="button"
        className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[2px]"
        aria-label="Close navigation menu"
        onClick={onClose}
      />
      <nav
        id={menuId}
        className="fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-l border-blue-900/10 bg-white px-6 py-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-900">
            Menu
          </div>
          <button
            type="button"
            className="rounded-xl border border-blue-900/15 px-3 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-50"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-8 flex flex-col gap-5">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-base font-medium text-blue-900 transition hover:text-red-600"
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

function SiteHeader({
  navItems,
  isMobileMenuOpen,
  menuId,
  logoClassName,
  onCloseMobileMenu,
  onToggleMobileMenu,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-900/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <a
            href="https://metricsnepal.com"
            className="flex items-center"
            aria-label="Metrics Nepal home"
          >
            <img src="/logo.png" alt="Metrics Nepal" className={logoClassName} />
          </a>
        </div>

        <HamburgerButton
          controlsId={menuId}
          isOpen={isMobileMenuOpen}
          onClick={onToggleMobileMenu}
        />

        <nav className="hidden items-center gap-6 text-xs sm:text-sm md:flex">
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

      {isMobileMenuOpen ? (
        <MobileDrawer items={navItems} menuId={menuId} onClose={onCloseMobileMenu} />
      ) : null}
    </header>
  );
}

function InsightArticlePage({ isMobileMenuOpen, onCloseMobileMenu, onToggleMobileMenu }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader
        navItems={ARTICLE_NAV_ITEMS}
        isMobileMenuOpen={isMobileMenuOpen}
        menuId="article-mobile-menu"
        logoClassName="h-14 w-auto sm:h-24"
        onCloseMobileMenu={onCloseMobileMenu}
        onToggleMobileMenu={onToggleMobileMenu}
      />

      <main>
        <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
          <div className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Insights
          </div>
          <h1 className="mt-4 text-center text-3xl font-bold text-blue-900 sm:text-4xl">
            {PRIVATE_SCHOOLS_ARTICLE.title}
          </h1>
          <div className="mt-10 space-y-6 text-lg leading-8 text-slate-700">
            {PRIVATE_SCHOOLS_ARTICLE.content.map((block, index) =>
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

function WhitePaperChartGraphic({ chart }) {
  const [isCompactViewport, setIsCompactViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  const hasSeries = Boolean(chart.series);
  const useVerticalBars = !hasSeries && !isCompactViewport;
  const chartHeight = hasSeries
    ? 320
    : useVerticalBars
      ? Math.max(300, chart.data.length * 62)
      : Math.max(320, chart.data.length * 56);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      setIsCompactViewport(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {chart.id === "west-asia-exposure" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {chart.data.map((datum, index) => (
            <div
              key={datum.label}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="text-sm font-medium leading-6 text-slate-700">
                {datum.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-blue-950">
                {formatChartValue(chart, datum)}
              </div>
              <div className="mt-4 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[datum]}
                    layout="vertical"
                    margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      hide
                      domain={[0, index === 0 ? 1800000 : 100]}
                    />
                    <YAxis type="category" dataKey="label" hide />
                    <Tooltip
                      cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                      formatter={(value, _name, tooltipItem) => {
                        const item = tooltipItem.payload;
                        return formatChartValue(chart, item);
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill={CHART_COLORS[index]}
                      radius={[0, 10, 10, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6" style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chart.data}
              layout={hasSeries || !useVerticalBars ? "horizontal" : "vertical"}
              margin={
                hasSeries || !useVerticalBars
                  ? {
                      top: 16,
                      right: 16,
                      bottom: isCompactViewport ? 56 : 24,
                      left: 0,
                    }
                  : { top: 16, right: 24, bottom: 16, left: 90 }
              }
              barCategoryGap={hasSeries ? "22%" : "28%"}
            >
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              {hasSeries || !useVerticalBars ? (
                <>
                  <XAxis
                    dataKey={hasSeries ? chart.xKey : chart.xKey}
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    angle={isCompactViewport ? -18 : 0}
                    textAnchor={isCompactViewport ? "end" : "middle"}
                    height={isCompactViewport ? 72 : 30}
                    interval={0}
                    tickFormatter={(value) =>
                      isCompactViewport ? compactLabel(value, hasSeries ? 14 : 16) : value
                    }
                  />
                  <YAxis
                    type="number"
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatAxisTick(chart, value)}
                  />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                </>
              ) : (
                <>
                  <XAxis
                    type="number"
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatAxisTick(chart, value)}
                  />
                  <YAxis
                    type="category"
                    dataKey={chart.xKey}
                    width={140}
                    tick={{ fill: "#475569", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                </>
              )}
              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                formatter={(value, _name, tooltipItem) => {
                  const item = tooltipItem.payload;
                  const payload =
                    chart.yKey && !chart.series
                      ? { ...item, [chart.yKey]: value }
                      : item;
                  return formatChartValue(chart, payload);
                }}
              />
              {hasSeries
                ? chart.series.map((series, index) => (
                    <Bar
                      key={series.key}
                      dataKey={series.key}
                      name={series.label}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))
                : (
                    <Bar
                      dataKey={chart.yKey}
                      fill={CHART_COLORS[0]}
                      radius={useVerticalBars ? [0, 10, 10, 0] : [10, 10, 0, 0]}
                    >
                      <LabelList
                        dataKey={chart.yKey}
                        position={useVerticalBars ? "right" : "top"}
                        formatter={(value) => {
                          const payload = { [chart.yKey]: value };
                          return formatChartValue(chart, payload);
                        }}
                        style={{ fill: "#0f172a", fontSize: 12, fontWeight: 600 }}
                      />
                    </Bar>
                  )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}

function ChartCard({ title, description, source, children, note }) {
  return (
    <article className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700">
          Data Exhibit
        </div>
        <h3 className="text-xl font-semibold text-blue-950">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="mt-6 h-px bg-slate-200" />

      {children}

      {note ? <p className="mt-4 text-sm leading-6 text-slate-500">{note}</p> : null}

      <div className="mt-6 border-t border-slate-200 pt-4 pr-28 text-xs leading-5 text-slate-500">
        {source}
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 text-xs font-medium text-slate-500 opacity-65">
        © Metrics Nepal
      </div>
    </article>
  );
}

function WhitePaperBriefPage({
  activeTab,
  isMobileMenuOpen,
  onChangeTab,
  onCloseMobileMenu,
  onToggleMobileMenu,
}) {
  const activeSection = whitePaperCharts[activeTab];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader
        navItems={ARTICLE_NAV_ITEMS}
        isMobileMenuOpen={isMobileMenuOpen}
        menuId="white-paper-mobile-menu"
        logoClassName="h-14 w-auto sm:h-24"
        onCloseMobileMenu={onCloseMobileMenu}
        onToggleMobileMenu={onToggleMobileMenu}
      />

      <main>
        <section className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_58%,#ffffff_100%)]">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
            <div className="max-w-4xl">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-red-700">
                Insights Brief
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-blue-950 sm:text-5xl">
                {WHITE_PAPER_TITLE}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                {WHITE_PAPER_SUBTITLE}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900">
                  Brief Source
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {whitePaperSource}
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900">
                  Global Disclaimer
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {WHITE_PAPER_DISCLAIMER}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {whitePaperHeadlineMetrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="text-sm font-medium text-slate-500">{metric.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-blue-950">
                  {metric.value}
                </div>
                <div className="mt-2 text-sm text-slate-600">{metric.subtext}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50/70">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              Tabbed Sections
            </div>
            <div className="mt-6 md:hidden">
              <label
                htmlFor="white-paper-section-select"
                className="text-sm font-medium text-slate-700"
              >
                Select section
              </label>
              <select
                id="white-paper-section-select"
                value={activeTab}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-blue-950 shadow-sm outline-none transition focus:border-blue-700"
                onChange={(event) => onChangeTab(event.target.value)}
              >
                {WHITE_PAPER_TAB_ORDER.map((key) => {
                  const section = whitePaperCharts[key];
                  return (
                    <option key={key} value={key}>
                      {section.title}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mt-6 hidden gap-3 overflow-x-auto pb-2 md:flex">
              {WHITE_PAPER_TAB_ORDER.map((key) => {
                const section = whitePaperCharts[key];
                const isActive = key === activeTab;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-blue-900 bg-blue-900 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-900"
                    }`}
                    onClick={() => onChangeTab(key)}
                  >
                    {section.title}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="max-w-3xl">
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-900">
                  Active Section
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950">
                  {activeSection.title}
                </h2>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-2">
                {activeSection.charts.map((chart) => (
                  <ChartCard
                    key={chart.id}
                    title={chart.title}
                    description={chart.description}
                    source={whitePaperSource}
                    note={chart.note}
                  >
                    <WhitePaperChartGraphic chart={chart} />
                  </ChartCard>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-slate-500">
                <p className="text-sm font-medium">Analysis placeholder</p>
                <p className="mt-2 text-sm">
                  Add interpretation here later. Keep this block visible in the code.
                </p>
                <p className="mt-3 text-sm leading-6">{activeSection.placeholderText}</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-5 text-sm leading-6 text-slate-600">
              {whitePaperSource}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Homepage({ isMobileMenuOpen, onCloseMobileMenu, onToggleMobileMenu }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <SiteHeader
        navItems={NAV_ITEMS}
        isMobileMenuOpen={isMobileMenuOpen}
        menuId="mobile-menu"
        logoClassName="h-16 w-auto sm:h-28 lg:h-32"
        onCloseMobileMenu={onCloseMobileMenu}
        onToggleMobileMenu={onToggleMobileMenu}
      />

      <main>
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
                  Projects
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-900/20 bg-white p-8 shadow-sm">
              <div className="text-sm font-semibold text-blue-900">Metrics Nepal</div>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                We’re an econometric data analysis firm dedicated to providing data-driven solutions to current private and policy issues. We are committed to applying cutting-edge methods to deliver on Nepal&apos;s business and policy potential.
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

        <section id="about" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
          <div className="text-center text-lg font-semibold uppercase tracking-[0.3em] text-blue-900">
            About us
          </div>
          <div className="mt-6 flex items-center justify-center rounded-xl border border-blue-900/10 bg-blue-50 p-8 text-center text-lg text-slate-700">
            Metrics Nepal is a research platform applying rigorous economic analysis to real-world policy and market decisions in Nepal. We combine data, analytical methods, and economic reasoning to move beyond intuition-led approaches. Our work delivers clear insights, practical evaluations, and structured reports that quantify impact, uncover key drivers, and support better decision-making across both public and private sectors.
          </div>
        </section>

        <section id="insights" className="scroll-mt-28 border-y border-red-200 bg-red-50">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
              Insights
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <a
                href={WHITE_PAPER_HASH_PATH}
                className="group rounded-xl border border-red-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-md"
              >
                <div className="rounded-t-xl bg-[linear-gradient(135deg,#142b5f_0%,#203f86_55%,#b04646_100%)] p-5 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                    Consulting Brief
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-7">
                    {WHITE_PAPER_TITLE}
                  </h3>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white/10 px-3 py-2">
                      <div className="text-blue-100">GDP Growth</div>
                      <div className="mt-1 text-lg font-semibold">3.5%</div>
                    </div>
                    <div className="rounded-xl bg-white/10 px-3 py-2">
                      <div className="text-blue-100">Public Debt</div>
                      <div className="mt-1 text-lg font-semibold">43.8%</div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
                    Insights
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Explore an interactive consulting-style data brief with tabbed sections, headline metrics, and chart exhibits.
                  </p>
                </div>
              </a>

              <a
                href={PRIVATE_SCHOOLS_HASH_PATH}
                className="group rounded-xl border border-red-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-red-300 hover:shadow-md"
              >
                <img
                  src="/insights-private-schools-1.png"
                  alt={PRIVATE_SCHOOLS_ARTICLE.title}
                  className="h-40 w-full rounded-t-xl object-cover"
                />
                <div className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
                    Insights
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-blue-900">
                    {PRIVATE_SCHOOLS_ARTICLE.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">Read the full analysis.</p>
                </div>
              </a>

              <div className="rounded-xl border border-dashed border-red-200 bg-white/70 p-6 text-sm leading-6 text-slate-500">
                Additional insight briefs are in development.
              </div>
            </div>
          </div>
        </section>

        <section id="papers" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-900">
            Projects
          </div>
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl border border-blue-900/10 bg-blue-50" />
            ))}
          </div>
        </section>

        <section id="careers" className="scroll-mt-28 bg-blue-900 text-white">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10">
            <div className="text-center text-lg font-semibold uppercase tracking-[0.3em] text-blue-200">
              Careers
            </div>
            <div className="mt-6 flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-8 text-center text-lg text-blue-100">
              No openings at this moment. We&apos;ll let you know if any opportunities open up!
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function MetricsNepalHomepage() {
  const [locationKey, setLocationKey] = useState(() =>
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.hash}`
      : ""
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeWhitePaperTab, setActiveWhitePaperTab] = useState(
    WHITE_PAPER_TAB_ORDER[0]
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [locationKey]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const matchesPath = (path) =>
    typeof window !== "undefined" &&
    (locationKey.includes(`#${path}`) || locationKey.startsWith(path));

  const isPrivateSchoolsPage = matchesPath(PRIVATE_SCHOOLS_PATH);
  const isWhitePaperPage = matchesPath(WHITE_PAPER_PATH);

  if (isPrivateSchoolsPage) {
    return (
      <InsightArticlePage
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        onToggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)}
      />
    );
  }

  if (isWhitePaperPage) {
    return (
      <WhitePaperBriefPage
        activeTab={activeWhitePaperTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onChangeTab={setActiveWhitePaperTab}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        onToggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)}
      />
    );
  }

  return (
    <Homepage
      isMobileMenuOpen={isMobileMenuOpen}
      onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      onToggleMobileMenu={() => setIsMobileMenuOpen((open) => !open)}
    />
  );
}
