<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Page from '~/components/Page.vue'
import DashboardOverview from '~/components/dashboard/DashboardOverview.vue'
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :paths="[{ route: '/dashboard', parameters: [], text: 'Dashboard' }]" />
    </template>

    <DashboardOverview />
  </Page>
</template>
