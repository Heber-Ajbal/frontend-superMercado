<script setup lang="ts">
const {
  public: { graphqlToken },
} = useRuntimeConfig()

const cookie = useCookie('graphql-token')
cookie.value = cookie.value || graphqlToken
</script>

<template>
  <div>

    <NuxtLayout>
      <NuxtRouteAnnouncer />
      <NuxtPage />
      <NuxtLoadingIndicator />
    </NuxtLayout>
  </div>
</template>
