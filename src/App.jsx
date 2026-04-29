import { cloneElement, isValidElement, memo, useEffect, useState } from "react";
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
import katex from "katex";
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

function cleanArtifacts(text) {
  return text
    .replace(/:contentReference\[.*?\]\{.*?\}/g, "")
    .replace(/\[oaicite:\d+\]/g, "")
    .replace(/\{index=\d+\}/g, "")
    .trim();
}

function sanitizeProjectNode(node) {
  if (typeof node === "string") {
    return cleanArtifacts(node);
  }

  if (Array.isArray(node)) {
    return node.map(sanitizeProjectNode);
  }

  if (!isValidElement(node)) {
    return node;
  }

  if (!Object.prototype.hasOwnProperty.call(node.props, "children")) {
    return node;
  }

  return cloneElement(
    node,
    { ...node.props },
    sanitizeProjectNode(node.props.children),
  );
}
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

function MathBlock({ children, math, label }) {
  const source = typeof math === "string" ? math : typeof children === "string" ? children : "";
  const html = katex.renderToString(source, {
    throwOnError: false,
    displayMode: true,
    strict: false,
  });

  return (
    <div className="math-card w-full max-w-[720px] min-w-0 overflow-hidden rounded-[10px] border border-[#E2E2DE] border-l-4 border-l-[#123C7C] bg-[#F8F8F6] px-[22px] py-[18px] box-border">
      {label ? (
        <div className="math-label mb-[14px] text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#B20D18]">
          {label}
        </div>
      ) : null}
      <div
        className="math-scroll max-w-full overflow-x-auto text-[#173A8A] [&_.katex-display]:m-0 [&_.katex]:font-['Times_New_Roman',Georgia,serif]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function InlineMath({ children, math }) {
  const source = typeof math === "string" ? math : typeof children === "string" ? children : "";
  const html = katex.renderToString(source, {
    throwOnError: false,
    displayMode: false,
    strict: false,
  });

  return (
    <span
      className="inline-math whitespace-nowrap [&_.katex]:font-['Times_New_Roman',Georgia,serif]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
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
    <div className="equation-card w-full max-w-full min-w-0 overflow-x-auto box-border">
      <MathBlock math={math} label={title} />
      <div className="mt-4 text-base leading-7 text-slate-700">{interpretation}</div>
      {appendixChildren ? (
        <details className="mt-5 rounded-lg border border-[#E3E6EB] bg-white/75 p-4">
          <summary className="cursor-pointer text-sm font-medium text-[#173A8A]">
            {appendixTitle || "Technical appendix"}
          </summary>
          <div className="mt-4 min-w-0 space-y-4 text-sm leading-6 text-slate-700">
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
  const page = (
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
          <div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-10 lg:py-20">
            <div className="max-w-[760px]">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C8102E]">
                Working Project
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] text-[#173A8A] sm:text-5xl [font-family:Georgia,'Times_New_Roman',serif]">
                Will Consumer Tariffs Work? A Border Arbitrage Framework
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-[#F5F5F3]">
          <div className="mx-auto max-w-[1120px] overflow-x-hidden px-6 py-14 lg:px-10 lg:py-16">
            <div className="max-w-[760px] space-y-14">
              <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] px-5 py-4 text-slate-700">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B20D18]">
                  Working Project Note
                </div>
                <div className="mt-3 space-y-3 text-base leading-7">
                  <p>
                    This project develops a formal econometric framework for analyzing Nepal’s recent enforcement of customs duties on consumer imports exceeding Rs. 100. It is a working research note.
                  </p>
                  <p>
                    At present, full administrative data on enforcement intensity, border flows, and revenue collection are not publicly available. The analysis therefore focuses on identification strategy, behavioral margins, and testable implications, rather than definitive empirical estimates.
                  </p>
                  <p>
                    The framework is designed to be taken to data as administrative and survey evidence becomes available.
                  </p>
                </div>
              </div>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  1. Introduction
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    In April 2026, Nepal began aggressively enforcing customs duties on goods valued above Rs. 100 brought from Indian border markets. The policy is intended to curb informal cross-border trade, reduce revenue leakage, and protect domestic markets.
                  </p>
                  <p>
                    This policy differs from standard tariff settings. The taxable base consists of mobile households rather than formal importers, and enforcement operates at the level of individual crossings rather than firms. As a result, taxation directly alters the behavior it seeks to measure.
                  </p>
                  <p>This project studies the following question:</p>
                  <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] px-5 py-4 text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    Under what conditions does strict enforcement of Nepal’s Rs. 100 consumer-import threshold expand the tax base rather than redirect activity into spatial arbitrage, evasion, and informal trade?
                  </div>
                  <p>
                    The analysis develops a formal framework in which arbitrage is endogenous, partially unobserved, and shaped by enforcement, geography, and learning. The goal is not to estimate a single reduced-form effect, but to characterize the conditions under which the policy generates net fiscal gains.
                  </p>
                </div>
                <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] px-5 py-4 text-slate-700">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[#B20D18]">
                    Policy Context: Nepal’s Rs. 100 Border Rule
                  </div>
                  <div className="mt-3 space-y-3 text-base leading-7">
                    <p>
                      Nepal has recently tightened customs enforcement at border crossings, requiring duties on goods worth more than Rs. 100 brought from Indian markets. This reflects concerns over revenue leakage due to frequent cross-border shopping by residents in border regions.
                    </p>
                    <p>
                      The policy has altered everyday economic activity: increased inspections, reduced cross-border shopping, and tension in border districts where such trade is a long-standing part of household consumption.
                    </p>
                    <p>
                      This setting provides a natural case for studying consumer-level taxation when the tax base is mobile and partially informal.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  2. Conceptual Framework
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    Consider a consumer choosing between purchasing a good
                    domestically or across the border.
                  </p>
                  <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5 text-base leading-7 text-slate-700">
                    <div>Let:</div>
                    <ul className="mt-3 space-y-2">
                      <li>- <InlineMath math={String.raw`p_N`} />: domestic price</li>
                      <li>- <InlineMath math={String.raw`t_N`} />: consumer tariff</li>
                      <li>- <InlineMath math={String.raw`p_I`} />: foreign border price</li>
                      <li>- <InlineMath math={String.raw`c_i`} />: individual-specific cost of arbitrage</li>
                    </ul>
                  </div>
                  <p>A consumer engages in cross-border arbitrage if:</p>
                </div>
                <EquationCard
                  title="Arbitrage condition"
                  math={String.raw`p_N + t_N > p_I + c_i`}
                  interpretation="This condition defines the basic price comparison underlying cross-border arbitrage."
                />
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Define the effective price wedge:</p>
                </div>
                <EquationCard
                  title="Effective price wedge"
                  math={String.raw`\Delta p = (p_N + t_N) - p_I`}
                  interpretation="The wedge is the difference between the taxed domestic price and the foreign border price."
                />
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Then arbitrage occurs whenever:</p>
                </div>
                <EquationCard
                  title="Threshold rule"
                  math={String.raw`c_i < \Delta p`}
                  interpretation="Consumers arbitrage when their individual cost is below the effective price wedge."
                />
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    Let <InlineMath math={String.raw`F(c)`} /> denote the
                    distribution of arbitrage costs. The share of consumers
                    engaging in arbitrage is:
                  </p>
                </div>
                <EquationCard
                  title="Latent arbitrage function"
                  math={String.raw`A^* = F(\Delta p)`}
                  interpretation="This is a latent arbitrage function: it determines the true behavioral response to tariff changes."
                />

                <div className="space-y-6 border-t border-[#E0E0DC] pt-8">
                  <h3 className="text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    2.1 Threshold Enforcement and Behavioral Distortion
                  </h3>
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>
                      The Rs. 100 rule introduces a discrete enforcement threshold. Goods below the threshold are effectively untaxed at the consumer level, while goods above the threshold are subject to inspection and duty.
                    </p>
                    <p>
                      Let <InlineMath math={String.raw`v_i`} /> denote the declared value of goods carried by individual <InlineMath math={String.raw`i`} />. The policy creates incentives for behavioral manipulation:
                    </p>
                    <ul className="list-disc space-y-2 pl-5 text-base leading-7 marker:text-slate-500">
                      <li>under-reporting (<InlineMath math={String.raw`v_i < 100`} />)</li>
                      <li>splitting purchases across trips</li>
                      <li>substitution toward less detectable goods</li>
                    </ul>
                  </div>
                  <EquationCard
                    title="Threshold enforcement condition"
                    math={String.raw`p_N + t_N \cdot 1(v_i \geq 100) > p_I + c_i`}
                    interpretation="This creates a discontinuity in behavior around the threshold."
                  />
                  <div className="space-y-4 text-base leading-7 text-slate-700">
                    <div>Empirical implications:</div>
                    <ul className="list-disc space-y-2 pl-5 marker:text-slate-500">
                      <li>bunching just below Rs. 100</li>
                      <li>distortions in declared value distributions</li>
                      <li>nonlinear responses to small price changes</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  3. Revenue and Behavioral Response
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    Tariff revenue depends on both the statutory rate and the
                    endogenous arbitrage response.
                  </p>
                  <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5 text-base leading-7 text-slate-700">
                    <div>Let:</div>
                    <ul className="mt-3 space-y-2">
                      <li>- <InlineMath math={String.raw`Q(\cdot)`} />: domestic taxed quantity</li>
                      <li>- <InlineMath math={String.raw`A^*`} />: arbitrage share</li>
                    </ul>
                  </div>
                  <p>Then:</p>
                </div>
                <EquationCard
                  title="Revenue function"
                  math={String.raw`R(t_N) = t_N \cdot Q(t_N, A^*)`}
                  interpretation="Revenue depends on both the statutory rate and the endogenous taxed quantity."
                />
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Taking derivatives:</p>
                </div>
                <EquationCard
                  title="Revenue derivative"
                  math={String.raw`\frac{dR}{dt_N} = Q + t_N \left[\frac{\partial Q}{\partial t_N} + \left(\frac{\partial Q}{\partial A^*}\right) \cdot \left(\frac{dA^*}{dt_N}\right)\right]`}
                  interpretation="This highlights the key trade-off: increasing tariffs raises revenue mechanically, but also increases arbitrage, reducing the taxable base. The sign of dR/dt_N is therefore empirical, not mechanical."
                />
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  4. Econometric Problem
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    The central challenge is that arbitrage is not directly
                    observed.
                  </p>
                  <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5 text-base leading-7 text-slate-700">
                    <div>Let:</div>
                    <ul className="mt-3 space-y-2">
                      <li>- <InlineMath math={String.raw`A^*`} />: true arbitrage, unobserved</li>
                      <li>- <InlineMath math={String.raw`\tilde{A}`} />: observed proxy, such as retail decline, seizures, or border traffic</li>
                    </ul>
                  </div>
                  <p>Then:</p>
                </div>
                <EquationCard
                  title="Observed proxy equation"
                  math={String.raw`\tilde{A} = \rho \cdot A^* + \nu`}
                  interpretation={
                    <>
                      Where <InlineMath math={String.raw`\rho`} /> is
                      detection/enforcement intensity and <InlineMath math={String.raw`\nu`} /> is
                      measurement error.
                    </>
                  }
                />
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>This creates two problems.</p>
                  <p>
                    First, measurement error is non-classical because detection
                    depends on enforcement, which itself responds to policy.
                  </p>
                  <p>
                    Second, policy is endogenous because tariffs respond to
                    trade patterns and domestic industry conditions.
                  </p>
                  <p>Formally:</p>
                </div>
                <EquationCard
                  title="Endogeneity condition"
                  math={String.raw`t_N \not\perp\!\!\!\perp \varepsilon`}
                  interpretation="Naïve regressions will therefore conflate behavioral responses with policy reactions."
                />
              </section>

              <section className="space-y-8">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  5. Identification Strategy
                </h2>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    5.1 Spatial discontinuity
                  </h3>
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>Exploit variation in distance to the border:</p>
                  </div>
                  <EquationCard
                    title="Spatial border-exposure specification"
                    math={String.raw`Y_{id} = \alpha + \tau BorderExposure_d + f(distance_d) + X_i'\beta + \varepsilon_{id}`}
                    interpretation={
                      <>
                        Where <InlineMath math={String.raw`Y_{id}`} /> is retail outcomes,
                        consumption, or price indices, and <InlineMath math={String.raw`BorderExposure_d`} /> is
                        proximity to cross-border arbitrage.
                      </>
                    }
                  />
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>This identifies local arbitrage effects.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    5.2 Tax wedge elasticity
                  </h3>
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>Estimate behavioral response to price differentials:</p>
                  </div>
                  <EquationCard
                    title="Tax wedge elasticity equation"
                    math={String.raw`Arbitrage_{igdt} = \beta_1 \Delta p_{gdt} + \beta_2 Distance_i + \beta_3(\Delta p_{gdt} \times Distance_i) + \varepsilon_{igdt}`}
                    interpretation="This recovers how arbitrage varies with both price incentives and spatial frictions."
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    5.3 Instrumental variables
                  </h3>
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>To address tariff endogeneity, use exogenous shocks to foreign prices:</p>
                  </div>
                  <EquationCard
                    title="First stage"
                    math={String.raw`\Delta p_{gdt} = \pi_1 Z_{gt} + \pi_2 Distance_i + u_{gdt}`}
                    interpretation="This isolates exogenous variation in the price wedge."
                  />
                  <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5 text-base leading-7 text-slate-700">
                    <div>Where instruments <InlineMath math={String.raw`Z_{gt}`} /> may include:</div>
                    <ul className="mt-3 space-y-2">
                      <li>- Indian-side price shocks</li>
                      <li>- exchange rate fluctuations</li>
                      <li>- global commodity price variation</li>
                    </ul>
                  </div>
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>Second stage:</p>
                  </div>
                  <EquationCard
                    title="Second stage"
                    math={String.raw`Arbitrage_{gdt} = \beta \widehat{\Delta p}_{gdt} + \varepsilon_{gdt}`}
                    interpretation="This estimates arbitrage response using exogenous wedge variation."
                  />
                </div>

                <div className="space-y-6 border-t border-[#E0E0DC] pt-8">
                  <h3 className="text-xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                    5.4 Threshold-based identification
                  </h3>
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>The Rs. 100 cutoff creates a bunching design.</p>
                    <p>Let <InlineMath math={String.raw`v`} /> denote declared value. Then examine the density:</p>
                  </div>
                  <EquationCard
                    title="Density"
                    math={String.raw`f(v)`}
                    interpretation="This is the density of declared value around the threshold."
                  />
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>Test for excess mass just below 100:</p>
                  </div>
                  <EquationCard
                    title="Threshold bunching condition"
                    math={String.raw`\lim_{v \to 100^-} f(v) > \lim_{v \to 100^+} f(v)`}
                    interpretation="This identifies behavioral distortion induced by enforcement."
                  />
                  <div className="space-y-6 text-lg leading-8 text-slate-700">
                    <p>
                      This complements spatial and price-based identification by isolating manipulation at the reporting margin.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  6. Heterogeneity
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Arbitrage responses are not uniform. The model implies:</p>
                </div>
                <EquationCard
                  title="Heterogeneity function"
                  math={String.raw`A^* = F(\Delta p; d, g, income, enforcement)`}
                  interpretation="The arbitrage function depends on price wedges, spatial frictions, product characteristics, income, and enforcement."
                />
                <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5 text-base leading-7 text-slate-700">
                  <div>Key margins:</div>
                  <ul className="mt-3 space-y-2">
                    <li>- Distance: arbitrage declines with travel cost.</li>
                    <li>- Product type: high-value, portable goods exhibit stronger responses.</li>
                    <li>- Income: lower-income households are more responsive to price wedges.</li>
                    <li>- Enforcement: detection probability shifts observed arbitrage.</li>
                  </ul>
                </div>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Failure to account for these leads to biased aggregate estimates.</p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  7. Dynamic Adjustment
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Arbitrage behavior evolves over time.</p>
                </div>
                <EquationCard
                  title="Dynamic adjustment equation"
                  math={String.raw`A_t = f(\Delta p_t, Enforcement_t, Learning_t)`}
                  interpretation="Consumers learn routes, informal networks develop, and enforcement adapts. Short-run responses may therefore differ significantly from long-run equilibrium behavior."
                />
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  8. General Equilibrium Effects
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Tariffs affect not only consumers but domestic markets.</p>
                </div>
                <div className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5 text-base leading-7 text-slate-700">
                  <div>Potential channels include:</div>
                  <ul className="mt-3 space-y-2">
                    <li>- domestic price increases</li>
                    <li>- entry and exit of firms</li>
                    <li>- expansion of informal markets</li>
                    <li>- supply-chain reallocation</li>
                  </ul>
                </div>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    Thus observed retail outcomes reflect both direct arbitrage
                    and market adjustment.
                  </p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  9. Policy Interpretation
                </h2>
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>Consumer tariffs expand the tax base only if:</p>
                </div>
                <EquationCard
                  title="Policy condition"
                  math={String.raw`\text{Revenue gain} > \text{Loss from arbitrage} + \text{Enforcement cost}`}
                  interpretation="This condition depends on the distribution of arbitrage costs, the elasticity of arbitrage with respect to price wedges, and the cost and effectiveness of enforcement."
                />
                <div className="space-y-6 text-lg leading-8 text-slate-700">
                  <p>
                    In settings with low crossing costs and weak enforcement,
                    tariffs may primarily reallocate activity into informal
                    arbitrage rather than increase revenue.
                  </p>
                </div>
              </section>
            </div>

            <div className="mt-16 border-t border-[#E0E0DC] pt-14">
              <div className="max-w-[760px] space-y-8">
                <h2 className="text-3xl font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                  Technical Appendix
                </h2>
                <p className="text-base leading-7 text-slate-600">
                  Implement the following appendix as collapsible dropdowns.
                </p>
                <div className="space-y-4">
                  <details className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5">
                    <summary className="cursor-pointer text-lg font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                      Appendix A. Arbitrage Threshold Condition
                    </summary>
                    <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
                      <p>Consumers engage in arbitrage when:</p>
                      <EquationCard
                        title="Appendix A equation"
                        math={String.raw`c_i < \Delta p`}
                        interpretation="This defines the marginal arbitrage consumer."
                      />
                    </div>
                  </details>

                  <details className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5">
                    <summary className="cursor-pointer text-lg font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                      Appendix B. Latent Arbitrage Function
                    </summary>
                    <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
                      <p>Given cost distribution <InlineMath math={String.raw`F(c)`} />:</p>
                      <EquationCard
                        title="Appendix B equation"
                        math={String.raw`A^* = \int_{0}^{\Delta p} dF(c)`}
                        interpretation="This expresses latent arbitrage as the mass of consumers whose costs lie below the price wedge."
                      />
                    </div>
                  </details>

                  <details className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5">
                    <summary className="cursor-pointer text-lg font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                      Appendix C. Mapping to Observed Data
                    </summary>
                    <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
                      <p>Observed proxy:</p>
                      <EquationCard
                        title="Appendix C equation"
                        math={String.raw`\tilde{A} = \rho A^* + \nu`}
                        interpretation={<>Where <InlineMath math={String.raw`\rho`} /> depends on enforcement intensity.</>}
                      />
                    </div>
                  </details>

                  <details className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5">
                    <summary className="cursor-pointer text-lg font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                      Appendix D. Revenue Sensitivity
                    </summary>
                    <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
                      <p>Revenue derivative:</p>
                      <EquationCard
                        title="Appendix D equation"
                        math={String.raw`\frac{dR}{dt_N} = Q + t_N \left[\frac{\partial Q}{\partial t_N} + \left(\frac{\partial Q}{\partial A^*}\right) \cdot \left(\frac{dA^*}{dt_N}\right)\right]`}
                        interpretation="This is the same derivative used in the main text, preserved here for formal reference."
                      />
                    </div>
                  </details>

                  <details className="rounded-xl border border-[#E3E6EB] bg-[#FAFAF8] p-5">
                    <summary className="cursor-pointer text-lg font-semibold text-[#173A8A] [font-family:Georgia,'Times_New_Roman',serif]">
                      Appendix E. Identification Assumptions
                    </summary>
                    <div className="mt-4 space-y-2 text-base leading-7 text-slate-700">
                      <p>1. Instruments affect arbitrage only through price differentials.</p>
                      <p>2. Distance affects arbitrage cost but not preferences.</p>
                      <p>3. Measurement error is monotonic in enforcement.</p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  return sanitizeProjectNode(page);
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
