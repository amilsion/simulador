<template>
  <div class="flex flex-col gap-6 p-6 min-h-screen bg-[#f8f9fa]">
    
    <header class="flex flex-col gap-2 mb-2">
      <p class="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
        Análise Completa de clientes habitacional
      </p>
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Seja Bem-vindo.</h1>
    </header>

    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6">
      
      <!-- Card Header -->
      <div class="flex items-start gap-3">
        <div class="p-3 bg-rose-50 text-rose-500 rounded-xl shrink-0">
          <Video class="w-6 h-6" />
        </div>
        <div class="flex flex-col">
          <h2 class="text-[17px] font-bold text-gray-900 leading-tight">Boas-vindas</h2>
          <p class="text-[14px] text-gray-500">Comece por aqui</p>
        </div>
      </div>

      <!-- Video Placeholder -->
      <div class="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden bg-gray-900 aspect-video group cursor-pointer shadow-lg border border-gray-200">
        <!-- Pseudo thumbnail gradient to look like an interface -->
        <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center opacity-30">
          <div class="w-3/4 h-12 bg-white rounded-md mb-4 blur-[2px]"></div>
          <div class="w-3/4 h-64 bg-white rounded-md blur-[2px]"></div>
        </div>
        
        <!-- Play Button Overlay -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-20 h-16 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-rose-600 transition-colors duration-300 shadow-xl">
            <Play class="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { Video, Play } from '@lucide/vue';
</script>
