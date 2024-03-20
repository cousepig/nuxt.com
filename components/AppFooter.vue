<script setup lang="ts">
const { footerLinks } = useNavigation()
</script>

<template>
  <UFooter
    :ui="{
      bottom: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: '!py-6' },
      top: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: 'py-8 lg:py-12' }
    }"
  >
    <template #top>
      <UFooterColumns :links="footerLinks">
        <template #right>
          <NewsletterForm />
        </template>
      </UFooterColumns>
    </template>

    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Copyright © 2016-{{ new Date().getFullYear() }} SYRINCS - <NuxtLink class="hover:underline" to="https://github.com/syrincs/syrincs/blob/main/LICENSE" target="_blank">
          MIT License
        </NuxtLink>
      </p>
    </template>

    <template #right>
      <UButton aria-label="Syrincs on X" to="https://x.com/syrincs" target="_blank" icon="i-simple-icons-x" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Syrincs on Youtube" to="https://www.youtube.com/@syrincs" target="_blank" icon="i-simple-icons-youtube" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Syrincs on Facebook" to="https://www.facebook.com/syrincs" target="_blank" icon="i-simple-icons-facebook" v-bind="($ui.button.secondary as any)" />
    </template>
  </UFooter>
</template>
