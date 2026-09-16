<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" v-if="isOpen">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div :class="['p-1.5 rounded-md', isFgts ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600']">
            <component :is="isFgts ? Wallet : ArrowRightLeft" class="w-5 h-5" />
          </div>
          <h2 class="font-bold text-gray-800 text-lg">
            {{ isFgts ? 'Configurar Amortização com FGTS' : 'Configurar Aportes Manuais' }}
          </h2>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 flex-1 overflow-y-auto">
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          Defina o valor e a periodicidade dos aportes. O sistema preenche automaticamente as parcelas correspondentes e recalcula o saldo devedor.
        </p>

        <div class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Valor por Aporte</label>
            <money3 
              :model-value="amount"
              @update:model-value="amount = Number($event)"
              v-bind="moneyConfig"
              :class="['w-full px-3 py-2 border rounded-md text-gray-800 font-medium focus:outline-none focus:ring-2', isFgts ? 'border-emerald-300 focus:ring-emerald-500' : 'border-orange-300 focus:ring-orange-500']"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">A Cada Quantos Meses</label>
              <input 
                type="number" 
                v-model.number="everyMonths"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <p class="text-xs text-gray-400 mt-1" v-if="isFgts">24 meses = a cada 2 anos</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primeiro Aporte (Mês)</label>
              <input 
                type="number" 
                v-model.number="firstMonth"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
          
          <div :class="['p-4 rounded-md mt-6', isFgts ? 'bg-emerald-50 border border-emerald-100' : 'bg-orange-50 border border-orange-100']" v-if="previewCount > 0">
            <div class="font-medium text-sm mb-1 text-gray-800">
              <span :class="isFgts ? 'text-emerald-700' : 'text-orange-700 font-bold'">{{ previewCount }}</span> aportes de <span :class="isFgts ? 'text-emerald-700 font-bold' : 'text-orange-700 font-bold'">R$ {{ amount.toLocaleString('pt-BR') }}</span> &mdash; total <span :class="isFgts ? 'text-emerald-700 font-bold' : 'text-orange-700 font-bold'">R$ {{ (previewCount * amount).toLocaleString('pt-BR') }}</span>
            </div>
            <div class="text-xs text-gray-500">
              Meses: {{ previewMonths.join(', ') }} {{ previewCount > 10 ? '... (+' + (previewCount - 10) + ')' : '' }}
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
        <button @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancelar</button>
        <button @click="apply" :class="['px-6 py-2 text-sm font-medium text-white rounded-md shadow-sm', isFgts ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-600 hover:bg-orange-700']">
          Aplicar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { X, ArrowRightLeft, Wallet } from '@lucide/vue';
import { Money3Component as money3 } from 'v-money3';

const moneyConfig = {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  precision: 2,
  masked: false
};

const props = defineProps({
  isOpen: Boolean,
  isFgts: Boolean,
  totalMonths: Number,
  existingData: Object
});

const emit = defineEmits(['close', 'apply']);

const amount = ref(0);
const everyMonths = ref(1);
const firstMonth = ref(1);

// Initialize when opened
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.isFgts) {
      amount.value = 16000;
      everyMonths.value = 24;
      firstMonth.value = 24;
    } else {
      amount.value = 1000;
      everyMonths.value = 1;
      firstMonth.value = 1;
    }
  }
});

const generatedMonths = computed(() => {
  if (!amount.value || amount.value <= 0 || everyMonths.value < 1 || firstMonth.value < 1) return [];
  const months = [];
  for (let m = firstMonth.value; m <= props.totalMonths; m += everyMonths.value) {
    months.push(m);
  }
  return months;
});

const previewCount = computed(() => generatedMonths.value.length);
const previewMonths = computed(() => generatedMonths.value.slice(0, 10));

const apply = () => {
  const result = { ...props.existingData }; // Keep edits that don't overlap? The user wants to "reapply" over everything or merge? The image says "O sistema preenche automaticamente...". We'll just overwrite the targeted months.
  for (const m of generatedMonths.value) {
    result[m] = amount.value;
  }
  emit('apply', result);
  emit('close');
};
</script>
