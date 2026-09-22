<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
    <header class="flex flex-col gap-1">
      <div class="flex items-center gap-2 text-sm font-semibold tracking-wider text-amber-600 uppercase">
        <div class="w-1 h-4 bg-amber-500 rounded-full"></div>
        Simuladores
      </div>
      <h1 class="text-3xl font-bold text-gray-900">P.P.P.</h1>
      <p class="text-gray-600">
        <strong class="font-semibold text-gray-800">Pagamento Parcial da Parcela</strong> — o cliente usa o FGTS de cada ano para adiantar parte das parcelas; assim os boletos mensais do período ficam bem menores.
      </p>
    </header>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Column: Form -->
      <div class="w-full lg:w-[400px] shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-6 h-fit">
        <h2 class="text-lg font-bold text-gray-800">Dados do financiamento</h2>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700">Valor do financiamento <span class="text-amber-500">*</span></label>
            <money3 v-model.number="form.pv" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-sm font-semibold text-gray-700">Sistema</label>
              <select v-model="form.system" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option value="SAC">SAC</option>
                <option value="PRICE">PRICE</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5 flex-1">
              <label class="text-sm font-semibold text-gray-700">Prazo (meses)</label>
              <select v-model.number="form.months" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option v-for="n in [120, 180, 240, 300, 360, 420]" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-semibold text-gray-700">Valor da 1ª parcela <span class="text-amber-500">*</span></label>
            <money3 v-model.number="form.primeiraParcela" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <p class="text-xs text-gray-500">A partir dela o sistema encontra a taxa de juros (com prova real).</p>
          </div>

          <div class="flex flex-col gap-1.5 mt-2">
            <label class="text-sm font-semibold text-gray-700">Renda do cliente <span class="text-amber-500">*</span></label>
            <money3 v-model.number="form.renda" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <p class="text-xs text-gray-500">Base do FGTS dos anos seguintes (8% × 13).</p>
          </div>

          <div class="flex flex-col gap-1.5 mt-2">
            <label class="text-sm font-semibold text-gray-700">FGTS para o 1º ano</label>
            <money3 v-model.number="form.fgtsAno1" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div class="flex flex-col gap-1.5 mt-2">
            <label class="text-sm font-semibold text-gray-700">Programar por quantos anos</label>
            <select v-model.number="form.anosProgramados" class="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
              <option v-for="n in 35" :key="n" :value="n">{{ n }} ano{{ n > 1 ? 's' : '' }}</option>
            </select>
          </div>

          <button @click="handleCalculate" class="mt-4 w-full bg-[#dca829] hover:bg-[#c99a24] text-white font-bold py-3 rounded-md transition-colors shadow-sm">
            Calcular P.P.P.
          </button>
        </div>
      </div>

      <!-- Right Column: Results & Table -->
      <div class="flex-1 flex flex-col gap-6">
        <template v-if="isCalculated">
          <div class="flex justify-end">
            <button @click="showPdfModal = true" class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors">
              <Download class="w-4 h-4" />
              Baixar relatório (PDF)
            </button>
          </div>

          <!-- Cards Row 1 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-center">
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Custo Efetivo Total (CET)</div>
              <div class="text-3xl font-bold text-gray-900 mb-1">{{ (calc.rateAa * 100).toFixed(4).replace('.', ',') }}% <span class="text-lg font-medium text-gray-500">a.a.</span></div>
              <div class="text-sm text-gray-500">{{ (calc.rateMonth * 100).toFixed(4).replace('.', ',') }}% ao mês - estimado pela 1ª parcela</div>
            </div>
            <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 shadow-sm flex flex-col justify-center relative overflow-hidden">
              <div class="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle class="w-3.5 h-3.5" /> PROVA REAL
              </div>
              <div class="text-sm font-medium text-gray-700 mb-1">
                1ª parcela recalculada: <span class="font-bold text-gray-900">{{ formatCurrency(calc.parcelaRecalculada) }}</span>
              </div>
              <div class="text-xs text-gray-600">
                informada: {{ formatCurrency(form.primeiraParcela) }} - confere, a taxa está correta
              </div>
            </div>
          </div>

          <!-- Cards Row 2 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 shadow-sm flex flex-col">
              <div class="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">Economia em boletos ({{ form.anosProgramados * 12 }} meses)</div>
              <div class="text-2xl font-bold text-emerald-600 mb-1">{{ formatCurrency(calc.economiaBoletos) }}</div>
              <div class="text-xs text-gray-500">total de FGTS adiantado</div>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Boleto médio no período</div>
              <div class="text-2xl font-bold text-gray-900 mb-1">{{ formatCurrency(calc.boletoMedio) }}</div>
              <div class="text-xs text-gray-500">vs parcela média {{ formatCurrency(calc.parcelaMedia) }}</div>
            </div>
            <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">FGTS estimado/ano (anos 2+)</div>
              <div class="text-2xl font-bold text-gray-900 mb-1">{{ formatCurrency(calc.fgtsAnosSeguintes) }}</div>
              <div class="text-xs text-gray-500">renda × 8% × 13</div>
            </div>
          </div>

          <!-- Table -->
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div class="px-4 py-3 border-b border-gray-200 bg-gray-50/50">
              <h3 class="font-bold text-gray-800">Planilha — parcela cheia × boleto com P.P.P.</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-right">
                <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-center w-20">Mês</th>
                    <th class="px-4 py-3">Parcela</th>
                    <th class="px-4 py-3">Juros</th>
                    <th class="px-4 py-3">Amortização</th>
                    <th class="px-4 py-3">Saldo devedor</th>
                    <th class="px-4 py-3 text-emerald-600 bg-emerald-50/30">FGTS aplicado</th>
                    <th class="px-4 py-3 font-bold text-gray-900 bg-gray-50">Boleto a pagar</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(row, idx) in calc.table.slice(0, form.anosProgramados * 12)" :key="idx" class="hover:bg-gray-50">
                    <td class="px-4 py-2.5 text-center text-gray-500">{{ row.month }} <span class="text-xs text-gray-400">- a{{ Math.ceil(row.month / 12) }}</span></td>
                    <td class="px-4 py-2.5 text-gray-700">{{ formatCurrency(row.parcela) }}</td>
                    <td class="px-4 py-2.5 text-gray-500">{{ formatCurrency(row.juros) }}</td>
                    <td class="px-4 py-2.5 text-gray-500">{{ formatCurrency(row.amortizacao) }}</td>
                    <td class="px-4 py-2.5 text-gray-500">{{ formatCurrency(row.saldoDevedor) }}</td>
                    <td class="px-4 py-2.5 text-emerald-600 bg-emerald-50/30">{{ row.fgtsAplicado > 0 ? '- ' + formatCurrency(row.fgtsAplicado) : '—' }}</td>
                    <td class="px-4 py-2.5 font-bold text-gray-900 bg-gray-50/50">{{ formatCurrency(row.boleto) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
        
        <template v-else>
          <div class="h-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center text-gray-400 p-12">
            <PiggyBank class="w-16 h-16 mb-4 text-gray-300" />
            <p class="text-sm font-medium">Preencha os dados e clique em <strong class="text-gray-500">Calcular P.P.P.</strong></p>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal Nome do Cliente -->
    <div v-if="showPdfModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Identificar Relatório</h3>
        <p class="text-sm text-gray-500 mb-4">Insira o nome do cliente para personalizar o PDF.</p>
        
        <input 
          v-model="clientName" 
          type="text" 
          placeholder="Nome do cliente" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none mb-6"
          @keyup.enter="gerarPdf"
          autofocus
        />

        <div class="flex items-center gap-3 justify-end">
          <button @click="showPdfModal = false" class="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            Cancelar
          </button>
          <button @click="gerarPdf" class="px-4 py-2 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2">
            <Download class="w-4 h-4" /> Baixar PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue';
import { Money3Component } from 'v-money3';
import { Download, CheckCircle, PiggyBank } from '@lucide/vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Use components
const money3 = Money3Component;

const isCalculated = ref(false);

const showPdfModal = ref(false);
const clientName = ref('');

const form = reactive({
  pv: null,
  system: 'SAC',
  months: 360,
  primeiraParcela: null,
  renda: null,
  fgtsAno1: null,
  anosProgramados: 4
});

const handleCalculate = () => {
  if (!form.pv || !form.primeiraParcela || !form.renda) {
    alert("Por favor, preencha os campos obrigatórios (*).");
    return;
  }
  isCalculated.value = true;
};

const moneyConfig = {
  masked: false,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  decimal: ',',
  precision: 2,
  disableNegative: true,
  disabled: false,
  min: null,
  max: null,
  allowBlank: true,
  minimumNumberOfCharacters: 0,
};

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Interest Rate Solver
function solveInterestRate(pv, months, firstParcel, system) {
  if (system === 'SAC') {
    const amort = pv / months;
    const interest = firstParcel - amort;
    return interest / pv;
  } else {
    let low = 0.00001;
    let high = 0.1;
    let mid = 0;
    for (let i = 0; i < 50; i++) {
      mid = (low + high) / 2;
      const pmt = pv * (mid * Math.pow(1 + mid, months)) / (Math.pow(1 + mid, months) - 1);
      if (pmt > firstParcel) {
        high = mid;
      } else {
        low = mid;
      }
    }
    return mid;
  }
}

const calc = computed(() => {
  if (!isCalculated.value) return {};

  const fgtsAnosSeguintes = form.renda * 0.08 * 13;
  
  let rateMonth = 0;
  if (form.primeiraParcela > (form.pv / form.months)) {
    rateMonth = solveInterestRate(form.pv, form.months, form.primeiraParcela, form.system);
  }
  
  const rateAa = Math.pow(1 + rateMonth, 12) - 1;

  let parcelaRecalculada = 0;
  if (form.system === 'SAC') {
    parcelaRecalculada = (form.pv / form.months) + (form.pv * rateMonth);
  } else {
    if (rateMonth > 0) {
      parcelaRecalculada = form.pv * (rateMonth * Math.pow(1 + rateMonth, form.months)) / (Math.pow(1 + rateMonth, form.months) - 1);
    } else {
      parcelaRecalculada = form.pv / form.months;
    }
  }

  // Generate Table
  const table = [];
  let balance = form.pv;
  let totalParcelasProg = 0;
  let totalBoletoProg = 0;
  const mesesProgramados = form.anosProgramados * 12;

  for (let month = 1; month <= form.months; month++) {
    let amortizacao = 0;
    let juros = balance * rateMonth;
    let parcela = 0;

    if (form.system === 'SAC') {
      amortizacao = form.pv / form.months;
      parcela = amortizacao + juros;
    } else {
      parcela = parcelaRecalculada;
      amortizacao = parcela - juros;
    }

    balance -= amortizacao;
    if (balance < 0.01) balance = 0;

    const anoIndex = Math.floor((month - 1) / 12);
    let fgtsAplicado = 0;
    
    if (anoIndex < form.anosProgramados) {
      if (anoIndex === 0) {
        fgtsAplicado = (form.fgtsAno1 || 0) / 12;
      } else {
        fgtsAplicado = fgtsAnosSeguintes / 12;
      }
    }
    
    // Caixa limits FGTS reduction to 80% of the parcel
    if (fgtsAplicado > parcela * 0.8) {
      fgtsAplicado = parcela * 0.8;
    }

    const boleto = parcela - fgtsAplicado;

    table.push({
      month,
      parcela,
      juros,
      amortizacao,
      saldoDevedor: balance,
      fgtsAplicado,
      boleto
    });

    if (month <= mesesProgramados) {
      totalParcelasProg += parcela;
      totalBoletoProg += boleto;
    }
  }

  const economiaBoletos = totalParcelasProg - totalBoletoProg;
  const boletoMedio = totalBoletoProg / Math.min(mesesProgramados, form.months);
  const parcelaMedia = totalParcelasProg / Math.min(mesesProgramados, form.months);

  return {
    fgtsAnosSeguintes,
    rateMonth,
    rateAa,
    parcelaRecalculada,
    economiaBoletos,
    boletoMedio,
    parcelaMedia,
    table
  };
});

const gerarPdf = () => {
  if (!isCalculated.value) return;

  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('Relatório de P.P.P. (Pagamento Parcial da Parcela)', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  if (clientName.value.trim()) {
    doc.text(`Cliente: ${clientName.value.trim()}`, 14, 30);
  }

  const startY = clientName.value.trim() ? 36 : 30;

  doc.text(`Valor do financiamento: ${formatCurrency(form.pv)}`, 14, startY);
  doc.text(`Sistema: ${form.system} | Prazo: ${form.months} meses`, 14, startY + 6);
  doc.text(`Taxa estimada: ${(calc.value.rateMonth * 100).toFixed(4)}% a.m. (${(calc.value.rateAa * 100).toFixed(4)}% a.a.)`, 14, startY + 12);
  
  doc.text(`Economia em boletos: ${formatCurrency(calc.value.economiaBoletos)}`, 114, startY);
  doc.text(`Boleto médio no período: ${formatCurrency(calc.value.boletoMedio)}`, 114, startY + 6);
  doc.text(`FGTS programado para: ${form.anosProgramados} anos`, 114, startY + 12);

  // Table Data
  const tableData = calc.value.table.slice(0, form.anosProgramados * 12).map(row => [
    row.month.toString(),
    formatCurrency(row.parcela),
    formatCurrency(row.juros),
    formatCurrency(row.amortizacao),
    formatCurrency(row.saldoDevedor),
    row.fgtsAplicado > 0 ? formatCurrency(row.fgtsAplicado) : '-',
    formatCurrency(row.boleto)
  ]);

  autoTable(doc, {
    startY: startY + 22,
    head: [['Mês', 'Parcela', 'Juros', 'Amortização', 'Saldo Devedor', 'FGTS Aplicado', 'Boleto a pagar']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [243, 244, 246], textColor: [75, 85, 99], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right', textColor: [5, 150, 105] }, // emerald-600
      6: { halign: 'right', fontStyle: 'bold' }
    }
  });
  
  const fileName = clientName.value.trim() 
    ? `relatorio-ppp-${clientName.value.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`
    : 'relatorio-ppp.pdf';

  doc.save(fileName);

  // Fechar modal
  showPdfModal.value = false;
  clientName.value = '';
};
</script>
