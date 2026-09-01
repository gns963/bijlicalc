export interface MegaMenuLink {
  label: string
  href: string
  sub?: string
  icon?: string
}

export interface MegaMenuColumn {
  heading: string
  links: MegaMenuLink[]
  viewAllHref?: string
  viewAllLabel?: string
}

export interface HubMenu {
  key: string
  label: string
  href: string
  emoji: string
  columns: MegaMenuColumn[]
}

export const MEGA_MENU: HubMenu[] = [
  {
    key: 'electricity',
    label: 'Electricity',
    href: '/electricity',
    emoji: '⚡',
    columns: [
      {
        heading: 'State Calculators',
        links: [
          { label: 'TNEB Calculator', href: '/electricity/tneb-bill-calculator', sub: 'Tamil Nadu' },
          { label: 'BESCOM Calculator', href: '/electricity/bescom-bill-calculator', sub: 'Karnataka' },
          { label: 'UPPCL Calculator', href: '/electricity/uppcl-bill-calculator', sub: 'Uttar Pradesh' },
          { label: 'MSEDCL Calculator', href: '/electricity/msedcl-bill-calculator', sub: 'Maharashtra' },
          { label: 'KSEB Calculator', href: '/electricity/kseb-bill-calculator', sub: 'Kerala' },
          { label: 'WBSEDCL Calculator', href: '/electricity/wbsedcl-bill-calculator', sub: 'West Bengal' },
        ],
        viewAllHref: '/electricity',
        viewAllLabel: 'All 37 state calculators',
      },
      {
        heading: 'Electricity Tools',
        links: [
          { label: 'Electricity Bill Calculator', href: '/electricity', sub: 'Every state & DISCOM', icon: '🧾' },
          { label: 'Unit Price Directory', href: '/electricity/unit-price', sub: 'Real ₹/unit by state', icon: '📍' },
          { label: 'EV Charging Cost', href: '/electricity/ev-charging-cost-calculator', sub: 'Priced on your DISCOM', icon: '🔌' },
          { label: 'Appliance Cost Calculator', href: '/electricity/appliance-cost-calculator', sub: 'Any appliance, any wattage', icon: '🔋' },
        ],
      },
    ],
  },
  {
    key: 'solar',
    label: 'Solar',
    href: '/solar',
    emoji: '☀️',
    columns: [
      {
        heading: 'Solar Tools',
        links: [
          { label: 'Solar ROI Calculator', href: '/solar/roi-calculator', sub: 'Payback & 25-yr savings', icon: '📈' },
          { label: 'PM Surya Ghar Subsidy', href: '/solar/subsidy-calculator', sub: 'Up to ₹78,000', icon: '💸' },
          { label: 'Panel Size Calculator', href: '/solar/panel-size-calculator', sub: 'kW & roof area you need', icon: '📐' },
          { label: 'Battery Backup Calculator', href: '/solar/battery-backup-calculator', sub: 'Size your battery bank', icon: '🔋' },
          { label: 'Net Metering Calculator', href: '/solar/net-metering-calculator', sub: 'Export earnings by state', icon: '🔄' },
        ],
        viewAllHref: '/solar',
        viewAllLabel: 'All solar tools',
      },
      {
        heading: 'State Solar Bill Calculators',
        links: [
          { label: 'Tamil Nadu (TNEB)', href: '/solar/bill-calculator/tneb' },
          { label: 'Maharashtra (MSEDCL)', href: '/solar/bill-calculator/msedcl' },
          { label: 'Uttar Pradesh (UPPCL)', href: '/solar/bill-calculator/uppcl' },
        ],
        viewAllHref: '/solar/bill-calculator',
        viewAllLabel: 'All state solar calculators',
      },
    ],
  },
  {
    key: 'ac',
    label: 'AC',
    href: '/ac',
    emoji: '❄️',
    columns: [
      {
        heading: 'AC Tools',
        links: [
          { label: 'AC Running Cost', href: '/ac/bill-calculator', sub: 'Priced at your top slab', icon: '💡' },
          { label: 'AC Tonnage Calculator', href: '/ac/tonnage-calculator', sub: 'Right size for your room', icon: '📐' },
          { label: '3★ vs 5★ Savings', href: '/ac/comparisons/3-star-vs-5-star-savings-guide', sub: 'Is 5-star worth it?', icon: '⭐' },
          { label: 'AC Comparison Tool', href: '/ac/comparison-tool', sub: 'Compare any two configs', icon: '🆚' },
          { label: 'Power Consumption', href: '/ac/power-consumption-calculator', sub: 'From rated current', icon: '🔢' },
          { label: 'Circuit Safety Calculator', href: '/ac/circuit-safety-calculator', sub: 'MCB & wire sizing', icon: '🛡️' },
        ],
        viewAllHref: '/ac',
        viewAllLabel: 'All AC tools',
      },
      {
        heading: 'Shop by Brand',
        links: [
          { label: 'LG', href: '/ac/brands/lg' },
          { label: 'Samsung', href: '/ac/brands/samsung' },
          { label: 'Voltas', href: '/ac/brands/voltas' },
          { label: 'Daikin', href: '/ac/brands/daikin' },
          { label: 'Blue Star', href: '/ac/brands/blue-star' },
          { label: 'Panasonic', href: '/ac/brands/panasonic' },
        ],
        viewAllHref: '/ac/brands',
        viewAllLabel: 'All AC brands',
      },
    ],
  },
  {
    key: 'water',
    label: 'Water',
    href: '/water',
    emoji: '💧',
    columns: [
      {
        heading: 'Water Tools',
        links: [
          { label: 'Delhi Jal Board (DJB)', href: '/water/delhi', sub: 'Real tariff, incl. 20 KL free rule', icon: '📊' },
          { label: 'Tamil Nadu', href: '/water/tamil-nadu', sub: 'Your own rate' },
          { label: 'Maharashtra', href: '/water/maharashtra', sub: 'Your own rate' },
          { label: 'Karnataka', href: '/water/karnataka', sub: 'Your own rate' },
        ],
        viewAllHref: '/water',
        viewAllLabel: 'All state water calculators',
      },
    ],
  },
  {
    key: 'gas',
    label: 'Gas',
    href: '/gas',
    emoji: '🔥',
    columns: [
      {
        heading: 'Gas Tools',
        links: [
          { label: 'IGL (Delhi/NCR)', href: '/gas/igl', sub: 'Real tariff, no rate entry', icon: '📊' },
          { label: 'Adani Gas', href: '/gas/adani-gas', sub: 'Your own rate' },
          { label: 'Mahanagar Gas', href: '/gas/mahanagar-gas', sub: 'Mumbai · Your own rate' },
          { label: 'Gujarat Gas', href: '/gas/gujarat-gas', sub: 'Your own rate' },
        ],
        viewAllHref: '/gas',
        viewAllLabel: 'All gas providers',
      },
    ],
  },
  {
    key: 'appliances',
    label: 'Appliances',
    href: '/appliances',
    emoji: '🔌',
    columns: [
      {
        heading: 'Whole-Home Tools',
        links: [
          { label: 'Household Bill Builder', href: '/appliances/household-bill-builder', sub: 'Real progressive slab pricing', icon: '🏠' },
          { label: 'Phantom Load Checker', href: '/appliances/phantom-load-checker', sub: 'Standby power cost', icon: '👻' },
          { label: 'Inverter Sizing', href: '/appliances/inverter-sizing-calculator', sub: 'VA rating & battery Ah', icon: '🔌' },
          { label: 'Inverter Backup Time', href: '/appliances/inverter-backup-time-calculator', sub: 'How long it lasts', icon: '🔋' },
        ],
        viewAllHref: '/appliances',
        viewAllLabel: 'All appliance tools',
      },
      {
        heading: 'Single Appliance',
        links: [
          { label: 'Ceiling Fan Cost', href: '/appliances/ceiling-fan-cost-calculator', icon: '🌀' },
          { label: 'Fridge Cost', href: '/appliances/fridge-cost-calculator', icon: '❄️' },
          { label: 'Air Cooler Cost', href: '/appliances/air-cooler-cost-calculator', icon: '🌬️' },
          { label: 'Induction Cooktop Cost', href: '/appliances/induction-cooktop-cost-calculator', icon: '🍳' },
          { label: 'Room Cooling Time', href: '/appliances/room-cooling-time-calculator', icon: '⏱️' },
          { label: 'Water Tank Fill Time', href: '/appliances/water-tank-filling-time-calculator', icon: '🚰' },
        ],
      },
    ],
  },
  {
    key: 'fuel-cost',
    label: 'Fuel',
    href: '/fuel-cost',
    emoji: '⛽',
    columns: [
      {
        heading: 'Fuel Cost Tools',
        links: [
          { label: 'Petrol/Diesel Cost Per KM', href: '/fuel-cost/petrol-diesel-cost-per-km-calculator', icon: '🚗' },
          { label: 'LPG Cylinder Usage', href: '/fuel-cost/lpg-cylinder-usage-calculator', icon: '🔥' },
          { label: 'Generator Fuel Cost', href: '/fuel-cost/generator-fuel-consumption-calculator', icon: '🛠️' },
          { label: 'EV Charging Cost', href: '/electricity/ev-charging-cost-calculator', sub: 'Compare against fuel', icon: '🔌' },
        ],
        viewAllHref: '/fuel-cost',
        viewAllLabel: 'All fuel cost tools',
      },
    ],
  },
  {
    key: 'financial',
    label: 'Financial',
    href: '/financial',
    emoji: '🧮',
    columns: [
      {
        heading: 'Financial Calculators',
        links: [
          { label: 'GST Calculator', href: '/financial/gst-calculator', sub: 'GST 2.0 slabs', icon: '🧾' },
          { label: 'SIP Calculator', href: '/financial/sip-calculator', sub: 'Mutual fund maturity value', icon: '📈' },
          { label: 'New vs Old Tax Regime', href: '/financial/new-vs-old-tax-regime-calculator', sub: 'FY 2026-27', icon: '🏦' },
          { label: 'Gratuity Calculator', href: '/financial/gratuity-calculator', sub: '15/26 formula', icon: '💼' },
        ],
        viewAllHref: '/financial',
        viewAllLabel: 'All financial tools',
      },
    ],
  },
]
