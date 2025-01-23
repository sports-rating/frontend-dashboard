<template>
  <div class="">
    <h1 class="text-2xl font-semibold mb-6">Создать политику конфиденциальности</h1>

    <!-- Form -->
    <div class="">
      <form @submit.prevent="submitPolicy">
        <div class="flex gap-4 w-full">
          <!-- Title Field -->
        <div class="mb-4 w-[80%]">
          <label for="title" class="block text-sm font-semibold mb-2">Заголовок</label>
          <input
            id="title"
            v-model="newPolicy.title"
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Введите название политики"
            required
          />
        </div>

        <!-- Language Selection -->
        <div class="mb-4 w-[20%]">
          <label for="language" class="block text-sm font-semibold mb-2">Язык</label>
          <select
            id="language"
            v-model="newPolicy.language"
            class="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="en">Английский</option>
            <option value="ru">Русский</option>
            <option value="uz">Узбекский</option>
          </select>
        </div>
        </div>

        <!-- Text Editor -->
        <div class="mb-6">
          <label for="text" class="block text-sm font-semibold mb-2">Текст</label>
          <QuillEditor
            ref="quillEditor"
            theme="snow"
            @ready="onEditorReady"
          />
        </div>

        <button
          type="submit"
          class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Обновить 
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import api from "../../../utils/axios"
import router from '../../../router';

const newPolicy = ref({
  title: '',
  language: 'en',
  text: '' // This will hold the content of the Quill editor
})

// Ref to store the editor instance
const quillEditor = ref(null)

// Capture the editor instance and set the text manually
const onEditorReady = (editor) => {
  quillEditor.value = editor
  editor.on('text-change', () => {
    newPolicy.value.text = editor.root.innerHTML // Update the text field with the editor's content
  })
}

const submitPolicy = async () => {
  try {
    // Create a plain object by cloning newPolicy (removes reactivity)
    const policyData = {
      title: newPolicy.value.title,
      language: newPolicy.value.language,
      text: newPolicy.value.text,
    };

    await api.post(
      "https://api.7srating.uz/api/dashboard/privacy-policy/",
      policyData // Send the plain object without circular references
    );
    
    toast.success("Обновление Политики конфиденциальности", {
      autoClose: 3000,
    });
    router.push('/privacy-policy-list');
  } catch (error) {
    console.error('Submission error:', error);
    toast.error(error.response?.data?.data || 'An error occurred', {
      autoClose: 3000,
    });
  }
};

</script>

<style scoped>
</style>
