/**
 * Shared UI-chrome strings for DiscomCalculatorPage — the template shared by
 * all 36 state/DISCOM electricity pages. This covers only the identical
 * template text (headings, labels, table chrome); each DISCOM's own
 * hand-authored prose (intro, explainer, FAQs, about, etc.) lives in
 * src/data/calculator-pages.tsx and is translated separately, per state.
 *
 * Mirrors the src/data/home-texts pattern: one typed dictionary per locale,
 * consumed by the one shared component, so translating a new language means
 * writing strings here, never touching component logic.
 */
export interface DiscomPageTexts {
  breadcrumbHome: string
  breadcrumbElectricity: string
  heroSubhead: (state: string) => string
  heroCta: (code: string) => string
  heroAllStates: string
  heroWorkedExampleLabel: string
  heroWorkedExampleLead: (units: number, cycle: string) => string
  toc: {
    calculator: string
    budgetTool: string
    howToUse: string
    billingCycle: string
    tariffTable: (state: string) => string
    workedExamples: string
    billTraps: string
    howCalculated: string
    billAudit: string
    whatsIncluded: string
    meterReading: string
    solar: string
    applianceUpgrades: string
    comparison: (code: string) => string
    tips: string
    netMetering: string
    about: (code: string) => string
    coverage: string
    howToPay: string
    faq: string
    related: string
  }
  howToSteps: {
    selectState: string
    sanctionedLoad: string
    enterUnits: string
    choosePhase: string
    reviewResult: string
  }
  calculateYourBill: string
  workedExampleHeading: string
  workedExampleAboutPerMonth: string
  workedExampleThatIs: string
  seeFullBreakdown: string
  budgetToolHeading: string
  budgetToolBody: string
  howToUseHeading: string
  monthlyBillingCycle: string
  cycleRule: (cycle: string) => string
  billingCycleBody: (code: string, cycle: string) => string
  billingCycleLongBody: (periodDays: string, divisor: string) => string
  tariffTableHeading: (state: string) => string
  slabUnits: string
  rateUnit: string
  fixedChargeLabel: string
  fuelCostAdjustmentLabel: string
  electricityDutyLabel: string
  effectiveFromVerified: (effective: string, verified: string) => string
  sourceOrder: string
  twoWorkedExamples: string
  lowerUsage: string
  higherUsage: string
  unitsLabel: string
  energyLabel: string
  subsidyLabel: string
  fixedLabel: string
  fcaLabel: string
  dutyLabel: string
  commonBillTraps: (code: string) => string
  howBillCalculated: (code: string) => string
  billAuditHeading: string
  billAuditBody: (units: number) => string
  whatsIncludedHeading: string
  componentLabel: string
  whatItIsLabel: string
  typicalRangeLabel: string
  energyChargeRow: { label: string; desc: string }
  fuelCostAdjustmentRow: { label: string; desc: string }
  fixedChargeRow: { label: string; desc: string }
  electricityDutyRow: { label: string; desc: string }
  subsidyRow: { label: string }
  freeUnits: (n: number) => string
  meterReadingHeading: string
  meterReadingBody: string
  applianceUpgradesHeading: string
  comparisonHeading: (code: string) => string
  tipsHeading: (code: string) => string
  tipSubsidy: (schemeName: string, value: number) => string
  tipSlabThreshold: (rate: string) => string
  tipFca: (rate: number) => string
  tipSolar: string
  netMeteringHeading: string
  netMeteringBody: string
  estimateSolarPayback: string
  aboutHeading: (code: string) => string
  howToPayHeading: string
  officialPortal: string
  helpline: string
  faqHeading: string
  relatedHeading: string
  relatedAllStates: { label: string; sub: string }
  relatedSolarRoi: { label: string; sub: string }
  relatedAcCost: { label: string; sub: string }
  relatedFinancial: { label: string; sub: string }
  footerVerified: (date: string) => string
  footerEffectiveFrom: (date: string) => string
  footerSource: string
  footerTariffOrder: (name: string) => string
  footerEstimatesOnly: string
  footerMethodology: string
  footerDataSources: string
  footerDisclaimer: string
}

export const enDiscomPageTexts: DiscomPageTexts = {
  breadcrumbHome: 'Home',
  breadcrumbElectricity: 'Electricity',
  heroSubhead: (state) => `Estimate your ${state} electricity bill`,
  heroCta: (code) => `Calculate My ${code} Bill`,
  heroAllStates: 'All state calculators →',
  heroWorkedExampleLabel: 'Worked example',
  heroWorkedExampleLead: (units, cycle) => `A ${units}-unit ${cycle} bill works out to`,
  toc: {
    calculator: 'Calculate your bill',
    budgetTool: 'Budget → units calculator',
    howToUse: 'How to use this calculator',
    billingCycle: 'Billing cycle explained',
    tariffTable: (state) => `${state} tariff slabs`,
    workedExamples: 'Worked examples',
    billTraps: 'Common bill traps',
    howCalculated: 'How the bill is calculated',
    billAudit: 'Your bill, component by component',
    whatsIncluded: "What's included in your bill",
    meterReading: 'How to read your meter',
    solar: 'Solar savings',
    applianceUpgrades: 'Tools that cut your bill',
    comparison: (code) => `${code} vs neighbouring DISCOMs`,
    tips: 'Tips to reduce your bill',
    netMetering: 'Net metering explained',
    about: (code) => `About ${code}`,
    coverage: 'Coverage area',
    howToPay: 'Check & pay your bill',
    faq: 'Frequently asked questions',
    related: 'Related calculators',
  },
  howToSteps: {
    selectState: "Select your state — it's pre-selected for this page",
    sanctionedLoad: 'Enter your sanctioned load in kW, shown on your bill or meter agreement',
    enterUnits: 'Enter the units consumed shown on your bill, or your meter readings',
    choosePhase: 'Choose your connection phase (single or three) if applicable',
    reviewResult: 'Review the itemised slab-by-slab result below the calculator',
  },
  calculateYourBill: 'Calculate your bill',
  workedExampleHeading: 'Worked example',
  workedExampleAboutPerMonth: 'about',
  workedExampleThatIs: 'That is',
  seeFullBreakdown: 'See the full breakdown ↓',
  budgetToolHeading: 'Have a fixed budget? Work backwards',
  budgetToolBody:
    "Enter what you want to spend, and we'll tell you the maximum units that stays within it — the exact inverse of the calculator above.",
  howToUseHeading: 'How to use this calculator',
  monthlyBillingCycle: 'Your monthly billing cycle',
  cycleRule: (cycle) => `The ${cycle} rule`,
  billingCycleBody: (code, cycle) => `${code} bills ${cycle}.`,
  billingCycleLongBody: (periodDays, divisor) =>
    ` The units you enter represent your full ${periodDays} billing period — not a single month. To compare against a monthly figure, we divide the total by ${divisor}, shown as the monthly-equivalent on your result.`,
  tariffTableHeading: (state) => `${state} residential tariff slabs`,
  slabUnits: 'Slab (units)',
  rateUnit: 'Rate (₹/unit)',
  fixedChargeLabel: 'Fixed charge',
  fuelCostAdjustmentLabel: 'Fuel cost adjustment',
  electricityDutyLabel: 'Electricity duty',
  effectiveFromVerified: (effective, verified) => `Effective from ${effective} · Verified ${verified} ·`,
  sourceOrder: 'source order',
  twoWorkedExamples: 'Two worked examples',
  lowerUsage: 'Lower usage',
  higherUsage: 'Higher usage',
  unitsLabel: 'units',
  energyLabel: 'energy',
  subsidyLabel: 'subsidy',
  fixedLabel: 'fixed',
  fcaLabel: 'FCA',
  dutyLabel: 'duty',
  commonBillTraps: (code) => `Common ${code} bill traps`,
  howBillCalculated: (code) => `How the ${code} bill is calculated`,
  billAuditHeading: 'Your bill, component by component',
  billAuditBody: (units) => `Based on the ${units}-unit example above. Expand each line for what it means and whether you can influence it.`,
  whatsIncludedHeading: "What's included in your bill",
  componentLabel: 'Component',
  whatItIsLabel: 'What it is',
  typicalRangeLabel: 'Typical range',
  energyChargeRow: { label: 'Energy charge', desc: 'Units × slab rate, telescopic' },
  fuelCostAdjustmentRow: { label: 'Fuel cost adjustment', desc: 'Pass-through fuel surcharge' },
  fixedChargeRow: { label: 'Fixed charge', desc: 'Flat, independent of usage' },
  electricityDutyRow: { label: 'Electricity duty', desc: 'State government levy' },
  subsidyRow: { label: 'Subsidy' },
  freeUnits: (n) => `${n} free units`,
  meterReadingHeading: 'How to read your meter',
  meterReadingBody:
    'Digital meters show a running total in kWh ("units") on an LCD display — write down the number before the decimal point. To find your consumption for a billing period, subtract your previous reading from your current reading; that is exactly what the "Meter reading" mode in the calculator above does for you. Analog meters use a set of dial gauges read left to right — note the number the pointer has just passed on each dial.',
  applianceUpgradesHeading: 'Tools that cut your bill',
  comparisonHeading: (code) => `How does ${code} compare?`,
  tipsHeading: (code) => `Tips to reduce your ${code} bill`,
  tipSubsidy: (schemeName, value) =>
    `Confirm your eligibility for ${schemeName} is correctly marked on your account — it's worth ${value} free units every cycle.`,
  tipSlabThreshold: (rate) => `Where practical, keep usage below your next slab threshold — the marginal units above ₹${rate}/unit cost the most.`,
  tipFca: (rate) => `The ₹${rate}/unit fuel cost adjustment applies to every unit you use, so reducing overall consumption reduces this line too — unlike the fixed charge.`,
  tipSolar: 'For high-usage households, rooftop solar can offset your most expensive top-slab units — see the solar section above.',
  netMeteringHeading: 'Net metering explained',
  netMeteringBody:
    "Net metering lets a rooftop solar system export surplus power back to the grid through your existing meter, which runs in reverse. At billing time, your DISCOM credits the exported units against what you drew from the grid — you're billed only for the net difference. Combined with telescopic slabs, this typically offsets your most expensive units first.",
  estimateSolarPayback: 'Estimate your solar payback →',
  aboutHeading: (code) => `About ${code}`,
  howToPayHeading: 'How to check and pay your bill',
  officialPortal: 'Official portal',
  helpline: 'Helpline',
  faqHeading: 'Frequently asked questions',
  relatedHeading: 'Related calculators',
  relatedAllStates: { label: 'All states & UTs', sub: 'Every DISCOM calculator' },
  relatedSolarRoi: { label: 'Solar ROI', sub: 'Payback on this tariff' },
  relatedAcCost: { label: 'AC running cost', sub: 'Priced at your top slab' },
  relatedFinancial: { label: 'Financial calculators', sub: 'GST, SIP, gratuity, tax' },
  footerVerified: (date) => `Verified ${date}`,
  footerEffectiveFrom: (date) => `Effective from ${date}`,
  footerSource: 'Source:',
  footerTariffOrder: (name) => `${name} tariff order`,
  footerEstimatesOnly: 'Estimates only.',
  footerMethodology: 'How we source & verify data',
  footerDataSources: 'Data sources',
  footerDisclaimer: 'Disclaimer',
}

export const hiDiscomPageTexts: DiscomPageTexts = {
  breadcrumbHome: 'होम',
  breadcrumbElectricity: 'बिजली',
  heroSubhead: (state) => `अपने ${state} बिजली बिल का अनुमान लगाएं`,
  heroCta: (code) => `मेरा ${code} बिल कैलकुलेट करें`,
  heroAllStates: 'सभी राज्य कैलकुलेटर →',
  heroWorkedExampleLabel: 'उदाहरण',
  heroWorkedExampleLead: (units, cycle) => `${units} यूनिट का ${cycle} बिल इतना आता है`,
  toc: {
    calculator: 'अपना बिल कैलकुलेट करें',
    budgetTool: 'बजट → यूनिट कैलकुलेटर',
    howToUse: 'यह कैलकुलेटर कैसे इस्तेमाल करें',
    billingCycle: 'बिलिंग साइकल समझाया गया',
    tariffTable: (state) => `${state} टैरिफ स्लैब`,
    workedExamples: 'उदाहरण',
    billTraps: 'आम बिल ट्रैप',
    howCalculated: 'बिल कैसे कैलकुलेट होता है',
    billAudit: 'आपका बिल, हिस्सा दर हिस्सा',
    whatsIncluded: 'आपके बिल में क्या शामिल है',
    meterReading: 'अपना मीटर कैसे पढ़ें',
    solar: 'सोलर बचत',
    applianceUpgrades: 'बिल कम करने वाले टूल्स',
    comparison: (code) => `${code} बनाम पड़ोसी डिस्कॉम`,
    tips: 'अपना बिल कम करने के तरीके',
    netMetering: 'नेट मीटरिंग समझाया गया',
    about: (code) => `${code} के बारे में`,
    coverage: 'कवरेज क्षेत्र',
    howToPay: 'बिल चेक करें और भरें',
    faq: 'अक्सर पूछे जाने वाले सवाल',
    related: 'संबंधित कैलकुलेटर',
  },
  howToSteps: {
    selectState: 'अपना राज्य चुनें — इस पेज के लिए यह पहले से चुना हुआ है',
    sanctionedLoad: 'अपना स्वीकृत लोड kW में डालें, जो आपके बिल या मीटर एग्रीमेंट पर लिखा है',
    enterUnits: 'अपने बिल या मीटर रीडिंग में दिखाई गई यूनिट डालें',
    choosePhase: 'अगर लागू हो तो अपना कनेक्शन फेज़ (सिंगल या थ्री) चुनें',
    reviewResult: 'नीचे कैलकुलेटर के परिणाम में स्लैब-दर-स्लैब ब्यौरा देखें',
  },
  calculateYourBill: 'अपना बिल कैलकुलेट करें',
  workedExampleHeading: 'उदाहरण',
  workedExampleAboutPerMonth: 'लगभग',
  workedExampleThatIs: 'यह है',
  seeFullBreakdown: 'पूरा ब्यौरा देखें ↓',
  budgetToolHeading: 'तय बजट है? उल्टा हिसाब लगाएं',
  budgetToolBody: 'आप जितना खर्च करना चाहते हैं वह डालें, हम बताएंगे कि उतने में अधिकतम कितनी यूनिट आ सकती हैं — ऊपर के कैलकुलेटर का ठीक उल्टा।',
  howToUseHeading: 'यह कैलकुलेटर कैसे इस्तेमाल करें',
  monthlyBillingCycle: 'आपकी मासिक बिलिंग साइकल',
  cycleRule: (cycle) => `${cycle} नियम`,
  billingCycleBody: (code, cycle) => `${code} ${cycle} बिल करता है।`,
  billingCycleLongBody: (periodDays, divisor) =>
    ` आप जो यूनिट डालते हैं वह आपकी पूरी ${periodDays} बिलिंग अवधि दर्शाती है — किसी एक महीने की नहीं। मासिक आंकड़े से तुलना के लिए, हम कुल को ${divisor} से भाग देते हैं, जो आपके परिणाम में मासिक-समतुल्य के रूप में दिखता है।`,
  tariffTableHeading: (state) => `${state} घरेलू टैरिफ स्लैब`,
  slabUnits: 'स्लैब (यूनिट)',
  rateUnit: 'दर (₹/यूनिट)',
  fixedChargeLabel: 'फिक्स्ड चार्ज',
  fuelCostAdjustmentLabel: 'फ्यूल कॉस्ट एडजस्टमेंट',
  electricityDutyLabel: 'बिजली शुल्क (ड्यूटी)',
  effectiveFromVerified: (effective, verified) => `${effective} से लागू · ${verified} को सत्यापित ·`,
  sourceOrder: 'स्रोत आदेश',
  twoWorkedExamples: 'दो उदाहरण',
  lowerUsage: 'कम खपत',
  higherUsage: 'ज़्यादा खपत',
  unitsLabel: 'यूनिट',
  energyLabel: 'एनर्जी',
  subsidyLabel: 'सब्सिडी',
  fixedLabel: 'फिक्स्ड',
  fcaLabel: 'FCA',
  dutyLabel: 'ड्यूटी',
  commonBillTraps: (code) => `आम ${code} बिल ट्रैप`,
  howBillCalculated: (code) => `${code} बिल कैसे कैलकुलेट होता है`,
  billAuditHeading: 'आपका बिल, हिस्सा दर हिस्सा',
  billAuditBody: (units) => `ऊपर दिए गए ${units}-यूनिट उदाहरण पर आधारित। हर लाइन का मतलब जानने और उसे प्रभावित कर सकते हैं या नहीं, यह जानने के लिए उसे खोलें।`,
  whatsIncludedHeading: 'आपके बिल में क्या शामिल है',
  componentLabel: 'हिस्सा',
  whatItIsLabel: 'यह क्या है',
  typicalRangeLabel: 'सामान्य सीमा',
  energyChargeRow: { label: 'एनर्जी चार्ज', desc: 'यूनिट × स्लैब दर, टेलीस्कोपिक' },
  fuelCostAdjustmentRow: { label: 'फ्यूल कॉस्ट एडजस्टमेंट', desc: 'सीधे पास होने वाला फ्यूल सरचार्ज' },
  fixedChargeRow: { label: 'फिक्स्ड चार्ज', desc: 'खपत से स्वतंत्र, तय राशि' },
  electricityDutyRow: { label: 'बिजली शुल्क (ड्यूटी)', desc: 'राज्य सरकार का लेवी' },
  subsidyRow: { label: 'सब्सिडी' },
  freeUnits: (n) => `${n} मुफ़्त यूनिट`,
  meterReadingHeading: 'अपना मीटर कैसे पढ़ें',
  meterReadingBody:
    'डिजिटल मीटर LCD डिस्प्ले पर kWh ("यूनिट") में कुल रीडिंग दिखाते हैं — दशमलव बिंदु से पहले की संख्या नोट करें। किसी बिलिंग अवधि की खपत जानने के लिए, अपनी मौजूदा रीडिंग में से पिछली रीडिंग घटाएं — ऊपर कैलकुलेटर का "मीटर रीडिंग" मोड ठीक यही काम करता है। एनालॉग मीटर में डायल गेज होते हैं जिन्हें बाएं से दाएं पढ़ा जाता है — हर डायल पर सुई जिस संख्या को अभी पार कर चुकी है उसे नोट करें।',
  applianceUpgradesHeading: 'बिल कम करने वाले टूल्स',
  comparisonHeading: (code) => `${code} की तुलना कैसी है?`,
  tipsHeading: (code) => `अपना ${code} बिल कम करने के तरीके`,
  tipSubsidy: (schemeName, value) =>
    `अपने खाते में ${schemeName} की पात्रता सही ढंग से दर्ज है, यह जांच लें — हर साइकल में ${value} मुफ़्त यूनिट की बचत होती है।`,
  tipSlabThreshold: (rate) => `जहां संभव हो, अपनी खपत अगले स्लैब की सीमा से नीचे रखें — ₹${rate}/यूनिट से ऊपर की यूनिट सबसे महंगी पड़ती हैं।`,
  tipFca: (rate) => `₹${rate}/यूनिट का फ्यूल कॉस्ट एडजस्टमेंट हर यूनिट पर लागू होता है, इसलिए कुल खपत घटाने से यह हिस्सा भी घटता है — फिक्स्ड चार्ज के विपरीत।`,
  tipSolar: 'ज़्यादा खपत वाले घरों के लिए, रूफटॉप सोलर आपकी सबसे महंगी टॉप-स्लैब यूनिट की भरपाई कर सकता है — ऊपर सोलर सेक्शन देखें।',
  netMeteringHeading: 'नेट मीटरिंग समझाया गया',
  netMeteringBody:
    'नेट मीटरिंग से रूफटॉप सोलर सिस्टम अतिरिक्त बिजली आपके मौजूदा मीटर के ज़रिए वापस ग्रिड में भेज सकता है, जो उल्टा चलता है। बिलिंग के समय, आपका डिस्कॉम भेजी गई यूनिट को आपके द्वारा ग्रिड से ली गई यूनिट के बदले क्रेडिट करता है — आपसे सिर्फ नेट अंतर का बिल लिया जाता है। टेलीस्कोपिक स्लैब के साथ, यह आमतौर पर आपकी सबसे महंगी यूनिट की भरपाई पहले करता है।',
  estimateSolarPayback: 'अपना सोलर पेबैक अनुमान लगाएं →',
  aboutHeading: (code) => `${code} के बारे में`,
  howToPayHeading: 'अपना बिल कैसे चेक करें और भरें',
  officialPortal: 'आधिकारिक पोर्टल',
  helpline: 'हेल्पलाइन',
  faqHeading: 'अक्सर पूछे जाने वाले सवाल',
  relatedHeading: 'संबंधित कैलकुलेटर',
  relatedAllStates: { label: 'सभी राज्य और केंद्र शासित प्रदेश', sub: 'हर डिस्कॉम कैलकुलेटर' },
  relatedSolarRoi: { label: 'सोलर ROI', sub: 'इस टैरिफ पर पेबैक' },
  relatedAcCost: { label: 'AC चलाने की लागत', sub: 'आपके टॉप स्लैब पर कीमत' },
  relatedFinancial: { label: 'वित्तीय कैलकुलेटर', sub: 'GST, SIP, ग्रेच्युटी, टैक्स' },
  footerVerified: (date) => `${date} को सत्यापित`,
  footerEffectiveFrom: (date) => `${date} से लागू`,
  footerSource: 'स्रोत:',
  footerTariffOrder: (name) => `${name} टैरिफ आदेश`,
  footerEstimatesOnly: 'केवल अनुमान।',
  footerMethodology: 'हम डेटा कैसे स्रोत और सत्यापित करते हैं',
  footerDataSources: 'डेटा स्रोत',
  footerDisclaimer: 'अस्वीकरण',
}
