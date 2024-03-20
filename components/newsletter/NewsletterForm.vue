<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '订阅我们的新闻'
  },
  description: {
    type: String,
    default: '随时了解新产品和技术、指南和社区更新。'
  }
})

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit () {
  if (loading.value) { return }
  loading.value = true

  $fetch('https://api.nuxt.com/newsletter/subscribe', {
    method: 'POST',
    body: { email: email.value }
  }).then(() => {
    toast.add({ title: '订阅中', description: '请检查您的电子邮件以确认您的订阅。', color: 'green' })
    email.value = ''
  }).catch((err) => {
    const description = err.data?.message || '出了问题。请稍后再试。'
    toast.add({ title: '订阅失败', description, color: 'red' })
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UFormGroup name="email" :label="label" :description="description" size="xl" :ui="{ label: { base: 'font-semibold' }, container: 'mt-3' }">
      <UInput
        v-model="email"
        type="email"
        placeholder="you@domain.com"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        required
        autocomplete="off"
        class="max-w-sm"
      >
        <template #trailing>
          <UButton type="submit" size="xs" color="black" :label="loading ? '订阅中' : '订阅'" :loading="loading" />
        </template>
      </UInput>
    </UFormGroup>
  </form>
</template>
