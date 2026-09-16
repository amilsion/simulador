<template>
  <div class="min-h-screen bg-gray-100 flex flex-col font-sans">
    <Header 
      v-model:system="system" 
      v-model:clientName="clientName"
      @open-manual="openManualModal" 
      @open-fgts="openFgtsModal" 
      @generate-pdf="handleGeneratePdf"
    />

    <main class="flex-1 max-w-[1400px] w-full mx-auto p-4 flex flex-col gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
        
        <div class="w-full lg:w-[450px] shrink-0 border-r border-gray-200">
          <FinancingParams 
            v-model:pv="pv"
            v-model:rateAa="rateAa"
            v-model:months="months"
            v-model:taxaAdm="taxaAdm"
            v-model:seguroDfi="seguroDfi"
            v-model:seguroMip="seguroMip"
            :system="system"
            :rateMonthDisplay="rateMonthDisplay"
            :totalJuros="schedule.originalTotalJuros"
            :totalPagar="originalTotalPagar"
            :totalAmortizadoManual="totalAmortizadoManual"
            :totalAmortizadoFgts="totalAmortizadoFgts"
            :totalAmortizado="totalAmortizado"
            :economiaJuros="economiaJuros"
            :economiaTotal="economiaTotal"
            :prazoAtual="prazoAtual"
          />
        </div>
        
        <div class="flex-1 min-w-0">
          <EvolutionChart 
            ref="evolutionChartRef"
            :originalTable="schedule.originalTable" 
            :amortizedTable="schedule.amortizedTable"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <AmortizationTable 
          :originalTable="schedule.originalTable" 
          :amortizedTable="schedule.amortizedTable"
          v-model:extraAmortizations="extraAmortizations"
          v-model:fgtsAmortizations="fgtsAmortizations"
        />
      </div>
    </main>

    <ConfigAmortizationModal 
      :isOpen="isModalOpen" 
      :isFgts="isModalFgts" 
      :totalMonths="months" 
      :existingData="isModalFgts ? fgtsAmortizations : extraAmortizations"
      @close="isModalOpen = false" 
      @apply="applyAmortizations" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAmortization } from './composables/useAmortization';
import Header from './components/Header.vue';
import FinancingParams from './components/FinancingParams.vue';
import EvolutionChart from './components/EvolutionChart.vue';
import AmortizationTable from './components/AmortizationTable.vue';
import ConfigAmortizationModal from './components/ConfigAmortizationModal.vue';
import { generatePdf } from './utils/pdfGenerator';

const {
  pv,
  rateAa,
  months,
  system,
  taxaAdm,
  seguroDfi,
  seguroMip,
  extraAmortizations,
  fgtsAmortizations,
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
} = useAmortization(250000, 8, 420, 'PRICE', 0, 0, 0);

const isModalOpen = ref(false);
const isModalFgts = ref(false);
const clientName = ref('');
const evolutionChartRef = ref(null);

const openManualModal = () => {
  isModalFgts.value = false;
  isModalOpen.value = true;
};

const openFgtsModal = () => {
  isModalFgts.value = true;
  isModalOpen.value = true;
};

const applyAmortizations = (data) => {
  if (isModalFgts.value) {
    fgtsAmortizations.value = data;
  } else {
    extraAmortizations.value = data;
  }
};

const handleGeneratePdf = () => {
  const chartImage = evolutionChartRef.value ? evolutionChartRef.value.getBase64Image() : null;
  
  const pdfData = {
    clientName: clientName.value,
    pv: pv.value,
    system: system.value,
    rateAa: rateAa.value,
    months: months.value,
    originalTotalPagar: originalTotalPagar.value,
    originalTotalJuros: schedule.value.originalTotalJuros,
    totalAmortizado: totalAmortizado.value,
    prazoAtual: prazoAtual.value,
    totalAmortizadoManual: totalAmortizadoManual.value,
    economiaJuros: economiaJuros.value,
    amortizedTotalPagar: amortizedTotalPagar.value,
    totalAmortizadoFgts: totalAmortizadoFgts.value,
    originalTable: schedule.value.originalTable,
    amortizedTable: schedule.value.amortizedTable
  };

  generatePdf(pdfData, chartImage);
};
</script>
