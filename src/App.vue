<template>
  <div class="min-h-screen bg-gray-100 flex font-sans text-gray-900">
    <!-- Mobile overlay -->
    <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm"></div>
    
    <!-- Sidebar -->
    <div :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <Sidebar @navigate="isSidebarOpen = false" />
    </div>

    <!-- Main Content -->
    <div class="flex-1 lg:ml-64 min-w-0 flex flex-col min-h-screen">
      <!-- Mobile Header for Hamburger -->
      <header class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button @click="isSidebarOpen = true" class="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu class="w-6 h-6" />
        </button>
        <div class="font-bold text-gray-800 text-lg">Simulador</div>
      </header>
      
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Menu } from '@lucide/vue';
import Sidebar from './components/Sidebar.vue';

const isSidebarOpen = ref(false);
</script>
