<template>
  <div class="bg-white flex flex-col h-full border-r border-gray-200">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Parâmetros do Financiamento</h2>
    </div>
    
    <div class="grid grid-cols-2">
      <!-- Valor Financiado Input -->
      <div class="p-4 border-b border-r border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
            <Wallet class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-gray-500 uppercase">Valor Financiado</span>
        </div>
        <money3 
          :model-value="pv"
          @update:model-value="$emit('update:pv', Number($event))"
          v-bind="moneyConfig"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Taxa de Juros Input -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 bg-purple-100 text-purple-600 rounded-md">
            <Percent class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-gray-500 uppercase">Taxa de Juros (A.A.)</span>
        </div>
        <div class="relative">
          <input 
            type="number" 
            :value="rateAa"
            @input="$emit('update:rateAa', Number($event.target.value))"
            class="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">%</span>
        </div>
      </div>

      <!-- Prazo Input -->
      <div class="p-4 border-b border-r border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 bg-blue-100 text-blue-600 rounded-md">
            <Calendar class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-gray-500 uppercase">Prazo (Meses)</span>
        </div>
        <input 
          type="number" 
          :value="months"
          @input="$emit('update:months', Number($event.target.value))"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
        />
        <div class="text-xs text-gray-400">= {{ (months / 12).toFixed(0) }} anos</div>
      </div>

      <!-- Prazo & Sistema Readonly -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 bg-purple-100 text-purple-600 rounded-md">
            <Clock class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-gray-500 uppercase">Prazo & Sistema</span>
        </div>
        <div class="font-bold text-lg text-gray-800">{{ months }} m</div>
        <div class="text-xs text-gray-500 mt-1 uppercase">{{ system }} · CET {{ rateAa.toFixed(2).replace('.', ',') }}% a.a.</div>
      </div>

      <!-- Juros do Contrato Readonly -->
      <div class="p-4 border-b border-r border-gray-200">
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 bg-blue-100 text-blue-600 rounded-md">
            <Percent class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-gray-500 uppercase">Juros do Contrato</span>
        </div>
        <div class="font-bold text-lg text-gray-800">
          {{ formatCurrency(totalJuros) }}
        </div>
      </div>

      <!-- Total a Pagar Readonly -->
      <div class="p-4 border-b border-gray-200 bg-amber-50">
        <div class="flex items-center gap-2 mb-2">
          <div class="p-1.5 bg-amber-100 text-amber-600 rounded-md">
            <Banknote class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-gray-700 uppercase">Total a Pagar (Original)</span>
        </div>
        <div class="font-bold text-xl text-gray-900">
          {{ formatCurrency(totalPagar) }}
        </div>
      </div>
    </div>

    <!-- Impacto das Amortizações -->
    <div v-if="totalAmortizado > 0" class="flex-1 flex flex-col min-h-[250px] bg-slate-50 border-t-2 border-emerald-500">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <h2 class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Impacto das Amortizações</h2>
        </div>
      </div>
      
      <div class="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
        <div class="flex justify-between items-center border-b border-gray-200 pb-3">
          <div class="flex items-center gap-2 text-gray-600">
            <Wallet class="w-4 h-4 text-purple-500" />
            <span class="text-xs font-bold uppercase">Total Amortizado</span>
          </div>
          <div class="text-right">
            <div class="font-bold text-lg">{{ formatCurrency(totalAmortizado) }}</div>
            <div class="text-xs text-gray-500">Manual: {{ formatCurrency(totalAmortizadoManual) }} · FGTS: {{ formatCurrency(totalAmortizadoFgts) }}</div>
          </div>
        </div>
        
        <div class="flex justify-between items-center border-b border-gray-200 pb-3">
          <div class="flex items-center gap-2 text-emerald-700">
            <TrendingDown class="w-4 h-4" />
            <span class="text-xs font-bold uppercase">Economia em Juros</span>
          </div>
          <div class="text-right">
            <div class="font-bold text-lg text-emerald-600">{{ formatCurrency(economiaJuros) }}</div>
          </div>
        </div>

        <div class="flex justify-between items-center border-b border-gray-200 pb-3">
          <div class="flex items-center gap-2 text-purple-700">
            <Clock class="w-4 h-4" />
            <span class="text-xs font-bold uppercase">Prazo Atual</span>
          </div>
          <div class="text-right">
            <div class="font-bold text-lg text-purple-800">{{ prazoAtual }} m</div>
            <div class="text-xs text-purple-600/70">Quitado em {{ formatYearsMonths(prazoAtual) }}</div>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2 text-emerald-700">
            <Banknote class="w-4 h-4" />
            <span class="text-xs font-bold uppercase">Economia Total Paga</span>
          </div>
          <div class="text-right">
            <div class="font-bold text-lg text-emerald-600">{{ formatCurrency(economiaTotal) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Wallet, 
  Percent, 
  Calendar, 
  LineChart, 
  Clock, 
  DollarSign,
  Banknote,
  ShieldCheck,
  HeartPulse,
  TrendingDown
} from '@lucide/vue';
import { Money3Component as money3 } from 'v-money3';

const moneyConfig = {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  precision: 2,
  masked: false
};

const props = defineProps({
  pv: Number,
  rateAa: Number,
  months: Number,
  taxaAdm: Number,
  seguroDfi: Number,
  seguroMip: Number,
  system: String,
  rateMonthDisplay: String,
  totalJuros: Number,
  totalPagar: Number,
  totalAmortizadoManual: Number,
  totalAmortizadoFgts: Number,
  totalAmortizado: Number,
  economiaJuros: Number,
  economiaTotal: Number,
  prazoAtual: Number
});

defineEmits(['update:pv', 'update:rateAa', 'update:months', 'update:taxaAdm', 'update:seguroDfi', 'update:seguroMip']);

const formatCurrency = (val) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatYearsMonths = (totalMonths) => {
  if (!totalMonths) return '';
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) {
    return `${months} mês${months > 1 ? 'es' : ''}`;
  }
  
  let result = `${years} ano${years > 1 ? 's' : ''}`;
  if (months > 0) {
    result += ` e ${months} mês${months > 1 ? 'es' : ''}`;
  }
  return result;
};
</script>
