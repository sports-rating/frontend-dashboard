<template>
  <div class="">
    <h1 class="text-2xl font-semibold mb-6">Создать пользовательские условия</h1>

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
            placeholder="Введите название пользовательских условий"
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
          Сохранить
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
import { ElMessage } from "element-plus";

const newPolicy = ref({
  title: '',
  language: 'en',
  text: '' 
})

const quillEditor = ref(null)

const onEditorReady = (editor) => {
  quillEditor.value = editor
  editor.on('text-change', () => {
    newPolicy.value.text = editor.root.innerHTML
  })
}

const submitPolicy = async () => {
  try {
    const policyData = {
      title: newPolicy.value.title,
      language: newPolicy.value.language,
      text: newPolicy.value.text,
    };

    await api.post(
      "https://api.7srating.uz/api/dashboard/terms-of-condition/",
      policyData
    );
    
    toast.success("Успех в использовании пользовательских условий", {
      autoClose: 3000,
    });
    router.push('/user-terms-list');
  } catch (error) {
    console.error('Submission error:', error);
    ElMessage.error(error.response.data.message);
  }
};

</script>

<style scoped>
</style>
