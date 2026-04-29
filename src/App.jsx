import { memo, useEffect, useState } from "react";
import "katex/dist/katex.min.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BlockMath, InlineMath } from "react-katex";
import {
  whitePaperCharts,
  whitePaperHeadlineMetrics,
  whitePaperSource,
} from "./whitePaperCharts";

const NAV_ITEMS = [
  { label: "About us", href: "/#about" },
  { label: "Insights", href: "/#insights" },
  { label: "Projects", href: "/#papers" },
  { label: "Data", href: "/" },
  { label: "Careers", href: "/#careers" },
  { label: "Contact", href: "/#contact" },
];

const PRIVATE_SCHOOLS_PATH = "/insights/private-schools-better";
const WHITE_PAPER_PATH = "/insights/government-white-paper";
const CONSUMER_TARIFFS_PROJECT_PATH = "/projects/will-consumer-tariffs-work";
const PRIVATE_SCHOOLS_HASH_PATH = `#${PRIVATE_SCHOOLS_PATH}`;
const WHITE_PAPER_HASH_PATH = `#${WHITE_PAPER_PATH}`;
const CONSUMER_TARIFFS_PROJECT_HASH_PATH = `#${CONSUMER_TARIFFS_PROJECT_PATH}`;

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
const CONSUMER_TARIFFS_PROJECT = {
  title: "Will consumer tariffs work?",
  tag: "Working Project",
  subtitle:
    "Consumer-level tariff enforcement as a spatial tax-evasion and substitution problem under enforcement frictions.",
  status:
    "Institutional working project · April 2026 · Awaiting updated government data",
  description:
    "A working project on consumer-level tariff enforcement, spatial arbitrage, evasion, and domestic market response.",
};
const WHITE_PAPER_DISCLAIMER =
  "Figures are descriptive and do not imply causal relationships. Reference years and definitions vary across indicators.";
const WHITE_PAPER_SUBTITLE =
  "A complementary data brief of the Government of Nepal’s recent white paper. The key numbers—reframed for clarity, context, and quick reading.";
const WHITE_PAPER_TAB_ORDER = Object.keys(whitePaperCharts);
const CHART_COLORS = ["#18356d", "#b04646", "#5f6b7a", "#d48657"];
const RESPONSIVE_LABEL_MAP = {
  "10-year average": "10yr avg",
  "FY 2081/82": "FY 81/82",
  "FY 2082/83 projection": "FY 82/83 proj.",
  Agriculture: "Agriculture",
  Industry: "Industry",
  Services: "Services",
  "Employment share": "Jobs share",
  "GDP share": "GDP share",
  "New approvals, FY 2081/82": "New approvals FY 81/82",
  "Renewed approvals, FY 2081/82": "Renewed FY 81/82",
  "Total, FY 2081/82": "Total FY 81/82",
  "New approvals, current FY to Chaitra 12": "New approvals YTD",
  "Renewed approvals, current FY to Chaitra 12": "Renewed YTD",
  "Total, current FY to Chaitra 12": "Total YTD",
  "Nepali workers in West Asia": "Workers in West Asia",
  "Remittance share from West Asia": "Remittance share",
  VAT: "VAT",
  "Income tax": "Income tax",
  Customs: "Customs",
  Excise: "Excise",
  "Non-tax revenue": "Non-tax revenue",
  "FY 2072/73": "FY 72/73",
  "Current expenditure": "Current spending",
  "Capital expenditure": "Capital spending",
  Financing: "Financing",
  "Share of federal expenditure": "Expenditure share",
  "Share of federal revenue": "Revenue share",
  "Gross domestic saving": "Domestic saving",
  "Total investment": "Investment",
  "Saving-investment gap": "Saving gap",
  "Gross national saving": "National saving",
  "Total consumption": "Consumption",
  "Total PAN": "Total PAN",
  "Individual PAN": "Individual PAN",
  "Business PAN": "Business PAN",
  "VAT registered": "VAT registered",
  "Excise registered": "Excise registered",
  "Internal revenue from 100 large taxpayers": "100 large taxpayers",
  "Informal economy estimate": "Informal economy",
  "Unregistered establishments": "Unregistered establishments",
  "Registered establishments keeping accounts": "Keeping accounts",
  Federal: "Federal",
  Province: "Province",
  Local: "Local",
  "Province and local": "Province and local",
  "Progress achieved by 2022": "2022 progress",
  "Projected progress by 2030": "2030 progress",
  Target: "Target",
  "CPI score": "CPI score",
  "HDI score × 100": "HDI score × 100",
  "CPI rank": "CPI rank",
  "HDI rank": "HDI rank",
  "Up to Ashar 2068": "Ashar 2068",
  "Falgun 2082": "Falgun 2082",
  "Foreign tourist arrivals, 2025": "Tourist arrivals",
  "Tourist-standard hotels": "Tourist hotels",
  "Daily bed capacity": "Daily bed capacity",
};

const MOBILE_HORIZONTAL_CHART_IDS = new Set([
  "pan-registration",
  "saving-investment-gap",
  "tax-base-stress",
  "tourism-capacity",
]);

function getResponsiveLabel(fullLabel, isMobile) {
  if (typeof fullLabel !== "string") return fullLabel;
  if (!isMobile) return fullLabel;
  return RESPONSIVE_LABEL_MAP[fullLabel] ?? fullLabel;
}

function getChartLabelKey(chart) {
  return chart.xKey;
}

function getChartLabels(chart) {
  const labelKey = getChartLabelKey(chart);
  if (!labelKey || !Array.isArray(chart.data)) return [];
  return chart.data
    .map((datum) => datum?.[labelKey])
    .filter((value) => typeof value === "string");
}

function shouldUseMobileHorizontalLayout(chart, isMobile) {
  if (!isMobile || chart.series) return false;
  if (MOBILE_HORIZONTAL_CHART_IDS.has(chart.id)) return true;

  const labels = getChartLabels(chart);
  const longLabelCount = labels.filter((label) => getResponsiveLabel(label, true).length > 16).length;

  return labels.length > 4 && longLabelCount > 0;
}

const analysisNotes = {
  growthStructure: [
    "Growth remains modest and uneven, with the latest projection pointing to a loss of momentum after the post-recovery rebound.",
    "The economy continues to tilt toward services, while industry has yet to establish a stronger footing—suggesting a shift in composition rather than broad-based transformation.",
    "Agriculture still employs a large share of the workforce relative to its output, highlighting a persistent gap in productivity.",
  ],
  laborMigration: [
    "Foreign employment continues to absorb a large share of the labor force, underscoring limited job creation at home.",
    "The concentration of workers and remittances in West Asia exposes the economy to external shocks beyond domestic control.",
    "Remittances provide stability, but also reinforce dependence on external labour markets.",
  ],
  fiscalFinance: [
    "Revenue growth has softened while expenditure remains rigid, narrowing fiscal room for manoeuvre.",
    "Rising debt and servicing costs point to growing pressure on budget composition rather than just headline borrowing levels.",
    "Limited capital spending suggests weak transmission from public finance to long-term productivity.",
  ],
  savingsInvestment: [
    "Domestic saving remains low relative to investment, reflecting a weak internal financing base.",
    "Higher national saving is largely supported by external inflows rather than domestic income generation.",
    "The gap points to a structural reliance on external resources to sustain investment.",
  ],
  taxBase: [
    "Tax registration has expanded, but effective compliance and contribution remain uneven.",
    "Revenue is concentrated among a small group of large taxpayers, while informality remains widespread.",
    "The constraint is less about rates and more about the breadth and enforceability of the tax base.",
  ],
  federalism: [
    "Spending responsibilities are increasingly decentralized, but revenue collection remains highly centralized.",
    "Subnational governments show moderate budget utilization, pointing to capacity constraints.",
    "The imbalance suggests that decentralization has yet to fully translate into effective service delivery.",
  ],
  developmentGovernance: [
    "Progress on development indicators remains gradual, with gaps relative to long-term targets.",
    "Governance and institutional capacity continue to shape outcomes as much as resource availability.",
    "The transition out of LDC status raises the importance of strengthening domestic economic foundations.",
  ],
  infrastructureTourism: [
    "Energy capacity has expanded significantly, reflecting progress in physical infrastructure.",
    "However, utilization depends on transmission, demand, and system reliability rather than capacity alone.",
    "Tourism shows recovery potential, but infrastructure constraints continue to limit scale.",
  ],
};

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

function resolveChartValue(chart, datumOrValue, valueKey) {
  if (typeof datumOrValue === "number") return datumOrValue;

  if (
    typeof datumOrValue === "string" &&
    datumOrValue.trim() !== "" &&
    !Number.isNaN(Number(datumOrValue))
  ) {
    return Number(datumOrValue);
  }

  if (!datumOrValue || typeof datumOrValue !== "object") return null;

  const candidateKeys = [valueKey, chart.yKey, "value"].filter(Boolean);

  for (const key of candidateKeys) {
    const candidate = datumOrValue[key];
    if (typeof candidate === "number") return candidate;
    if (
      typeof candidate === "string" &&
      candidate.trim() !== "" &&
      !Number.isNaN(Number(candidate))
    ) {
      return Number(candidate);
    }
  }

  return null;
}

function formatChartValue(chart, datumOrValue, valueKey) {
  const value = resolveChartValue(chart, datumOrValue, valueKey);

  if (value === null) {
    return "N/A";
  }

  if (chart.id === "west-asia-exposure") {
    const label =
      typeof datumOrValue === "object" && datumOrValue !== null
        ? datumOrValue.label
        : "";

    return typeof label === "string" && label.includes("Remittance")
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

function getTooltipLabel(chart, tooltipItem, fallbackLabel) {
  if (tooltipItem?.payload && chart.xKey) {
    const payloadLabel = tooltipItem.payload[chart.xKey];
    if (typeof payloadLabel === "string") {
      return payloadLabel;
    }
  }

  if (typeof fallbackLabel === "string" && fallbackLabel.trim() !== "") {
    return fallbackLabel;
  }

  if (chart.series && tooltipItem?.name) {
    return tooltipItem.name;
  }

  if (tooltipItem?.name && tooltipItem.name !== "value") {
    return tooltipItem.name;
  }

  return chart.title;
}

function ChartTooltip({ active, payload, label, chart }) {
  if (!active || !payload || payload.length === 0) return null;

  const title = getTooltipLabel(chart, payload[0], label);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry, index) => {
          const formattedValue = formatChartValue(chart, entry.payload, entry.dataKey);
          const seriesLabel = chart.series ? entry.name : null;

          return (
            <div key={`${entry.dataKey}-${index}`} className="flex items-center gap-2 text-sm text-slate-700">
              {chart.series ? (
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: entry.color || CHART_COLORS[index % CHART_COLORS.length] }}
                />
              ) : null}
              {seriesLabel ? <span className="font-medium">{seriesLabel}:</span> : null}
              <span className="font-semibold text-slate-900">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
    <header className="sticky top-0 z-50 border-b border-[#E0E0DC] bg-[#F5F5F3]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <div className="flex items-center gap-3">
          <a
            href="https://metricsnepal.com"
            className="flex items-center"
            aria-label="Metrics Nepal home"
          >
            <img
              src="/logo-2026.png"
              alt="Metrics Nepal"
              className={`${logoClassName} bg-transparent mix-blend-multiply`}
            />
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
              className="text-sm font-normal text-[#173A8A] transition hover:text-[#C8102E]"
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
    <div className="min-h-screen bg-[#F5F5F3] text-slate-900 [font-family:Inter,ui-sans-serif,system-ui,sans-serif]">
      <SiteHeader
        navItems={NAV_ITEMS}
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
          <h1 className="mt-4 text-center text-3xl font-semibold text-[#173A8A] sm:text-4xl [font-family:Georgia,'Times_New_Roman',serif]">
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

function ProjectVisualCard({ title, children }) {
  return (
    <div className="w-full max-w-full min-w-0 rounded-2xl border border-[#E0E0DC] bg-[#FAFAF8] p-5 sm:p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8102E]">
        Conceptual mechanism
      </div>
      <div className="mt-2 text-base font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
        {title}
      </div>
      <div className="graph-card mt-5 w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-[#E3E6EB] bg-white p-4 box-border [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full [&_svg]:w-full">
        {children}
      </div>
    </div>
  );
}

function EquationCard({
  title,
  math,
  interpretation,
  appendixTitle,
  appendixChildren,
}) {
  return (
    <div className="equation-card w-full max-w-full min-w-0 overflow-x-auto box-border rounded-lg border border-[#E3E6EB] bg-[#F7F8FA] p-5 sm:p-6 [&_.katex-display]:my-5 [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto [&_.katex-display]:text-center [&_.katex]:font-['Times_New_Roman',Georgia,serif]">
      <div className="equation-title mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#C1121F]">
        {title}
      </div>
      <div className="overflow-x-auto text-[#173A8A]">
        <BlockMath math={math} />
      </div>
      <div className="mt-4 text-base leading-7 text-slate-700">{interpretation}</div>
      {appendixChildren ? (
        <details className="mt-5 rounded-lg border border-[#E3E6EB] bg-white/75 p-4">
          <summary className="cursor-pointer text-sm font-medium text-[#173A8A]">
            {appendixTitle || "Technical appendix"}
          </summary>
          <div className="mt-4 min-w-0 space-y-4 text-sm leading-6 text-slate-700 [&_.katex-display]:my-4 [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto [&_.katex-display]:text-center [&_.katex]:font-['Times_New_Roman',Georgia,serif]">
            {appendixChildren}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function ConsumerTariffsProjectPage({
  isMobileMenuOpen,
  onCloseMobileMenu,
  onToggleMobileMenu,
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-slate-900 [font-family:Inter,ui-sans-serif,system-ui,sans-serif]">
      <SiteHeader
        navItems={NAV_ITEMS}
        isMobileMenuOpen={isMobileMenuOpen}
        menuId="project-mobile-menu"
        logoClassName="h-14 w-auto sm:h-24"
        onCloseMobileMenu={onCloseMobileMenu}
        onToggleMobileMenu={onToggleMobileMenu}
      />

      <main>
        <section className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10 lg:py-20">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
              {CONSUMER_TARIFFS_PROJECT.tag}
            </div>
            <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-[1.08] text-[#173A8A] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">
              {CONSUMER_TARIFFS_PROJECT.title}
            </h1>
            <p className="mt-4 max-w-4xl text-xl leading-8 text-slate-700 [font-family:Georgia,'Times_New_Roman',serif]">
              {CONSUMER_TARIFFS_PROJECT.subtitle}
            </p>
            <div className="mt-6 text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              {CONSUMER_TARIFFS_PROJECT.status}
            </div>
            <div className="mt-8 max-w-4xl space-y-6 text-lg leading-8 text-slate-700">
              <p>
                Consumer tariff enforcement should not be evaluated as a narrow
                question of whether customs officers can collect additional tax
                at the border. The relevant economic question is whether the
                policy expands the effective tax base once spatial arbitrage,
                avoidance, enforcement costs, and domestic market substitution
                are accounted for.
              </p>
              <p>
                In an open-border economy, consumer imports are not a fixed tax
                base. They are an endogenous behavioral margin. Households
                respond to price gaps, travel costs, enforcement risk, waiting
                time, informal brokers, and product substitutability. Retailers
                and customs officials also adapt. The tax base may therefore
                expand, contract, or move into less visible forms of arbitrage.
              </p>
              <p>
                This project models consumer tariffs as an endogenous spatial
                tax-evasion/substitution equilibrium under enforcement
                frictions.
              </p>
            </div>
            <div className="mt-8 max-w-3xl rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                Core question
              </div>
              <p className="mt-3 text-base leading-7 text-slate-700">
                When does taxing cross-border consumer purchases expand the tax
                base, and when does it merely shift activity into costly
                informal arbitrage?
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Literature spine
            </h2>
            <div className="mt-6 space-y-6 text-lg leading-8 text-slate-700">
              <p>
                This project draws on four strands of economic literature.
              </p>
              <p>
                First, the tax compliance and enforcement literature treats
                enforcement as a behavioral technology. Legal liability is not
                equivalent to revenue. Detection probability, penalty
                credibility, administrative capacity, and compliance costs
                determine whether statutory taxes become actual collections.
              </p>
              <p>
                Second, the tariff evasion literature shows that higher tariff
                rates can induce evasion through under-reporting,
                misclassification, informal routing, or missing trade. The
                statutory tax rate may therefore increase the incentive to hide,
                rather than increase the measured tax base.
              </p>
              <p>
                Third, the cross-border shopping literature shows that household
                arbitrage responds sharply to distance, price wedges, and
                product substitutability. Border proximity creates a spatial
                discontinuity in incentives: households close to the border face
                a lower arbitrage cost than interior households.
              </p>
              <p>
                Fourth, the informality literature in developing economies shows
                that tax policy can move activity between formal and informal
                margins. This is central for Nepal, where the key empirical
                object may not be observed arbitrage itself, but noisy proxies
                such as declarations, seizures, footfall, domestic retail sales,
                and VAT filings.
              </p>
            </div>
            <div className="mt-10 rounded-2xl border border-[#E0E0DC] bg-[#FAFAF8] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Short reference list
              </div>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
                <li>- Slemrod and Yitzhaki: tax avoidance, evasion, and administration</li>
                <li>- Fisman and Wei: tariff rates and missing imports</li>
                <li>- Javorcik and Narciso: differentiated products and tariff evasion</li>
                <li>- Mishra, Subramanian, and Topalova: tariffs and customs evasion</li>
                <li>- Asplund, Friberg, and Wilander: cross-border shopping and distance</li>
                <li>- Kleven and Waseem / Waseem: taxation and behavioral response under weak enforcement</li>
                <li>- Bachas, Gadenne, and Jensen: consumption taxes and informality in developing economies</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="project-section mx-auto grid max-w-[1120px] grid-cols-1 gap-8 overflow-x-hidden px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:px-10">
            <div className="min-w-0 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  Conceptual model: consumer arbitrage under enforcement frictions
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  A consumer purchases across the border when the Nepal-side
                  effective price exceeds the India-side effective price plus
                  the full arbitrage cost.
                </p>
              </div>
              <EquationCard
                title="Cross-border arbitrage condition"
                math={String.raw`p^N_{gbt} + t^N_{gbt} > p^I_{gbt} + c_i(d_i, \ell_i, r_{bt}, s_{bt}, b_{bt})`}
                interpretation="The relevant wedge is not the tariff alone. It is the tariff plus the full cost of arbitrage. Enforcement affects behavior by increasing expected crossing cost, but higher enforcement may also create informal intermediation, bribes, waiting costs, or substitution into unobserved channels."
                appendixChildren={
                  <>
                    <p>
                      This condition can be embedded in a discrete-choice model
                      where household <InlineMath math="i" /> chooses
                      cross-border purchase if latent utility from arbitrage is
                      positive:
                    </p>
                    <div className="overflow-x-auto text-[#173A8A]">
                      <BlockMath math={String.raw`A^*_{igbt} = \Delta p_{gbt} - t^N_{gbt} - c_i(d_i,\ell_i,r_{bt},s_{bt},b_{bt}) + u_{igbt}`} />
                    </div>
                    <div className="overflow-x-auto text-[#173A8A]">
                      <BlockMath math={String.raw`A_{igbt}=1[A^*_{igbt}>0]`} />
                    </div>
                    <p>
                      where <InlineMath math={String.raw`\Delta p_{gbt}=p^N_{gbt}-p^I_{gbt}`} />.
                    </p>
                  </>
                }
              />
              <div className="space-y-3 text-base leading-7 text-slate-700">
                <div>- <InlineMath math={String.raw`p^N_{gbt}`} />: Nepal-side price of good <InlineMath math="g" /> near border market <InlineMath math="b" /> at time <InlineMath math="t" /></div>
                <div>- <InlineMath math={String.raw`t^N_{gbt}`} />: consumer tariff or tax wedge</div>
                <div>- <InlineMath math={String.raw`p^I_{gbt}`} />: India-side price of comparable good</div>
                <div>- <InlineMath math={String.raw`c_i(\cdot)`} />: household-specific arbitrage cost</div>
                <div>- <InlineMath math={String.raw`d_i`} />: distance to border</div>
                <div>- <InlineMath math={String.raw`\ell_i`} />: time and travel cost</div>
                <div>- <InlineMath math={String.raw`r_{bt}`} />: enforcement risk</div>
                <div>- <InlineMath math={String.raw`s_{bt}`} />: search/waiting/friction cost</div>
                <div>- <InlineMath math={String.raw`b_{bt}`} />: informal payment or brokerage cost</div>
              </div>
            </div>
            <ProjectVisualCard title="Conceptual mechanism — not empirical data">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full">
                <rect x="8" y="58" width="28" height="12" rx="2" fill="#173A8A" opacity="0.92" />
                <rect x="56" y="26" width="30" height="44" rx="2" fill="#E5E7EB" />
                <rect x="56" y="56" width="30" height="14" rx="2" fill="#173A8A" opacity="0.92" />
                <rect x="56" y="43" width="30" height="13" rx="2" fill="#C8102E" opacity="0.88" />
                <rect x="56" y="33" width="30" height="10" rx="2" fill="#94A3B8" opacity="0.84" />
                <rect x="56" y="26" width="30" height="7" rx="2" fill="#F0B3BD" opacity="0.92" />
                <path d="M39 64H52" stroke="#64748B" strokeWidth="1.3" strokeDasharray="2.5 2.5" />
                <text x="8" y="78" fill="#173A8A" fontSize="4.5" fontWeight="600">Domestic price</text>
                <text x="56" y="78" fill="#173A8A" fontSize="4.3" fontWeight="600">Effective cross-border price</text>
                <text x="59" y="31" fill="#7F1D1D" fontSize="3.3" fontWeight="600">Expected enforcement cost</text>
                <text x="59" y="39" fill="#475569" fontSize="3.3" fontWeight="600">Transaction cost</text>
                <text x="59" y="49" fill="#C8102E" fontSize="3.3" fontWeight="600">Tariff liability</text>
                <text x="59" y="64" fill="#173A8A" fontSize="3.3" fontWeight="600">Foreign price</text>
              </svg>
            </ProjectVisualCard>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC]">
          <div className="project-section mx-auto grid max-w-[1120px] grid-cols-1 gap-8 overflow-x-hidden px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:px-10">
            <div className="min-w-0 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  Spatial bunching and border discontinuity
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  If cross-border arbitrage is economically meaningful,
                  outcomes should change discontinuously with exposure to the
                  border. Households and firms closer to the border face lower
                  arbitrage costs, so consumer purchases, domestic retail sales,
                  and local prices may vary sharply with distance.
                </p>
              </div>
              <EquationCard
                title="Spatial border-exposure specification"
                math={String.raw`Y_{id} = \alpha + \tau BorderExposure_d + f(distance_d) + X_i'\beta + \varepsilon_{id}`}
                interpretation={<>The coefficient <InlineMath math={String.raw`\tau`} /> measures the local border-arbitrage effect after controlling flexibly for distance. The outcome <InlineMath math={String.raw`Y_{id}`} /> may be household purchases, domestic retail expenditure, local prices, or reported cross-border buying. This design is useful because border exposure creates spatial variation in arbitrage cost.</>}
                appendixChildren={
                  <>
                    <p>
                      Allow heterogeneous distance gradients by product type:
                    </p>
                    <div className="overflow-x-auto text-[#173A8A]">
                      <BlockMath math={String.raw`Y_{igbd} = \alpha_g + \tau_g BorderExposure_d + f_g(distance_d) + X_i'\beta_g + \varepsilon_{igbd}`} />
                    </div>
                    <p>
                      This allows goods with different transportability,
                      substitutability, and tax exposure to have different
                      spatial arbitrage responses.
                    </p>
                  </>
                }
              />
            </div>
            <ProjectVisualCard title="Conceptual spatial discontinuity — not empirical data">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full">
                <path d="M10 84H94" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M10 84V12" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M28 12V84" stroke="#C8102E" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M13 38C18 42 22 47 28 55" fill="none" stroke="#173A8A" strokeWidth="2.5" />
                <path d="M28 46C42 56 58 65 90 74" fill="none" stroke="#173A8A" strokeWidth="2.5" />
                <circle cx="22" cy="42" r="1.7" fill="#173A8A" />
                <circle cx="28" cy="55" r="1.7" fill="#173A8A" />
                <circle cx="46" cy="63" r="1.7" fill="#173A8A" />
                <circle cx="66" cy="68" r="1.7" fill="#173A8A" />
                <text x="31" y="18" fill="#C8102E" fontSize="3.4" fontWeight="600">Border threshold</text>
                <text x="61" y="90" fill="#475569" fontSize="3.4" fontWeight="600">Distance from border</text>
                <text x="3" y="10" fill="#475569" fontSize="3.4" fontWeight="600">Outcome</text>
              </svg>
            </ProjectVisualCard>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Tax wedge elasticity by product
            </h2>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-700">
              The central empirical object is not the average tariff rate. It is
              the elasticity of arbitrage with respect to the effective tax
              wedge, differentiated by product and distance.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
              <EquationCard
                title="Heterogeneous arbitrage response"
                math={String.raw`A_{igbt} = \beta_1 TaxWedge_{gbt} + \beta_2 Distance_i + \beta_3 \left(TaxWedge_{gbt}\times Distance_i\right) + X_i'\theta + \gamma_g + \lambda_t + \varepsilon_{igbt}`}
                interpretation="The interaction term tests whether tax wedges matter more for households near the border. A large response near the border and weak response farther inland would support the interpretation that consumer tariffs operate through spatial arbitrage rather than broad domestic demand alone."
              />
              <div className="min-w-0 rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                  Core estimand box
                </div>
                <div className="mt-4 overflow-x-auto text-[#173A8A]">
                  <BlockMath math={String.raw`\varepsilon_{A,\tau} = \frac{\partial \log A_{gbt}}{\partial \log TaxWedge_{gbt}}`} />
                </div>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  How much does arbitrage demand change when the consumer tax
                  wedge changes?
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC]">
          <div className="project-section mx-auto grid max-w-[1120px] grid-cols-1 gap-8 overflow-x-hidden px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:px-10">
            <div className="min-w-0 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  Revenue, evasion, and taxable-base elasticity
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  Gross revenue is not a sufficient measure of success. Higher
                  tariff rates may raise collections mechanically while reducing
                  the observable tax base or increasing evasion.
                </p>
              </div>
              <EquationCard
                title="Revenue under endogenous taxable base"
                math={String.raw`R(\tau,e) = \tau \cdot Q(\tau,e)`}
                interpretation="If the taxable base is highly elastic, higher tariffs shrink observable purchases through avoidance, informal resale, or substitution. The fiscal question is therefore not whether rates increased, but whether the observable and enforceable base remained large enough."
              />
              <div className="min-w-0 rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                  Taxable-base elasticity
                </div>
                <div className="mt-4 overflow-x-auto text-[#173A8A]">
                  <BlockMath math={String.raw`\varepsilon_{Q,\tau} = \frac{\partial \log Q(\tau,e)}{\partial \log \tau}`} />
                </div>
              </div>
              <div className="min-w-0 rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                  Three estimands
                </div>
                <ol className="mt-4 space-y-2 text-base leading-7 text-slate-700">
                  <li>1. Revenue elasticity: how much revenue rises per tax increase</li>
                  <li>2. Evasion elasticity: how much arbitrage or avoidance rises per tax increase</li>
                  <li>3. Domestic substitution elasticity: how much demand returns to domestic firms</li>
                </ol>
              </div>
            </div>
            <ProjectVisualCard title="Conceptual revenue decomposition — not empirical data">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full">
                <path d="M10 84H94" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M10 84V10" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M16 78L82 26" fill="none" stroke="#C8102E" strokeWidth="2.6" />
                <path d="M16 26C38 30 59 46 84 80" fill="none" stroke="#94A3B8" strokeWidth="2.6" />
                <path d="M16 70C34 64 50 51 62 42C70 37 78 38 86 52" fill="none" stroke="#173A8A" strokeWidth="2.6" />
                <text x="60" y="21" fill="#C8102E" fontSize="3.5" fontWeight="600">Statutory rate effect</text>
                <text x="54" y="90" fill="#64748B" fontSize="3.4" fontWeight="600">Taxable-base erosion</text>
                <text x="60" y="48" fill="#173A8A" fontSize="3.5" fontWeight="600">Net revenue response</text>
              </svg>
            </ProjectVisualCard>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="project-section mx-auto grid max-w-[1120px] grid-cols-1 gap-8 overflow-x-hidden px-6 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:px-10">
            <div className="min-w-0 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  Enforcement-cost structural model
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-700">
                  Consumer tariff enforcement requires monitoring many small
                  transactions. This differs sharply from firm-level customs
                  enforcement, where shipments, documents, and registered
                  importers provide stronger administrative handles.
                </p>
              </div>
              <EquationCard
                title="Net fiscal return"
                math={String.raw`NR(\tau,e) = \tau Q(\tau,e) - C(e)`}
                interpretation="Additional enforcement is justified only while marginal revenue recovered exceeds marginal enforcement cost. If monitoring costs rise quickly, consumer tariff enforcement may generate high gross collections but weak net revenue."
              />
              <EquationCard
                title="Policy choice"
                math={String.raw`\max_{\tau,e} \quad \tau Q(\tau,e)-C(e)`}
                interpretation="The policy problem is joint. The state does not choose a tariff in isolation; it chooses a tariff and an enforcement regime together."
              />
              <EquationCard
                title="First-order enforcement condition"
                math={String.raw`\frac{\partial [\tau Q(\tau,e)]}{\partial e} = C'(e)`}
                interpretation="Additional enforcement is justified only while the marginal revenue recovered exceeds the marginal cost of enforcement."
                appendixChildren={
                  <p>
                    A structural model can estimate latent crossing cost <InlineMath math={String.raw`c_i`} /> and simulate counterfactual enforcement regimes. The object of interest is not only whether consumers cross, but at what tax and enforcement level the marginal cost of enforcement exceeds the revenue recovered.
                  </p>
                }
              />
            </div>
            <ProjectVisualCard title="Conceptual enforcement condition — not empirical data">
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="w-full">
                <path d="M10 84H94" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M10 84V10" stroke="#CBD5E1" strokeWidth="1.2" />
                <path d="M14 70C30 60 48 47 86 22" fill="none" stroke="#173A8A" strokeWidth="2.6" />
                <path d="M14 24C34 32 53 48 86 76" fill="none" stroke="#C8102E" strokeWidth="2.6" />
                <circle cx="48" cy="48" r="2" fill="#173A8A" />
                <text x="52" y="46" fill="#173A8A" fontSize="3.3" fontWeight="600">Efficient enforcement range</text>
                <text x="50" y="18" fill="#173A8A" fontSize="3.3" fontWeight="600">Marginal revenue recovered</text>
                <text x="56" y="86" fill="#C8102E" fontSize="3.3" fontWeight="600">Marginal enforcement cost</text>
              </svg>
            </ProjectVisualCard>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Partial identification and measurement problem
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              True arbitrage is unlikely to be observed directly. The
              researcher may observe declarations, seizures, border footfall,
              domestic retail sales, VAT filings, or price changes, but each is
              an imperfect proxy.
            </p>
            <div className="mt-8 max-w-3xl">
              <EquationCard
                title="Latent arbitrage bounds"
                math={String.raw`\underline{A}_{gbt} \leq A^*_{gbt} \leq \overline{A}_{gbt}`}
                interpretation="This project should not pretend that observed customs declarations measure true arbitrage. A partial-identification approach is more credible because the main behavioral response may be movement into less visible channels."
              />
            </div>
            <div className="mt-8 space-y-2 text-base leading-7 text-slate-700">
              <div>- <InlineMath math={String.raw`A^*_{gbt}`} />: true latent arbitrage volume</div>
              <div>- <InlineMath math={String.raw`\underline{A}_{gbt}`} />: lower bound from observed declarations/seizures</div>
              <div>- <InlineMath math={String.raw`\overline{A}_{gbt}`} />: upper bound from footfall, expenditure, and price-gap proxies</div>
            </div>
            <div className="mt-10 overflow-hidden rounded-2xl border border-[#E0E0DC]">
              <div className="grid bg-[#FAFAF8] text-sm leading-6 md:grid-cols-[1fr_1fr_1.2fr]">
                <div className="border-b border-[#E0E0DC] p-4 font-semibold text-[#173A8A] md:border-b-0 md:border-r">Observed proxy</div>
                <div className="border-b border-[#E0E0DC] p-4 font-semibold text-[#173A8A] md:border-b-0 md:border-r">What it captures</div>
                <div className="p-4 font-semibold text-[#173A8A]">Limitation</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">Customs declarations</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">taxable observed purchases</div>
                <div className="border-t border-[#E0E0DC] p-4">misses undeclared purchases</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">Seizures</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">detected evasion</div>
                <div className="border-t border-[#E0E0DC] p-4">depends on enforcement intensity</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">Border footfall</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">crossing opportunity</div>
                <div className="border-t border-[#E0E0DC] p-4">not all crossings are purchases</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">Retail sales</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">domestic substitution</div>
                <div className="border-t border-[#E0E0DC] p-4">affected by local demand shocks</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">VAT filings</div>
                <div className="border-t border-[#E0E0DC] p-4 md:border-r">formal-sector response</div>
                <div className="border-t border-[#E0E0DC] p-4">misses informal retailers</div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Domestic-firm response and general equilibrium
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              The domestic-industry argument is conditional. Consumer tariffs
              may redirect demand to local firms, but only if domestic
              substitutes exist, supply is elastic, and retailers do not simply
              raise markups.
            </p>
            <div className="mt-8 max-w-3xl">
              <EquationCard
                title="Firm-level domestic response"
                math={String.raw`Y_{fdt} = \alpha_f + \lambda_t + \beta \left(Exposure_d \times Policy_t\right) + \gamma X_{dt} + \varepsilon_{fdt}`}
                interpretation={<>The coefficient <InlineMath math={String.raw`\beta`} /> captures whether firms in more exposed districts respond differently after enforcement. This is the empirical test of the domestic-industry channel. Without this, claims about protection remain speculative.</>}
              />
            </div>
            <div className="mt-8 rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                Outcomes
              </div>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
                <li>- sales</li>
                <li>- employment</li>
                <li>- VAT filings</li>
                <li>- inventory turnover</li>
                <li>- firm entry and exit</li>
                <li>- retail margins</li>
              </ul>
            </div>
            <div className="mt-8 rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5 text-base leading-7 text-slate-700">
              Domestic protection is not an assumption. It is a hypothesis
              requiring firm-level or market-level evidence.
            </div>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Dynamic evasion game
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              The policy is dynamic. Consumers learn routes. Informal brokers
              emerge. Border agents adapt. Retailers change pricing and
              inventory strategies. Enforcement today changes beliefs about
              enforcement tomorrow.
            </p>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <EquationCard
                title="Dynamic arbitrage-enforcement system"
                math={String.raw`A_t = f(TaxWedge_t, Enforcement_t, Beliefs_t)`}
                interpretation="The effective tax base may erode over time even if first-month collections look strong. A dynamic model allows the project to study whether the policy creates durable compliance or merely a temporary enforcement shock."
              />
              <EquationCard
                title="Enforcement response"
                math={String.raw`Enforcement_t = g(RevenueLoss_t, PoliticalCost_t, Capacity_t)`}
                interpretation="Enforcement is itself endogenous. The state adjusts enforcement in response to fiscal leakage, political cost, and institutional capacity."
                appendixChildren={
                  <p>
                    The dynamic version can be represented as a repeated game
                    between households, customs agents, and informal
                    intermediaries. The state chooses enforcement intensity,
                    households choose compliance or evasion, and intermediaries
                    enter if enforcement creates rents from avoidance.
                  </p>
                }
              />
            </div>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Empirical design
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              A credible empirical strategy should combine spatial exposure,
              product-level tax wedges, enforcement variation, and partial
              identification.
            </p>
            <div className="mt-8 max-w-3xl">
              <EquationCard
                title="Baseline difference-in-differences"
                math={String.raw`Y_{dt} = \alpha + \beta(BorderExposure_d \times Post_t) + \gamma_d + \delta_t + X_{dt}'\theta + \varepsilon_{dt}`}
                interpretation="This estimates whether border-exposed districts change differentially after enforcement, relative to less exposed districts, conditional on district fixed effects, time fixed effects, and controls."
              />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="min-w-0 rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                  Preferred extensions
                </div>
                <ol className="mt-4 space-y-2 text-base leading-7 text-slate-700">
                  <li>1. Product-level wedge variation</li>
                  <li>2. Distance-to-border gradients</li>
                  <li>3. Enforcement-intensity measures</li>
                  <li>4. Partial-identification bounds</li>
                  <li>5. Firm-level domestic response</li>
                  <li>6. Dynamic adaptation over time</li>
                </ol>
              </div>
              <div className="min-w-0 rounded-2xl border border-[#E0E0DC] bg-[#F5F5F3] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                  Identification concerns
                </div>
                <ul className="mt-4 space-y-2 text-base leading-7 text-slate-700">
                  <li>- border districts may differ structurally from interior districts</li>
                  <li>- enforcement intensity may be endogenous</li>
                  <li>- declarations are not true arbitrage</li>
                  <li>- price gaps may move independently of policy</li>
                  <li>- domestic sales may reflect unrelated demand shocks</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 rounded-2xl border border-[#E0E0DC] bg-[#FAFAF8] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Robustness checks
              </div>
              <ul className="mt-4 grid gap-2 text-base leading-7 text-slate-700 sm:grid-cols-2">
                <li>- pre-trend analysis</li>
                <li>- placebo goods</li>
                <li>- placebo districts</li>
                <li>- alternative distance bands</li>
                <li>- product-category heterogeneity</li>
                <li>- sensitivity to unobserved arbitrage bounds</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Data requirements
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              This project is awaiting updated government data before
              estimation.
            </p>
            <div className="mt-8 rounded-2xl border border-[#E0E0DC] bg-[#FAFAF8] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8102E]">
                Required data
              </div>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
                <li>- customs declarations by checkpoint and product category</li>
                <li>- small-consignment records</li>
                <li>- border movement or checkpoint footfall</li>
                <li>- seizures and enforcement actions</li>
                <li>- domestic and India-side price comparisons</li>
                <li>- district-level retail sales</li>
                <li>- VAT filings or firm registrations</li>
                <li>- household expenditure near border and non-border districts</li>
                <li>- enforcement staffing, budget, or inspection intensity</li>
              </ul>
            </div>
            <p className="mt-6 text-base leading-7 text-slate-500">
              Do not claim these data have been collected unless files exist in
              the repository.
            </p>
          </div>
        </section>

        <section className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="project-content mx-auto max-w-[1120px] overflow-x-hidden px-6 py-16 lg:px-10">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Working hypotheses
            </h2>
            <div className="mt-8 space-y-5">
              {[
                ["H1", "Revenue gains are largest where the initial price wedge is high, enforcement is credible, and arbitrage demand is inelastic."],
                ["H2", "Measured revenue gains decay over time if households adapt through trip consolidation, informal intermediaries, or route substitution."],
                ["H3", "Domestic-firm gains are strongest for goods with close local substitutes and weakest for differentiated imports."],
                ["H4", "Observed customs declarations are a lower-bound proxy for true arbitrage."],
                ["H5", "The policy’s net effect depends more on enforcement cost, taxable-base elasticity, and domestic substitutability than on the statutory threshold itself."],
              ].map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-[#E0E0DC] bg-white/60 px-5 py-4">
                  <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C8102E]">
                    {label}
                  </div>
                  <p className="mt-2 text-base leading-7 text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F5F5F3]">
          <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-20">
            <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
              Executive takeaways
            </h2>
            <div className="mt-8 rounded-2xl border border-[#E0E0DC] bg-[#FAFAF8] p-6 sm:p-8">
              <ol className="space-y-4 text-base leading-7 text-slate-700">
                <li>1. Consumer tariffs tax a behavioral margin, not a fixed base.</li>
                <li>2. The relevant object is the effective wedge: price gap, tariff, travel cost, and enforcement risk.</li>
                <li>3. Revenue depends on taxable-base elasticity and observability.</li>
                <li>4. Enforcement costs are central to the fiscal calculation.</li>
                <li>5. Domestic-industry gains are conditional and must be estimated.</li>
                <li>6. Partial identification is more credible than pretending arbitrage is fully observed.</li>
                <li>7. The strongest contribution is combining spatial econometrics, structural enforcement modeling, partial identification, and a dynamic evasion game.</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function WhitePaperChartGraphic({ chart }) {
  const [isCompactViewport, setIsCompactViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const hasSeries = Boolean(chart.series);
  const usesMobileHorizontalLayout = shouldUseMobileHorizontalLayout(chart, isCompactViewport);
  const useVerticalBars = !hasSeries && (!isCompactViewport || usesMobileHorizontalLayout);
  const chartHeight = hasSeries
    ? isCompactViewport
      ? 360
      : 320
    : useVerticalBars
      ? Math.max(
          isCompactViewport ? 440 : 300,
          chart.data.length * (isCompactViewport ? 88 : 62)
        )
      : Math.max(
          isCompactViewport ? 390 : 320,
          chart.data.length * (isCompactViewport ? 72 : 56)
        );
  const mobileChartCanvasWidth = isCompactViewport
    ? hasSeries
      ? Math.max(440, chart.data.length * 110)
      : useVerticalBars
        ? Math.max(460, chart.data.length * 88)
        : Math.max(420, chart.data.length * 94)
    : null;
  const renderSingleSeriesValueLabel = ({ x = 0, y = 0, width = 0, height = 0, value }) => {
    const formattedValue = formatChartValue(chart, value, chart.yKey);

    if (useVerticalBars) {
      const isNegative = typeof value === "number" && value < 0;

      return (
        <text
          x={isNegative ? x - 8 : x + width + 8}
          y={y + height / 2 + 4}
          fill="#0f172a"
          fontSize={isCompactViewport ? 13 : 12}
          fontWeight={600}
          textAnchor={isNegative ? "end" : "start"}
        >
          {formattedValue}
        </text>
      );
    }

    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#0f172a"
        fontSize={isCompactViewport ? 13 : 12}
        fontWeight={600}
        textAnchor="middle"
      >
        {formattedValue}
      </text>
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => {
      setIsCompactViewport(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      {chart.id === "foreign-employment-approvals" && isCompactViewport ? (
        <div className="mt-6 space-y-5">
          {[
            {
              title: "New vs Renewed (FY 2081/82)",
              data: [
                { label: "New approvals, FY 2081/82", value: 506000 },
                { label: "Renewed approvals, FY 2081/82", value: 333000 },
              ],
            },
            {
              title: "Total Approvals",
              data: [
                { label: "Total, FY 2081/82", value: 839000 },
                { label: "Total, current FY to Chaitra 12", value: 557000 },
              ],
            },
          ].map((group, groupIndex) => (
            <div
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="text-sm font-medium leading-6 text-slate-700">
                {group.title}
              </div>
              <div className="mt-4 overflow-x-auto pb-2">
                <div className="h-56 min-w-[440px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={group.data}
                      layout="vertical"
                      margin={{ top: 8, right: 40, bottom: 8, left: 8 }}
                      barCategoryGap="28%"
                    >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="2 6"
                      vertical={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#475569", fontSize: 13 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatAxisTick(chart, value)}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={118}
                      tick={{ fill: "#475569", fontSize: 12 }}
                      tickFormatter={(value) => getResponsiveLabel(value, true)}
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                      content={<ChartTooltip chart={chart} />}
                    />
                    <Bar
                      dataKey="value"
                      fill={CHART_COLORS[groupIndex]}
                      radius={[0, 10, 10, 0]}
                    >
                      <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(value) => formatChartValue(chart, value, "value")}
                        style={{ fill: "#0f172a", fontSize: 13, fontWeight: 600 }}
                      />
                    </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : chart.id === "saving-investment-gap" && isCompactViewport ? (
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="h-[440px] min-w-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chart.data}
                layout="vertical"
                margin={{ top: 12, right: 44, bottom: 12, left: 18 }}
                barCategoryGap="32%"
              >
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="2 6"
                  vertical={false}
                />
                <XAxis
                  type="number"
                  domain={[-35, 100]}
                  tick={{ fill: "#475569", fontSize: 13 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => formatAxisTick(chart, value)}
                />
                <YAxis
                  type="category"
                  dataKey={chart.xKey}
                  width={150}
                  tick={{ fill: "#475569", fontSize: 12 }}
                  tickFormatter={(value) => getResponsiveLabel(value, true)}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1.5} />
                <Tooltip
                  cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                  content={<ChartTooltip chart={chart} />}
                />
                <Bar dataKey={chart.yKey} fill={CHART_COLORS[0]} radius={[0, 10, 10, 0]}>
                  <LabelList
                    dataKey={chart.yKey}
                    content={({ x = 0, y = 0, width = 0, height = 0, value }) => {
                      const formattedValue = formatChartValue(chart, value, chart.yKey);
                      const isNegative = typeof value === "number" && value < 0;

                      return (
                        <text
                          x={isNegative ? x - 10 : x + width + 10}
                          y={y + height / 2 + 4}
                          fill="#0f172a"
                          fontSize={13}
                          fontWeight={600}
                          textAnchor={isNegative ? "end" : "start"}
                        >
                          {formattedValue}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : chart.id === "west-asia-exposure" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {chart.data.map((datum, index) => (
            <div
              key={datum.label}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="text-sm font-medium leading-6 text-slate-700">
                {getResponsiveLabel(datum.label, isCompactViewport)}
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
                      content={<ChartTooltip chart={chart} />}
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
        <div className="mt-6 overflow-x-auto pb-2">
          <div
            style={{
              height: `${chartHeight}px`,
              width: isCompactViewport && mobileChartCanvasWidth ? `${mobileChartCanvasWidth}px` : "100%",
              minWidth: isCompactViewport && mobileChartCanvasWidth ? `${mobileChartCanvasWidth}px` : "100%",
            }}
          >
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
                  : {
                      top: 16,
                      right: isCompactViewport ? 24 : 24,
                      bottom: 16,
                      left: isCompactViewport ? 8 : 90,
                    }
              }
              barCategoryGap={
                hasSeries
                  ? isCompactViewport
                    ? "28%"
                    : "22%"
                  : useVerticalBars
                    ? isCompactViewport
                      ? "46%"
                      : "28%"
                    : isCompactViewport
                      ? "42%"
                      : "28%"
              }
            >
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray={isCompactViewport ? "2 6" : "3 3"}
                vertical={false}
              />
              {hasSeries || !useVerticalBars ? (
                <>
                  <XAxis
                    dataKey={hasSeries ? chart.xKey : chart.xKey}
                    tick={{ fill: "#475569", fontSize: isCompactViewport ? 13 : 12 }}
                    axisLine={false}
                    tickLine={false}
                    angle={0}
                    textAnchor="middle"
                    height={isCompactViewport ? 64 : 30}
                    interval={0}
                    tickFormatter={(value) => getResponsiveLabel(value, isCompactViewport)}
                  />
                  <YAxis
                    type="number"
                    tick={{ fill: "#475569", fontSize: isCompactViewport ? 13 : 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatAxisTick(chart, value)}
                  />
                  {hasSeries ? <Legend wrapperStyle={{ paddingTop: "10px" }} /> : null}
                </>
              ) : (
                <>
                  <XAxis
                    type="number"
                    tick={{ fill: "#475569", fontSize: isCompactViewport ? 13 : 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatAxisTick(chart, value)}
                  />
                  <YAxis
                    type="category"
                    dataKey={chart.xKey}
                    width={isCompactViewport ? 144 : 140}
                    tick={{ fill: "#475569", fontSize: 12 }}
                    tickFormatter={(value) => getResponsiveLabel(value, isCompactViewport)}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                </>
              )}
              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                content={<ChartTooltip chart={chart} />}
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
                        content={renderSingleSeriesValueLabel}
                      />
                    </Bar>
                  )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </>
  );
}

function ChartCard({ title, description, source, children, note }) {
  return (
    <article className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
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

      <div className="mt-6 text-right text-xs font-medium text-slate-500 opacity-65">
        © Metrics Nepal
      </div>

      <div className="mt-3 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
        {source}
      </div>
    </article>
  );
}

function KeyTakeawayBox({ lines, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-white/16 bg-white/6 p-5 text-left text-blue-50/88 ${className}`.trim()}
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-100/72">
        Key takeaway
      </p>
      {lines.map((line, index) => (
        <p key={index} className="mb-[0.65rem] text-sm leading-[1.65] last:mb-0">
          {line}
        </p>
      ))}
    </section>
  );
}


const WhitePaperActiveSection = memo(function WhitePaperActiveSection({
  activeSection,
  analysisLines,
  isTabContentVisible,
}) {
  return (
    <div className="mt-8 rounded-[2rem] border border-white/16 bg-white/10 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.22)] backdrop-blur-md sm:p-6">
      <div className="max-w-3xl">
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-100">
          Active Section
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {activeSection.title}
        </h2>
      </div>

      <KeyTakeawayBox lines={analysisLines} className="mt-6 md:hidden" />

      <div
        className={`transition-opacity duration-200 ${isTabContentVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div
          className={`mt-8 grid gap-5 ${
            activeSection.charts.length === 1 ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-2"
          }`}
        >
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
      </div>

      <KeyTakeawayBox lines={analysisLines} className="mt-6 hidden md:block" />
    </div>
  );
});

function WhitePaperBriefPage({
  activeTab,
  isMobileMenuOpen,
  onChangeTab,
  onCloseMobileMenu,
  onToggleMobileMenu,
}) {
  const activeSection = whitePaperCharts[activeTab];
  const [isTabContentVisible, setIsTabContentVisible] = useState(true);
  const primaryMetrics = whitePaperHeadlineMetrics.slice(0, 4);
  const secondaryMetrics = whitePaperHeadlineMetrics.slice(4);
  const activeAnalysisLines = analysisNotes[activeTab];

  useEffect(() => {
    setIsTabContentVisible(false);
    const frame = window.requestAnimationFrame(() => {
      setIsTabContentVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#365fb8_0%,rgba(54,95,184,0.95)_16%,rgba(20,43,95,0.96)_36%,rgba(106,41,61,0.92)_70%,rgba(176,70,70,0.9)_100%)] text-slate-900">
      <SiteHeader
        navItems={NAV_ITEMS}
        isMobileMenuOpen={isMobileMenuOpen}
        menuId="white-paper-mobile-menu"
        logoClassName="h-14 w-auto sm:h-24"
        onCloseMobileMenu={onCloseMobileMenu}
        onToggleMobileMenu={onToggleMobileMenu}
      />

      <main>
        <section className="border-b border-white/12 bg-[linear-gradient(135deg,rgba(17,37,88,0.3)_0%,rgba(24,53,109,0.08)_42%,rgba(176,70,70,0.14)_100%)]">
          <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12 lg:px-10 lg:py-20">
            <div className="max-w-[34rem] sm:max-w-3xl">
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-red-200">
                Insights Brief
              </div>
              <h1 className="mt-5 max-w-[14ch] text-4xl font-semibold tracking-tight text-white sm:max-w-none sm:text-5xl">
                {WHITE_PAPER_TITLE}
              </h1>
              <p className="mt-6 max-w-[32rem] text-base leading-7 text-blue-50/88 sm:text-lg sm:leading-8">
                {WHITE_PAPER_SUBTITLE}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <div className="rounded-3xl border border-white/18 bg-white/10 px-6 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.18)] backdrop-blur-md">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                  Brief Source
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-50/82">
                  {whitePaperSource}
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                  Global Disclaimer
                </div>
                <p className="mt-3 text-sm leading-6 text-blue-50/82">
                  {WHITE_PAPER_DISCLAIMER}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {primaryMetrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-3xl border border-white/16 bg-white/12 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.18)] backdrop-blur-md"
              >
                <div className="text-sm font-medium text-blue-50/72">{metric.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {metric.value}
                </div>
                <div className="mt-2 text-sm text-blue-100/78">{metric.subtext}</div>
              </article>
            ))}
            {secondaryMetrics.map((metric) => (
              <article
                key={metric.label}
                className="hidden rounded-3xl border border-white/16 bg-white/12 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.18)] backdrop-blur-md xl:block"
              >
                <div className="text-sm font-medium text-blue-50/72">{metric.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {metric.value}
                </div>
                <div className="mt-2 text-sm text-blue-100/78">{metric.subtext}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/12 bg-[linear-gradient(180deg,rgba(20,43,95,0.08)_0%,rgba(176,70,70,0.08)_100%)]">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-red-200">
              Tabbed Sections
            </div>
            <div className="relative mt-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#284a93] to-transparent md:hidden" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#793345] to-transparent md:hidden" />
              <div className="-mx-6 overflow-x-auto px-6 pb-2 [scrollbar-width:none]">
                <div className="flex min-w-max gap-3 whitespace-nowrap">
                  {WHITE_PAPER_TAB_ORDER.map((key) => {
                    const section = whitePaperCharts[key];
                    const isActive = key === activeTab;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                          isActive
                            ? "border-white bg-white text-blue-950 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
                            : "border-white/20 bg-white/10 text-blue-50/72 hover:border-red-200 hover:text-white"
                        }`}
                        onClick={() => onChangeTab(key)}
                      >
                        {section.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <WhitePaperActiveSection
              activeSection={activeSection}
              analysisLines={activeAnalysisLines}
              isTabContentVisible={isTabContentVisible}
            />

            <details className="mt-6 rounded-2xl border border-white/16 bg-white/6 p-5 text-blue-50/88 xl:hidden">
              <summary className="min-h-11 cursor-pointer list-none text-sm font-semibold uppercase tracking-[0.16em] text-blue-100/78">
                More indicators
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {secondaryMetrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="rounded-3xl border border-white/16 bg-white/8 p-5 shadow-[0_16px_30px_rgba(15,23,42,0.16)] backdrop-blur-md"
                  >
                    <div className="text-sm font-medium text-blue-50/72">{metric.label}</div>
                    <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
                      {metric.value}
                    </div>
                    <div className="mt-2 text-sm text-blue-100/78">{metric.subtext}</div>
                  </article>
                ))}
              </div>
            </details>
          </div>
        </section>

        <footer className="border-t border-white/12 bg-transparent">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            <div className="rounded-3xl border border-white/16 bg-white/10 px-6 py-5 text-sm leading-6 text-blue-50/84 backdrop-blur-md">
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
    <div className="min-h-screen bg-[#F5F5F3] text-slate-900 [font-family:Inter,ui-sans-serif,system-ui,sans-serif]">
      <SiteHeader
        navItems={NAV_ITEMS}
        isMobileMenuOpen={isMobileMenuOpen}
        menuId="mobile-menu"
        logoClassName="h-16 w-auto sm:h-28 lg:h-32"
        onCloseMobileMenu={onCloseMobileMenu}
        onToggleMobileMenu={onToggleMobileMenu}
      />

      <main>
        <section className="border-b border-[#E0E0DC] bg-[#F5F5F3]">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:py-12 lg:px-10 lg:py-[72px]">
            <div className="max-w-5xl">
              <h1 className="max-w-[14ch] text-3xl font-semibold leading-[1.08] tracking-tight text-[#173A8A] sm:max-w-[16ch] sm:text-4xl lg:max-w-[24ch] lg:text-6xl [font-family:Georgia,'Times_New_Roman',serif]">
                <span>Economic analysis</span>{" "}
                <span className="text-[#C8102E]">for policy and market decisions</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
                Structured analysis for investment, policy, and strategic decisions.
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-20 lg:px-10 lg:py-24">
            <div className="max-w-[44rem]">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#173A8A]">
                About us
              </div>
              <div className="mt-10 text-base leading-8 text-slate-700 sm:text-lg">
                Metrics Nepal is an econometric research firm working at the intersection of policy, markets, and data in Nepal. We structure complex economic questions into measurable problems, producing analysis that informs investment, policy, and strategic decision-making. Our work focuses on identifying drivers, quantifying trade-offs, and bringing clarity to environments where data is limited but decisions cannot wait.
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="border-b border-[#E0E0DC] bg-[#F5F5F3]">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-18 lg:px-10 lg:py-22">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
              Insights
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <a
                href={WHITE_PAPER_HASH_PATH}
                className="group overflow-hidden rounded-2xl border border-[#E0E0DC] bg-[#FAFAF8] transition-colors hover:border-red-200 hover:bg-[#FAFAF8]"
              >
                <div className="border-b border-blue-900/10 bg-[linear-gradient(135deg,#142b5f_0%,#203f86_55%,#b04646_100%)] p-5 text-white sm:p-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
                    Data Brief
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-7 text-white [font-family:Georgia,'Times_New_Roman',serif]">
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
                <div className="space-y-3 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    <span>April 2026</span>
                    <span>Economic White Paper</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    {WHITE_PAPER_TITLE}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600 sm:text-base">
                    A complementary data brief of the Government of Nepal&apos;s recent white paper.
                  </p>
                </div>
              </a>

              <a
                href={PRIVATE_SCHOOLS_HASH_PATH}
                className="group overflow-hidden rounded-2xl border border-[#E0E0DC] bg-[#FAFAF8] transition-colors hover:border-red-200 hover:bg-[#FAFAF8]"
              >
                <div className="aspect-[16/10] overflow-hidden border-b border-[#E0E0DC] bg-[#F5F5F3]">
                  <img
                    src="/insights-private-schools-1.png"
                    alt="Are private schools really better?"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-3 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    <span>Insight Note</span>
                    <span>Education</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    {PRIVATE_SCHOOLS_ARTICLE.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600 sm:text-base">
                    Read the full analysis.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </section>

        <section id="papers" className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-18 lg:px-10 lg:py-22">
            <div className="max-w-4xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#173A8A]">
                Projects
              </div>
              <div className="mt-8 divide-y divide-[#E0E0DC] border-t border-[#E0E0DC]">
                <a
                  href={CONSUMER_TARIFFS_PROJECT_HASH_PATH}
                  className="group block py-6 transition-colors hover:bg-[#F5F5F3]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                    <div className="max-w-2xl">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C8102E]">
                        {CONSUMER_TARIFFS_PROJECT.tag}
                      </div>
                      <h3 className="mt-2 text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                        Will consumer tariffs work? (Working Project)
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                        A working project on consumer-level tariff enforcement, spatial arbitrage, evasion, and domestic market response.
                      </p>
                      <div className="mt-4 text-sm font-medium text-[#173A8A]">
                        View project →
                      </div>
                    </div>
                    <div className="shrink-0 text-sm text-slate-500">
                      Institutional working project · April 2026
                    </div>
                  </div>
                </a>
                <div className="py-6 text-sm leading-6 text-slate-500">
                  Additional project briefs are in development.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="careers" className="border-b border-[#E0E0DC] bg-[#F5F5F3]">
          <div className="mx-auto max-w-7xl scroll-mt-28 px-6 py-18 lg:px-10 lg:py-22">
            <div className="max-w-4xl">
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#173A8A]">
                Careers
              </div>
              <div className="mt-8 text-base leading-8 text-slate-700 sm:text-lg">
                No openings at this moment. We&apos;ll let you know if any opportunities open up!
              </div>
            </div>
          </div>
        </section>

        <footer className="border-b border-[#E0E0DC] bg-[#FAFAF8]">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
            <div className="space-y-2 text-sm leading-6 text-slate-600">
              <div>© 2026 Metrics Nepal</div>
              <div>Kathmandu, Nepal</div>
              <a href="mailto:contact@metricsnepal.com" className="inline-block text-blue-900 hover:text-red-600">
                contact@metricsnepal.com
              </a>
            </div>
          </div>
        </footer>
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
  const isConsumerTariffsProjectPage = matchesPath(CONSUMER_TARIFFS_PROJECT_PATH);

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

  if (isConsumerTariffsProjectPage) {
    return (
      <ConsumerTariffsProjectPage
        isMobileMenuOpen={isMobileMenuOpen}
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
