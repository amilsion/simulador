import { ref, computed } from 'vue';

export function useAmortization(initialPv = 250000, initialRateAa = 8, initialMonths = 420, initialSystem = 'PRICE', initialTaxaAdm = 0, initialDfi = 0, initialMip = 0) {
  const pv = ref(initialPv);
  const rateAa = ref(initialRateAa);
  const months = ref(initialMonths);
  const system = ref(initialSystem);
  const taxaAdm = ref(initialTaxaAdm);
  const seguroDfi = ref(initialDfi);
  const seguroMip = ref(initialMip);
  
  // Extra amortizations state: { [monthIndex]: value }
  const extraAmortizations = ref({});
  const fgtsAmortizations = ref({});

  const rateMonth = computed(() => {
    return (rateAa.value / 100) / 12;
  });

  const rateMonthDisplay = computed(() => {
    return (rateMonth.value * 100).toFixed(2) + '%';
  });

  const schedule = computed(() => {
    const originalTable = [];
    const amortizedTable = [];
    
    let originalBalance = pv.value;
    let amortizedBalance = pv.value;

    const r = rateMonth.value;
    const n = months.value;
    const mipRate = pv.value > 0 ? seguroMip.value / pv.value : 0;
    
    let originalTotalJuros = 0;
    let originalTotalFeesAcum = 0;
    
    let amortizedTotalJuros = 0;
    let amortizedTotalFeesAcum = 0;
    let totalManual = 0;
    let totalFgts = 0;

    let amortizedTerm = n;
    let isPaidOff = false;

    for (let i = 1; i <= n; i++) {
      // --- ORIGINAL CALCULATION ---
      const origInitialBalance = originalBalance;
      const origJuros = originalBalance * r;
      const origMip = origInitialBalance * mipRate;
      const origTotalFees = taxaAdm.value + seguroDfi.value + origMip;
      
      let origAmort = 0;
      let origPmtBase = 0;

      if (system.value === 'SAC') {
        origAmort = origInitialBalance > 0 ? pv.value / n : 0;
        if (origAmort > origInitialBalance) origAmort = origInitialBalance;
        origPmtBase = origAmort + origJuros;
      } else {
        const pmtPrice = r > 0 ? (origInitialBalance * r * Math.pow(1 + r, n - i + 1)) / (Math.pow(1 + r, n - i + 1) - 1) : origInitialBalance / (n - i + 1);
        origPmtBase = pmtPrice || 0;
        origAmort = origPmtBase - origJuros;
        if (origAmort > origInitialBalance) {
          origAmort = origInitialBalance;
          origPmtBase = origAmort + origJuros;
        }
      }

      const origPmt = origInitialBalance > 0 ? origPmtBase + origTotalFees : 0;
      originalBalance = originalBalance - origAmort;
      if (originalBalance < 0.01) originalBalance = 0;

      if (origInitialBalance > 0) {
        originalTotalJuros += origJuros;
        originalTotalFeesAcum += origTotalFees;
      }

      originalTable.push({
        month: i,
        remainingMonths: n - i,
        initialBalance: origInitialBalance,
        juros: origJuros,
        amortization: origAmort,
        pmt: origPmt,
        finalBalance: originalBalance,
      });

      // --- AMORTIZED CALCULATION ---
      let amInitialBalance = amortizedBalance;
      let amJuros = 0;
      let amAmort = 0;
      let amPmtBase = 0;
      let amPmt = 0;
      let amFinalBalance = amortizedBalance;
      
      const extraManual = extraAmortizations.value[i] || 0;
      const extraFgts = fgtsAmortizations.value[i] || 0;

      if (!isPaidOff && amInitialBalance > 0) {
        amJuros = amInitialBalance * r;
        const amMip = amInitialBalance * mipRate;
        const amTotalFees = taxaAdm.value + seguroDfi.value + amMip;

        // Base amortization
        if (system.value === 'SAC') {
          amAmort = pv.value / n;
          if (amAmort > amInitialBalance) amAmort = amInitialBalance;
          amPmtBase = amAmort + amJuros;
        } else {
          // Price recalculates PMT based on REMAINING term? No, in Brazil standard is maintaining PMT and reducing term!
          // So we use the ORIGINAL PMT base, and just subtract it from balance.
          const pmtPrice = r > 0 ? (pv.value * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : pv.value / n;
          amPmtBase = pmtPrice;
          amAmort = amPmtBase - amJuros;
          if (amAmort > amInitialBalance) {
            amAmort = amInitialBalance;
            amPmtBase = amAmort + amJuros;
          }
        }

        amPmt = amPmtBase + amTotalFees;
        
        let totalAmortizationForMonth = amAmort + extraManual + extraFgts;
        
        if (totalAmortizationForMonth > amInitialBalance) {
          // If we overpay, cap the extra amortization
          const over = totalAmortizationForMonth - amInitialBalance;
          // In real life it would just settle the contract. We cap it to zero balance.
          totalAmortizationForMonth = amInitialBalance;
          isPaidOff = true;
          amortizedTerm = i;
        }

        amFinalBalance = amInitialBalance - totalAmortizationForMonth;
        if (amFinalBalance < 0.01) {
          amFinalBalance = 0;
          if (!isPaidOff) {
            isPaidOff = true;
            amortizedTerm = i;
          }
        }

        amortizedTotalJuros += amJuros;
        amortizedTotalFeesAcum += amTotalFees;
        totalManual += extraManual;
        totalFgts += extraFgts;
      }

      amortizedBalance = amFinalBalance;

      amortizedTable.push({
        month: i,
        remainingMonths: n - i,
        initialBalance: amInitialBalance,
        juros: amJuros,
        amortization: amAmort, // Just the contract amortization
        extraManual: extraManual,
        extraFgts: extraFgts,
        pmt: amPmt,
        finalBalance: amFinalBalance,
      });
    }

    return { 
      originalTable, 
      amortizedTable, 
      originalTotalJuros, 
      originalTotalFeesAcum,
      amortizedTotalJuros,
      amortizedTotalFeesAcum,
      totalManual,
      totalFgts,
      amortizedTerm
    };
  });

  const originalTotalPagar = computed(() => pv.value + schedule.value.originalTotalJuros);
  const amortizedTotalPagar = computed(() => pv.value + schedule.value.amortizedTotalJuros);
  
  const economiaJuros = computed(() => schedule.value.originalTotalJuros - schedule.value.amortizedTotalJuros);
  const economiaTotal = computed(() => originalTotalPagar.value - amortizedTotalPagar.value);

  const totalAmortizadoManual = computed(() => schedule.value.totalManual);
  const totalAmortizadoFgts = computed(() => schedule.value.totalFgts);
  const totalAmortizado = computed(() => totalAmortizadoManual.value + totalAmortizadoFgts.value);
  const prazoAtual = computed(() => schedule.value.amortizedTerm);

  return {
    pv,
    rateAa,
    months,
    system,
    taxaAdm,
    seguroDfi,
    seguroMip,
    extraAmortizations,
    fgtsAmortizations,
    rateMonth,
    rateMonthDisplay,
    schedule,
    originalTotalPagar,
    amortizedTotalPagar,
    economiaJuros,
    economiaTotal,
    totalAmortizadoManual,
    totalAmortizadoFgts,
    totalAmortizado,
    prazoAtual
  };
}
