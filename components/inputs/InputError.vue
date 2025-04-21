<script setup lang="ts">
import {ErrorMessage} from "vee-validate";

defineProps({
  name: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div>
    <p class="text-sm text-red-600">
      <ErrorMessage :name="name" />
    </p>
  </div>
</template>
