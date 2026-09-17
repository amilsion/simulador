<template>
  <div class="bg-white border-t border-gray-200">
    <div class="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div class="flex items-center gap-2 shrink-0">
          <TableIcon class="w-5 h-5 text-gray-500" />
          <h2 class="font-bold text-gray-800 whitespace-nowrap">Tabela de Parcelas</h2>
        </div>
        <span class="text-xs text-gray-500 leading-tight">Edite as colunas "Amort. Adicional" e "Amort. FGTS" pra simular aportes manuais. Valores manuais substituem o recorrente naquela parcela.</span>
      </div>
    </div>

    <div class="p-3 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-4 px-2">
        <span class="text-sm text-gray-600 font-medium">{{ totalItems }} parcelas</span>
        <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" v-model="isFixedHeader" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          Cabeçalho fixo
        </label>
      </div>
      <div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <button 
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
        >
          &larr; Anterior
        </button>
        <span class="text-sm text-gray-600 whitespace-nowrap">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="text-sm font-medium bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 whitespace-nowrap"
        >
          Próximo &rarr;
        </button>
      </div>
    </div>

    <!-- Hint for mobile horizontal scroll -->
    <div class="xl:hidden bg-blue-50/80 px-4 py-2 flex items-center justify-center gap-2 text-blue-600 text-xs font-medium border-b border-blue-100">
      <MoveHorizontal class="w-4 h-4 animate-swipe" />
      Deslize para o lado para ver mais colunas
    </div>

    <div :class="['w-full', isFixedHeader ? 'overflow-x-auto max-h-[70vh] xl:max-h-none xl:overflow-visible' : 'overflow-x-auto']">
      <table class="w-full text-xs text-right whitespace-nowrap">
        <thead :class="isFixedHeader ? 'sticky top-0 z-10 shadow-md' : ''">
          <tr>
            <th colspan="8" class="py-2 px-1.5 border-b border-r border-gray-200 bg-gray-50 text-center font-bold text-gray-600 uppercase tracking-wider">
              Valores do Contrato
            </th>
            <th class="py-2 px-1.5 border-b border-r border-gray-200 bg-orange-50 text-center font-bold text-orange-600 uppercase tracking-wider w-20">
              Amort.<br/>Adicional
            </th>
            <th class="py-2 px-1.5 border-b border-r border-gray-200 bg-emerald-50 text-center font-bold text-emerald-600 uppercase tracking-wider w-20">
              Amort.<br/>FGTS
            </th>
            <th colspan="6" class="py-2 px-1.5 border-b border-gray-200 bg-gray-50 text-center font-bold text-gray-600 uppercase tracking-wider">
              Valores Corrigidos com Amortização
            </th>
          </tr>
          <tr class="bg-gray-50 text-gray-500 shadow-sm">
            <th class="py-2 px-1.5 border-b border-r border-gray-200 font-medium bg-gray-50">Parcela</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Faltam</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Sd. Dev. Inicial</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Juros</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Saldo Atual</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Amortização</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Parcela</th>
            <th class="py-2 px-1.5 border-b border-r border-gray-200 font-medium bg-gray-50">Sd. Dev. Atual</th>
            <th class="py-2 px-1.5 border-b border-r border-gray-200 bg-orange-50 font-medium">Valor</th>
            <th class="py-2 px-1.5 border-b border-r border-gray-200 bg-emerald-50 font-medium">Valor</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Sd. Dev. Inicial</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Juros</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Saldo Atual</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Amortização</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Parcela</th>
            <th class="py-2 px-1.5 border-b border-gray-200 font-medium bg-gray-50">Sd. Dev. Atual</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="idx in itemsPerPage" :key="startIdx + idx" class="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
            <template v-if="(startIdx + idx - 1) < totalItems">
              <!-- Render row -->
              <td :class="['py-1 px-1.5 border-r border-gray-100 text-left', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : '']">{{ startIdx + idx }}</td>
              <td :class="['py-1 px-1.5', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : '']">{{ originalTable[startIdx + idx - 1].remainingMonths }}</td>
              <td :class="['py-1 px-1.5 font-medium', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : 'text-gray-500']">{{ formatCurrency(originalTable[startIdx + idx - 1].initialBalance) }}</td>
              <td :class="['py-1 px-1.5', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : 'text-gray-500']">{{ formatCurrency(originalTable[startIdx + idx - 1].juros) }}</td>
              <td :class="['py-1 px-1.5 font-medium', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : 'text-gray-500']">{{ formatCurrency(originalTable[startIdx + idx - 1].initialBalance + originalTable[startIdx + idx - 1].juros) }}</td>
              <td :class="['py-1 px-1.5', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : 'text-gray-500']">{{ formatCurrency(originalTable[startIdx + idx - 1].amortization) }}</td>
              <td :class="['py-1 px-1.5 font-bold', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : 'text-gray-500']">{{ formatCurrency(originalTable[startIdx + idx - 1].pmt) }}</td>
              <td :class="['py-1 px-1.5 border-r border-gray-100 font-medium', (amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0) ? 'text-gray-300 line-through' : 'text-gray-500']">{{ formatCurrency(originalTable[startIdx + idx - 1].finalBalance) }}</td>
              
              <!-- Inputs -->
              <td class="p-1 border-r border-gray-100 bg-orange-50/30">
                <money3 
                  :model-value="extraAmortizations[startIdx + idx] || 0"
                  @update:model-value="onInputExtra(startIdx + idx, $event)"
                  v-bind="moneyConfig"
                  :disabled="amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0"
                  class="w-20 px-1 py-1 text-right text-orange-700 bg-transparent border border-transparent focus:bg-white focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-sm disabled:opacity-30"
                />
              </td>
              <td class="p-1 border-r border-gray-100 bg-emerald-50/30">
                <money3 
                  :model-value="fgtsAmortizations[startIdx + idx] || 0"
                  @update:model-value="onInputFgts(startIdx + idx, $event)"
                  v-bind="moneyConfig"
                  :disabled="amortizedTable[startIdx + idx - 1].initialBalance === 0 && amortizedTable[startIdx + idx - 1].pmt === 0"
                  class="w-20 px-1 py-1 text-right text-emerald-700 bg-transparent border border-transparent focus:bg-white focus:border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-sm disabled:opacity-30"
                />
              </td>
              
              <!-- Amortized Side -->
              <template v-if="amortizedTable[startIdx + idx - 1].initialBalance > 0 || amortizedTable[startIdx + idx - 1].pmt > 0">
                <td class="py-1 px-1.5 font-medium">{{ formatCurrency(amortizedTable[startIdx + idx - 1].initialBalance) }}</td>
                <td class="py-1 px-1.5">{{ formatCurrency(amortizedTable[startIdx + idx - 1].juros) }}</td>
                <td class="py-1 px-1.5 font-medium">{{ formatCurrency(amortizedTable[startIdx + idx - 1].initialBalance + amortizedTable[startIdx + idx - 1].juros) }}</td>
                <td class="py-1 px-1.5">{{ formatCurrency(amortizedTable[startIdx + idx - 1].amortization) }}</td>
                <td class="py-1 px-1.5 font-bold">{{ formatCurrency(amortizedTable[startIdx + idx - 1].pmt) }}</td>
                <td class="py-1 px-1.5 font-medium">{{ formatCurrency(amortizedTable[startIdx + idx - 1].finalBalance) }}</td>
              </template>
              <template v-else>
                <td class="py-1 px-1.5 text-gray-300" colspan="6"></td>
              </template>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Table as TableIcon, MoveHorizontal } from '@lucide/vue';
import { Money3Component as money3 } from 'v-money3';

const moneyConfig = {
  decimal: ',',
  thousands: '.',
  prefix: '',
  precision: 2,
  masked: false
};

const props = defineProps({
  originalTable: {
    type: Array,
    required: true
  },
  amortizedTable: {
    type: Array,
    required: true
  },
  extraAmortizations: {
    type: Object,
    required: true
  },
  fgtsAmortizations: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:extraAmortizations', 'update:fgtsAmortizations']);

const itemsPerPage = 60;
const currentPage = ref(1);
const isFixedHeader = ref(true);

const totalItems = computed(() => props.originalTable.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage) || 1);

const startIdx = computed(() => (currentPage.value - 1) * itemsPerPage);

const onInputExtra = (month, value) => {
  const num = parseFloat(value);
  const newObj = { ...props.extraAmortizations };
  if (isNaN(num) || num <= 0) {
    delete newObj[month];
  } else {
    newObj[month] = num;
  }
  emit('update:extraAmortizations', newObj);
};

const onInputFgts = (month, value) => {
  const num = parseFloat(value);
  const newObj = { ...props.fgtsAmortizations };
  if (isNaN(num) || num <= 0) {
    delete newObj[month];
  } else {
    newObj[month] = num;
  }
  emit('update:fgtsAmortizations', newObj);
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
};
</script>

<style scoped>
@keyframes swipe-x {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}
.animate-swipe {
  animation: swipe-x 1.5s ease-in-out infinite;
}
</style>
