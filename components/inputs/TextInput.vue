<script setup lang="ts">
import { toRef, ref, onMounted, watch } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const name = toRef(props, 'name')
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange: originalHandleChange,
  meta,
} = useField(name, undefined, {
  initialValue: props.modelValue,
})

const input = ref(null)

onMounted(() => {
  if (props.autofocus) {
    input.value.focus()
  }
})

defineExpose({ focus: () => input.value.focus() })

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function (...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const handleChange = debounce((event: Event) => {
  originalHandleChange(event)
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}, 400)

watch(
  () => props.modelValue,
  (newVal) => {
    console.log('ModelValue changed:', newVal)
    inputValue.value = newVal
  },
)
</script>

<template>
  <div class="relative my-1 w-full">
    <input
      :id="name"
      ref="input"
      v-model="inputValue"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :class="[
        'block w-full rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
        errorMessage
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : meta.valid
            ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
      ]"
      :disabled="disabled"
      @input="handleChange"
      @blur="handleBlur"
    />

    <p v-if="errorMessage" class="absolute left-0 mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>
