import { createRouter, createWebHistory } from 'vue-router'
import PlanilhaAmort from '../views/PlanilhaAmort.vue'
import PPP from '../views/PPP.vue'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: () => import('../views/Inicio.vue')
  },
  {
    path: '/planilha-amort',
    name: 'PlanilhaAmort',
    component: PlanilhaAmort
  },
  {
    path: '/ppp',
    name: 'PPP',
    component: PPP
  },
  {
    path: '/evolucao-obra',
    name: 'EvolucaoObra',
    component: () => import('../views/EvolucaoObra.vue')
  },
  {
    path: '/financ-aluguel',
    name: 'FinancAluguel',
    component: () => import('../views/FinancAluguel.vue')
  },
  {
    path: '/crm-rating',
    name: 'CRMRating',
    component: () => import('../views/CRMRating.vue')
  },
  {
    path: '/analisador-registrato',
    name: 'AnalisadorRegistrato',
    component: () => import('../views/AnalisadorRegistrato.vue')
  },
  {
    path: '/apuracao-renda',
    name: 'ApuracaoRenda',
    component: () => import('../views/ApuracaoRenda.vue')
  },
  {
    path: '/laudo-revisao',
    name: 'LaudoRevisao',
    component: () => import('../views/LaudoRevisao.vue')
  },
  {
    path: '/links-uteis',
    name: 'LinksUteis',
    component: () => import('../views/LinksUteis.vue')
  },
  {
    path: '/glossario',
    name: 'Glossario',
    component: () => import('../views/Glossario.vue')
  },
  {
    path: '/relatar-problemas',
    name: 'RelatarProblemas',
    component: () => import('../views/RelatarProblemas.vue')
  },
  {
    path: '/privacidade',
    name: 'Privacidade',
    component: () => import('../views/Privacidade.vue')
  },
  {
    path: '/termos',
    name: 'Termos',
    component: () => import('../views/Termos.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/planilha-amort'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
