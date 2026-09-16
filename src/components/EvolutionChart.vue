<template>
  <div class="bg-white flex flex-col h-full">
    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <BarChart2 class="w-5 h-5 text-gray-500" />
        <h2 class="text-sm font-bold text-gray-800">Evolução do Saldo Devedor</h2>
      </div>
      <ChevronUp class="w-5 h-5 text-gray-400" />
    </div>
    
    <div class="p-6 flex-1 relative min-h-[300px]">
      <Line ref="chartRef" :data="chartData" :options="chartOptions" v-if="chartData.labels.length > 0" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { BarChart2, ChevronUp } from '@lucide/vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

const props = defineProps({
  originalTable: {
    type: Array,
    required: true
  },
  amortizedTable: {
    type: Array,
    required: true
  }
});

const chartData = computed(() => {
  const labels = props.originalTable.map(item => item.month);
  const dataOriginal = props.originalTable.map(item => item.finalBalance);
  const dataAmortized = props.amortizedTable.map(item => item.finalBalance);

  if (props.originalTable.length > 0) {
    labels.unshift(0);
    dataOriginal.unshift(props.originalTable[0].initialBalance);
    dataAmortized.unshift(props.amortizedTable[0].initialBalance);
  }

  return {
    labels,
    datasets: [
      {
        label: 'Saldo Contrato',
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        data: dataOriginal,
        tension: 0.4
      },
      {
        label: 'Saldo com Amortização',
        borderColor: '#10b981',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: false,
        data: dataAmortized,
        tension: 0.4
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'center',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      callbacks: {
        title: (context) => `Mês ${context[0].label}`,
        label: (context) => {
          return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.raw);
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxTicksLimit: 20
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6',
        drawBorder: false
      },
      ticks: {
        callback: (value) => {
          if (value >= 1000) {
            return (value / 1000) + 'k';
          }
          return value;
        }
      }
    }
  }
};

const chartRef = ref(null);

defineExpose({
  getBase64Image: () => {
    if (chartRef.value && chartRef.value.chart) {
      return chartRef.value.chart.toBase64Image();
    }
    return null;
  }
});
</script>
