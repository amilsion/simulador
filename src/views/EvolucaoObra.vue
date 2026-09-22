<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-gray-50/50">
    <header class="flex items-start gap-4 mb-2">
      <div class="p-2.5 bg-orange-100 text-orange-500 rounded-xl shrink-0 mt-1">
        <Building class="w-7 h-7" />
      </div>
      <div class="flex flex-col">
        <h1 class="text-[22px] font-bold text-gray-900 leading-tight">Simulador de Evolução de Obra</h1>
        <p class="text-gray-600 text-[15px] mt-1">Taxa de Evolução de Obra (TEO) durante a construção</p>
        <p class="text-gray-400 text-[13px] italic mt-1">
          (essa tabela é uma projeção como se a obra fosse linear, não considera variações da TR e não considera se houve pagamento antecipado para o terreno)
        </p>
      </div>
    </header>

    <!-- Blue Info Banner -->
    <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-[14px] text-blue-900/90 leading-relaxed">
      <Info class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
      <p>
        <strong class="font-semibold text-blue-700">O que é a TEO?</strong> Durante a construção do imóvel, o banco libera o crédito gradualmente conforme o avanço da obra. Você paga apenas os juros sobre o valor já liberado — isso é a Taxa de Evolução de Obra (TEO). Ao término, começa a amortização normal.
      </p>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left Column: Form -->
      <div class="w-full lg:w-[420px] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 h-fit">
        <h2 class="text-lg font-bold text-gray-900">Dados da Obra</h2>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Valor Financiado <span class="text-gray-400">*</span></label>
            <money3 v-model.number="form.valorFinanciado" v-bind="moneyConfig" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[15px]" />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Taxa de Juros (a.a.)</label>
            <select v-model.number="form.taxaJuros" class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[15px] text-gray-700 cursor-pointer">
              <option :value="8.5">8,50% — FGTS Padrão</option>
              <option :value="9.0">9,00% — SBPE</option>
              <option :value="9.5">9,50% — SBPE</option>
              <option :value="10.0">10,00% — SBPE</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-bold text-gray-800">Prazo de Obra (meses)</label>
            <select v-model.number="form.prazoObra" class="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[15px] text-gray-700 cursor-pointer">
              <option :value="12">12 meses</option>
              <option :value="18">18 meses</option>
              <option :value="24">24 meses</option>
              <option :value="30">30 meses</option>
              <option :value="36">36 meses</option>
            </select>
          </div>

          <!-- Advanced Toggle -->
          <button @click="showAdvanced = !showAdvanced" class="text-sm text-blue-600 hover:text-blue-700 font-medium text-left flex items-center gap-1 mt-1 transition-colors w-fit">
            <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showAdvanced }" />
            {{ showAdvanced ? 'Ocultar opções avançadas' : 'Mostrar opções avançadas' }}
          </button>

          <!-- Advanced Fields -->
          <div v-show="showAdvanced" class="flex flex-col gap-4 pt-3 border-t border-gray-100">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-gray-700">Valor já liberado</label>
              <money3 v-model.number="form.valorJaLiberado" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-gray-700">Seguros e Taxas Mensais</label>
              <money3 v-model.number="form.segurosTaxas" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-semibold text-gray-700">Parcela (Pós-Obra)</label>
              <money3 v-model.number="form.parcelaPosObra" v-bind="moneyConfig" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px]" />
            </div>
          </div>

          <button @click="handleCalculate" class="mt-2 w-full bg-[#d69e2e] hover:bg-[#b7791f] text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm text-[15px]">
            Simular Evolução de Obra
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

          <!-- Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Juros Totais -->
            <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-blue-600 mb-2">
                <AlertCircle class="w-5 h-5" />
                <h3 class="font-bold text-lg">Total de Juros de Obra</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Estimativa no período todo</div>
              <div class="text-3xl font-black text-blue-600 mb-2">{{ formatCurrency(calc.totalJuros) }}</div>
              <p class="text-sm text-gray-600">Considerando uma evolução linear da obra nos {{ form.prazoObra }} meses.</p>
            </div>
            
            <!-- Pico da Parcela -->
            <div class="bg-orange-50/50 border border-orange-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-orange-600 mb-2">
                <TrendingUp class="w-5 h-5" />
                <h3 class="font-bold text-lg">Parcela Máxima</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Último mês de obra</div>
              <div class="text-3xl font-black text-orange-600 mb-2">{{ formatCurrency(calc.parcelaMaxima) }}</div>
              <p class="text-sm text-gray-600">Chegando no valor máximo antes da entrega das chaves.</p>
            </div>

            <!-- Parcela Financiamento (Pós-obra) -->
            <div class="bg-emerald-50/50 border border-emerald-100 rounded-xl p-6 shadow-sm flex flex-col justify-center">
              <div class="flex items-center gap-2 text-emerald-600 mb-2">
                <Building class="w-5 h-5" />
                <h3 class="font-bold text-lg">1ª Parcela Cheia</h3>
              </div>
              <div class="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Pós-Obra (Chaves Entregues)</div>
              <div class="text-3xl font-black text-emerald-600 mb-2">{{ formatCurrency(form.parcelaPosObra) }}</div>
              <p class="text-sm text-gray-600">A partir deste momento, inicia-se a amortização do saldo.</p>
            </div>
          </div>

          <!-- Chart Area -->
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 class="font-bold text-gray-800 mb-4">Crescimento da Parcela (Juros de Obra)</h3>
            <div class="h-72 w-full relative">
              <Line :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Table -->
          <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div class="px-4 py-3 border-b border-gray-200 bg-gray-50/50">
              <h3 class="font-bold text-gray-800">Planilha Estimada — Mês a Mês</h3>
            </div>
            <div class="overflow-x-auto max-h-96">
              <table class="w-full text-sm text-right">
                <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th class="px-4 py-3 text-center w-20">Mês</th>
                    <th class="px-4 py-3">Saldo Repassado</th>
                    <th class="px-4 py-3">Juros</th>
                    <th class="px-4 py-3">Seguros/Taxas</th>
                    <th class="px-4 py-3 text-blue-600 bg-blue-50/50 font-bold">Boleto (Encargo)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="(row, idx) in calc.table" :key="idx" :class="[row.isPosObra ? 'bg-emerald-50 hover:bg-emerald-100' : 'hover:bg-gray-50']">
                    <td class="px-4 py-2.5 text-center text-gray-500 font-medium" :class="{'text-emerald-700': row.isPosObra}">{{ row.mes }}</td>
                    <td class="px-4 py-2.5 text-gray-700">{{ row.saldoRepassado }}</td>
                    <td class="px-4 py-2.5 text-gray-600">{{ row.juros }}</td>
                    <td class="px-4 py-2.5 text-gray-600">{{ row.seguros }}</td>
                    <td class="px-4 py-2.5 font-bold" :class="row.isPosObra ? 'text-emerald-700 bg-emerald-100/50' : 'text-blue-700 bg-blue-50/20'">{{ row.encargo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </template>
        
        <template v-else>
          <div class="h-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center text-gray-400 p-12">
            <Building class="w-16 h-16 mb-4 text-gray-300" />
            <p class="text-sm font-medium">Preencha os dados e clique em <strong class="text-gray-500">Calcular Evolução</strong></p>
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
import { Building, Calculator, TrendingUp, AlertCircle, Download, ChevronDown, Info } from '@lucide/vue';
import { Line } from 'vue-chartjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const money3 = Money3Component;
const isCalculated = ref(false);
const showAdvanced = ref(false);
const showPdfModal = ref(false);
const clientName = ref('');

const form = reactive({
  valorFinanciado: 250000,
  valorJaLiberado: 0,
  prazoObra: 24,
  taxaJuros: 8.5,
  segurosTaxas: 0,
  parcelaPosObra: 0
});

const calc = computed(() => {
  const taxaMensal = (form.taxaJuros / 100) / 12;
  const valorJaLiberado = form.valorJaLiberado || 0;
  const valorRestante = Math.max(0, form.valorFinanciado - valorJaLiberado);
  const repasseMensal = form.prazoObra > 0 ? valorRestante / form.prazoObra : 0;
  const seguros = form.segurosTaxas || 0;
  
  let saldoRepassado = valorJaLiberado;
  let totalJuros = 0;
  const table = [];
  const labels = [];
  const parcelas = [];

  for (let mes = 1; mes <= form.prazoObra; mes++) {
    // Juros do mês é calculado sobre o saldo ANTES do repasse do mês atual
    const jurosDoMes = saldoRepassado * taxaMensal;
    const encargo = jurosDoMes + seguros;
    
    saldoRepassado += repasseMensal;
    // Previne imprecisões de float
    if (saldoRepassado > form.valorFinanciado) saldoRepassado = form.valorFinanciado;
    
    totalJuros += jurosDoMes;
    
    table.push({
      mes: mes.toString(),
      saldoRepassado: formatCurrency(saldoRepassado),
      juros: formatCurrency(jurosDoMes),
      seguros: formatCurrency(seguros),
      encargo: formatCurrency(encargo),
      isPosObra: false
    });

    labels.push(`Mês ${mes}`);
    parcelas.push(encargo);
  }

  // Adicionar mês pós-obra
  if (form.parcelaPosObra) {
    table.push({
      mes: `${form.prazoObra + 1} (Chaves)`,
      saldoRepassado: '—',
      juros: '—',
      seguros: '—',
      encargo: formatCurrency(form.parcelaPosObra),
      isPosObra: true
    });
    
    labels.push('Pós-Obra');
    parcelas.push(form.parcelaPosObra);
  }

  return {
    totalJuros,
    parcelaMaxima: table.length && form.prazoObra > 0 ? parcelas[form.prazoObra - 1] : 0,
    table,
    labels,
    parcelas
  };
});

const chartData = computed(() => {
  if (!isCalculated.value) return null;
  return {
    labels: calc.value.labels,
    datasets: [
      {
        label: 'Evolução da Parcela (R$)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        data: calc.value.parcelas,
        fill: true,
        tension: 0.1
      }
    ]
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function(context) {
          return formatCurrency(context.parsed.y);
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return 'R$ ' + value;
        }
      }
    }
  }
};

const handleCalculate = () => {
  if (!form.valorFinanciado || !form.prazoObra || !form.taxaJuros) {
    alert("Preencha todos os campos.");
    return;
  }
  isCalculated.value = true;
};

const gerarPdf = () => {
  if (!isCalculated.value) return;

  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text('Relatório: Evolução de Obra', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);

  if (clientName.value.trim()) {
    doc.text(`Cliente: ${clientName.value.trim()}`, 14, 30);
  }

  const startY = clientName.value.trim() ? 36 : 30;

  doc.text(`Valor Financiado: ${formatCurrency(form.valorFinanciado)}`, 14, startY);
  
  const yOffset = form.valorJaLiberado ? 6 : 0;
  if (form.valorJaLiberado) {
    doc.text(`Valor Já Liberado (Início): ${formatCurrency(form.valorJaLiberado)}`, 14, startY + 6);
  }
  
  doc.text(`Prazo da Obra: ${form.prazoObra} meses`, 14, startY + 6 + yOffset);
  doc.text(`Taxa de Juros: ${form.taxaJuros}% a.a.`, 14, startY + 12 + yOffset);
  
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(`Total estimado de Juros: ${formatCurrency(calc.value.totalJuros)}`, 114, startY);
  doc.setTextColor(234, 88, 12); // orange-600
  doc.text(`Parcela máxima estimada: ${formatCurrency(calc.value.parcelaMaxima)}`, 114, startY + 6);

  // Table Data
  const tableData = calc.value.table.map(row => [
    row.mes.toString(),
    row.saldoRepassado,
    row.juros,
    row.seguros,
    row.encargo
  ]);

  autoTable(doc, {
    startY: startY + 20 + yOffset,
    head: [['Mês', 'Saldo Repassado', 'Juros', 'Seguros/Taxas', 'Boleto (Encargo)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [243, 244, 246], textColor: [75, 85, 99], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    willDrawCell: function(data) {
      if (data.row.index === tableData.length - 1 && form.parcelaPosObra && data.section === 'body') {
        doc.setFillColor(236, 253, 245); // emerald-50
      }
    },
    columnStyles: {
      0: { halign: 'center' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' }
    }
  });
  
  const fileName = clientName.value.trim() 
    ? `evolucao-obra-${clientName.value.trim().toLowerCase().replace(/\s+/g, '-')}.pdf`
    : 'evolucao-obra.pdf';

  doc.save(fileName);

  showPdfModal.value = false;
  clientName.value = '';
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
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}
</script>
