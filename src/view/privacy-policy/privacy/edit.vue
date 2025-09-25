<template>
  <div class="">
    <h1 class="text-2xl font-semibold mb-6">Обновить политику конфиденциальности</h1>

    <div class="">
      <form @submit.prevent="submitPolicy">
        <div class="flex gap-4 w-full">
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
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, onMounted } from 'vue';
import api from "../../../utils/axios";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useRoute } from 'vue-router';
import router from '../../../router';
import { ElMessage } from "element-plus";


const route = useRoute();

const newPolicy = ref({
  title: '',
  language: '',
  text: ''
});

const quillEditor = ref(null);

const onEditorReady = (editor) => {
  quillEditor.value = editor;
  editor.on('text-change', () => {
    newPolicy.value.text = editor.root.innerHTML;
  });
};

const getData = async () => {
  try {
    const res = await api.get(
      `/dashboard/privacy-policy/${route.params.id}/`
    );

    newPolicy.value.title = res.data.data.title;
    newPolicy.value.language = res.data.data.language;

    if (quillEditor.value) {
      quillEditor.value.root.innerHTML = res.data.data.text;
    } else {
      const storedText = res.data.data.text;
      const originalOnEditorReady = onEditorReady;

        onEditorReady = (editor) => {
            originalOnEditorReady(editor); 
            editor.root.innerHTML = storedText; 
        };
    }
  } catch (e) {
    console.error("Error fetching data:", e);
    toast.error("Failed to fetch privacy policy data.", { autoClose: 3000 });
  }
};

onMounted(() => {
    getData();
});


const submitPolicy = async () => {
  try {
    const policyData = {
      title: newPolicy.value.title,
      language: newPolicy.value.language,
      text: newPolicy.value.text,
    };

    await api.put(
      `/dashboard/privacy-policy/${route.params.id}/`,
      policyData
    );

    toast.success("Политика конфиденциальности успешно обновлена!", { autoClose: 3000 });
    router.push('/privacy-policy-list');
  } catch (error) {
    console.error('Error updating policy:', error);
    ElMessage.error(error.response.data.message);
  }
};
</script>

<style scoped>
</style>