export const whitePaperSource =
  "Source: Government of Nepal, Ministry of Finance, Baisakh 2083 / April 2026 Economic White Paper";

export const whitePaperHeadlineMetrics = [
  {
    label: "Projected GDP Growth",
    value: "3.5%",
    subtext: "FY 2082/83 projection",
  },
  {
    label: "10-Year Avg Growth",
    value: "4.2%",
    subtext: "Average annual GDP growth",
  },
  {
    label: "Public Debt",
    value: "43.8%",
    subtext: "of GDP, FY 2081/82",
  },
  {
    label: "Inflation",
    value: "2.13%",
    subtext: "First 8 months, FY 2082/83",
  },
  {
    label: "Foreign Employment Approvals",
    value: "839k",
    subtext: "FY 2081/82",
  },
  {
    label: "Tourist Arrivals",
    value: "1.158m",
    subtext: "2025",
  },
  {
    label: "Installed Electricity Capacity",
    value: "4,105 MW",
    subtext: "By Falgun 2082",
  },
  {
    label: "Tax Base Concentration",
    value: "51%",
    subtext: "Internal revenue from 100 large taxpayers",
  },
];

export const whitePaperCharts = {
  growthStructure: {
    title: "Growth and Economic Structure",
    placeholderText:
      "Commentary placeholder: add interpretation on growth volatility, slow structural transformation, and the shift toward services.",
    charts: [
      {
        id: "gdp-growth",
        type: "bar",
        title: "GDP Growth: Recent and Projected",
        description: "GDP growth rates reported in the white paper.",
        data: [
          { label: "10-year average", value: 4.2 },
          { label: "FY 2081/82", value: 4.61 },
          { label: "FY 2082/83 projection", value: 3.5 },
        ],
        xKey: "label",
        yKey: "value",
        unit: "%",
      },
      {
        id: "sector-shares",
        type: "bar",
        title: "Shift in Nepal’s Economic Structure",
        description:
          "Sectoral contribution to GDP, earlier period versus recent period.",
        data: [
          { sector: "Agriculture", earlier: 28.4, recent: 25.2 },
          { sector: "Industry", earlier: 14.1, recent: 12.8 },
          { sector: "Services", earlier: 57.5, recent: 62.0 },
        ],
        xKey: "sector",
        series: [
          { key: "earlier", label: "Earlier" },
          { key: "recent", label: "Recent" },
        ],
        unit: "%",
      },
      {
        id: "agri-productivity-gap",
        type: "bar",
        title: "Agriculture: Employment Share vs GDP Share",
        description:
          "Agriculture employs a large share of workers but contributes a smaller share of GDP.",
        data: [
          { label: "Employment share", value: 62.0 },
          { label: "GDP share", value: 25.2 },
        ],
        xKey: "label",
        yKey: "value",
        unit: "%",
      },
    ],
  },

  laborMigration: {
    title: "Labor, Migration, and External Exposure",
    placeholderText:
      "Commentary placeholder: add interpretation on labor migration, remittance dependence, and West Asia exposure.",
    charts: [
      {
        id: "foreign-employment-approvals",
        type: "bar",
        title: "Foreign Employment Approvals",
        description: "New and renewed labor approvals.",
        data: [
          { category: "New approvals, FY 2081/82", value: 506000 },
          { category: "Renewed approvals, FY 2081/82", value: 333000 },
          { category: "Total, FY 2081/82", value: 839000 },
          { category: "New approvals, current FY to Chaitra 12", value: 283000 },
          { category: "Renewed approvals, current FY to Chaitra 12", value: 274000 },
          { category: "Total, current FY to Chaitra 12", value: 557000 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "workers",
      },
      {
        id: "west-asia-exposure",
        type: "bar",
        title: "West Asia Exposure",
        description: "Workers and remittance exposure linked to West Asia.",
        data: [
          { label: "Nepali workers in West Asia", value: 1750000 },
          { label: "Remittance share from West Asia", value: 37.4 },
        ],
        xKey: "label",
        yKey: "value",
        note: "Use dual label formatting: workers as count, remittance share as percent.",
      },
    ],
  },

  fiscalFinance: {
    title: "Public Finance and Debt",
    placeholderText:
      "Commentary placeholder: add interpretation on fiscal pressure, debt service, revenue concentration, and capital spending weakness.",
    charts: [
      {
        id: "revenue-composition",
        type: "bar",
        title: "Revenue Composition",
        description: "Major revenue sources as shares of total revenue.",
        data: [
          { category: "VAT", value: 29.0 },
          { category: "Income tax", value: 25.2 },
          { category: "Customs", value: 19.6 },
          { category: "Excise", value: 14.8 },
          { category: "Non-tax revenue", value: 11.0 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "%",
      },
      {
        id: "public-debt-rise",
        type: "bar",
        title: "Public Debt Has Nearly Doubled Relative to GDP",
        description: "Public debt as a share of GDP.",
        data: [
          { year: "FY 2072/73", value: 22.5 },
          { year: "FY 2081/82", value: 43.8 },
        ],
        xKey: "year",
        yKey: "value",
        unit: "%",
      },
      {
        id: "expenditure-composition",
        type: "bar",
        title: "Government Expenditure Composition",
        description: "Composition of federal expenditure in FY 2081/82.",
        data: [
          { category: "Current expenditure", value: 63.2 },
          { category: "Capital expenditure", value: 14.8 },
          { category: "Financing", value: 22.0 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "%",
      },
      {
        id: "debt-service-pressure",
        type: "bar",
        title: "Debt Service Pressure",
        description: "Debt service relative to expenditure and revenue.",
        data: [
          { category: "Share of federal expenditure", value: 24.0 },
          { category: "Share of federal revenue", value: 35.0 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "%",
      },
    ],
  },

  savingsInvestment: {
    title: "Savings, Investment, and Demand",
    placeholderText:
      "Commentary placeholder: add interpretation on weak domestic saving, remittance-supported national saving, and investment softness.",
    charts: [
      {
        id: "saving-investment-gap",
        type: "bar",
        title: "Savings, Investment, and Consumption",
        description: "Average shares of GDP over the past decade.",
        data: [
          { category: "Gross domestic saving", value: 8.5 },
          { category: "Total investment", value: 33.9 },
          { category: "Saving-investment gap", value: -25.4 },
          { category: "Gross national saving", value: 35.8 },
          { category: "Total consumption", value: 91.5 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "% of GDP",
      },
    ],
  },

  taxBase: {
    title: "Tax Base and Formalization",
    placeholderText:
      "Commentary placeholder: add interpretation on narrow tax base, large taxpayer concentration, informality, and filing compliance.",
    charts: [
      {
        id: "pan-registration",
        type: "bar",
        title: "Registered Taxpayer Base",
        description: "PAN and tax registration counts.",
        data: [
          { category: "Total PAN", value: 7549000 },
          { category: "Individual PAN", value: 5433000 },
          { category: "Business PAN", value: 2079000 },
          { category: "VAT registered", value: 361000 },
          { category: "Excise registered", value: 124000 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "taxpayers",
      },
      {
        id: "tax-base-stress",
        type: "bar",
        title: "Tax Base Stress Indicators",
        description: "Selected indicators of concentration and informality.",
        data: [
          { category: "Internal revenue from 100 large taxpayers", value: 51 },
          { category: "Informal economy estimate", value: 40 },
          { category: "Unregistered establishments", value: 49.5 },
          { category: "Registered establishments keeping accounts", value: 52 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "%",
      },
    ],
  },

  federalism: {
    title: "Fiscal Federalism",
    placeholderText:
      "Commentary placeholder: add interpretation on expenditure decentralization versus revenue centralization.",
    charts: [
      {
        id: "federalism-expenditure",
        type: "bar",
        title: "Expenditure Share by Level of Government",
        description: "Share of consolidated expenditure in FY 2081/82.",
        data: [
          { level: "Federal", value: 65.6 },
          { level: "Province", value: 9.8 },
          { level: "Local", value: 24.6 },
        ],
        xKey: "level",
        yKey: "value",
        unit: "%",
      },
      {
        id: "federalism-revenue",
        type: "bar",
        title: "Revenue Collection Share",
        description: "Revenue collection remains concentrated federally.",
        data: [
          { level: "Federal", value: 92.1 },
          { level: "Province and local", value: 7.9 },
        ],
        xKey: "level",
        yKey: "value",
        unit: "%",
      },
      {
        id: "budget-utilization",
        type: "bar",
        title: "Subnational Budget Utilization",
        description: "Budget utilization rates for province and local levels.",
        data: [
          { level: "Province", value: 71.3 },
          { level: "Local", value: 76.4 },
        ],
        xKey: "level",
        yKey: "value",
        unit: "%",
      },
    ],
  },

  developmentGovernance: {
    title: "Development and Governance Indicators",
    placeholderText:
      "Commentary placeholder: add interpretation on SDG gap, governance, human development, and LDC graduation risks.",
    charts: [
      {
        id: "sdg-progress",
        type: "bar",
        title: "SDG Progress Gap",
        description:
          "Progress achieved and projected by 2030 under current pace.",
        data: [
          { category: "Progress achieved by 2022", value: 41.7 },
          { category: "Projected progress by 2030", value: 60.5 },
          { category: "Target", value: 100 },
        ],
        xKey: "category",
        yKey: "value",
        unit: "%",
      },
      {
        id: "governance-development",
        type: "bar",
        title: "Governance and Human Development Snapshot",
        description:
          "Selected global indicators reported in the white paper.",
        data: [
          { indicator: "CPI score", value: 34 },
          { indicator: "HDI score × 100", value: 62.2 },
          { indicator: "CPI rank", value: 109 },
          { indicator: "HDI rank", value: 145 },
        ],
        xKey: "indicator",
        yKey: "value",
        note: "Label clearly: HDI score is multiplied by 100 only for chart comparability.",
      },
    ],
  },

  infrastructureTourism: {
    title: "Energy and Tourism",
    placeholderText:
      "Commentary placeholder: add interpretation on electricity capacity, access, tourism recovery, and infrastructure constraints.",
    charts: [
      {
        id: "electricity-capacity",
        type: "bar",
        title: "Electricity Installed Capacity",
        description:
          "Installed capacity increased sharply from the earlier benchmark to Falgun 2082.",
        data: [
          { period: "Up to Ashar 2068", value: 697.85 },
          { period: "Falgun 2082", value: 4105 },
        ],
        xKey: "period",
        yKey: "value",
        unit: "MW",
      },
      {
        id: "tourism-capacity",
        type: "bar",
        title: "Tourism and Hotel Capacity",
        description: "Tourist arrivals and accommodation capacity indicators.",
        data: [
          { category: "Foreign tourist arrivals, 2025", value: 1158000 },
          { category: "Tourist-standard hotels", value: 1600 },
          { category: "Daily bed capacity", value: 64000 },
        ],
        xKey: "category",
        yKey: "value",
        note: "Use compact number formatting.",
      },
    ],
  },
};
