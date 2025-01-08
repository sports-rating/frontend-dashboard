<template>
  <div class="min-h-screen ">

  <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Спортивные комплексы</h1>
      <nav class="flex space-x-2 text-sm text-gray-500">
        <a href="#" class="hover:text-gray-900">Главная</a>
        <span>→</span>
        <span>Спортивные комплексы</span>
      </nav>
    </div>

    <div class="flex justify-between mb-4">
      <div class="relative">
        <input
          type="text"
          placeholder="Поиск..."
          class="pl-8 pr-2 py-2 border rounded-md"
          v-model="searchQuery"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-2 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div class="flex space-x-6">
        <select v-model="selectedType" class="border rounded-md px-2 py-2">
          <option value="">Все типы комплексы</option>
          <option value="Футбол">Футбол</option>
          <option value="Баскетбол">Баскетбол</option>
          <option value="Биатлон">Биатлон</option>
          <option value="Бокс">Бокс</option>
        </select>
        <select v-model="selectedLocation" class="border rounded-md px-2 py-2">
          <option value="">Ташкент</option>
        </select>
        <button @click="showModal = true" class="bg-red-500 text-white px-4 py-2 rounded-md">Добавить</button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow w-full">
      <div class=" overflow-x-scroll no-scrollbar  "> 

    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr class="bg-gray-100">
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название комплекса</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Номер телефона</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип комплекса</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Фотографии</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Местоположение</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200 !w-full">
        <tr v-for="complex in filteredComplexes" :key="complex.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ complex.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ complex.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ complex.phone }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ complex.description }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ complex.type }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div class="flex space-x-1">
              <div v-for="(photo, index) in complex.photos" :key="index" class="w-8 h-8 bg-gray-200 rounded">
                <img :src="photo" alt="">
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ complex.location }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <select class="border rounded-md px-2 py-1">
              <option value="">Действие</option>
              <option value="edit">Редактировать</option>
              <option value="delete">Удалить</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
      </div>
      </div>


        <!-- Modal Component -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Добавить комплекс</h2>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Название комплекса</label>
            <input
              v-model="newComplex.name"
              type="text"
              class="mt-1 block w-full border rounded-md px-3 py-2"
              placeholder="Введите название"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Тип комплекса</label>
            <select
              v-model="newComplex.type"
              class="mt-1 block w-full border rounded-md px-3 py-2"
            >
              <option value="">Выберите тип комплекса</option>
              <option value="Футбол">Футбол</option>
              <option value="Баскетбол">Баскетбол</option>
              <option value="Биатлон">Биатлон</option>
              <option value="Бокс">Бокс</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Номер телефона</label>
            <input
              v-model="newComplex.phone"
              type="tel"
              class="mt-1 block w-full border rounded-md px-3 py-2"
              placeholder="Введите номер телефона"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              v-model="newComplex.description"
              class="mt-1 block w-full border rounded-md px-3 py-2"
              rows="3"
              placeholder="Введите краткое описание"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Фотографии</label>
            <div class="mt-1 flex items-center space-x-2">
              <div class="flex items-center gap-2">
      <!-- Existing Images -->
      <div v-for="(image, index) in images" :key="index" class="relative group">
        <img 
          :src="image.url" 
          class="w-16 h-16 object-cover rounded-lg"
          alt="Complex photo"
        />
        <button 
          @click="deleteImage(index)"
          class="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Upload Button -->
      <label class="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
          multiple
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </label>
    </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Местоположение</label>
            <input
              v-model="newComplex.location"
              type="text"
              class="mt-1 block w-full border rounded-md px-3 py-2"
              placeholder="Введите местоположение"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Готово
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const searchQuery = ref('')
const selectedType = ref('')
const selectedLocation = ref('')
const showModal = ref(false)

const newComplex = ref({
  name: '',
  type: '',
  phone: '',
  description: '',
  location: '',
  photos: []
})

const complexes = ref([
  { id: '001', name: 'Humo Arena', phone: '+998 90 000 00 00', description: 'Многофункциональный ледовый...', type: 'Футбол', photos: [1, 2], location: 'Ташкент, Мирзо Улугбекский район' },
  { id: '001', name: 'Centris Fit&SPA', phone: '+998 90 000 00 00', description: 'Многофункциональный ледовый...', type: 'Баскетбол', photos: [1, 2], location: 'Ташкент, Мирзо Улугбекский район' },
  { id: '001', name: 'Medion Sport', phone: '+998 90 000 00 00', description: 'Многофункциональный ледовый...', type: 'Биатлон', photos: [1], location: 'Ташкент, Мирзо Улугбекский район' },
  { id: '001', name: 'Savage', phone: '+998 90 000 00 00', description: 'Многофункциональный ледовый...', type: 'Бокс', photos: [1], location: 'Ташкент, Мирзо Улугбекский район' },
  // Add more complexes as needed
])

const filteredComplexes = computed(() => {
  return complexes.value.filter(complex => {
    const name = complex.name || ''; // Fallback to an empty string if undefined
    const description = complex.description || ''; // Fallback to an empty string if undefined
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = !selectedType.value || complex.type === selectedType.value;
    const matchesLocation = !selectedLocation.value || (complex.location || '').includes(selectedLocation.value);
    return matchesSearch && matchesType && matchesLocation;
  });
});

const handleSubmit = () => {
  if (!newComplex.value.name || !newComplex.value.type) {
    alert("Заполните обязательные поля!");
    return;
  }

  const newId = `00${complexes.value.length + 1}`;
  complexes.value.push({ ...newComplex.value, id: newId, photos: images.value.map((img) => img.url) });

  newComplex.value = {
    name: "",
    type: "",
    phone: "",
    description: "",
    location: "",
    photos: []
  };

  images.value = [];
  showModal.value = false;
};

const images = ref([]);

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push({ url: e.target.result });
    };
    reader.readAsDataURL(file);
  });
};

const deleteImage = (index) => {
  images.value.splice(index, 1);
};


// const props = defineProps({
//   modelValue: {
//     type: Array,
//     default: () => []
//   }
// })

// const emit = defineEmits(['update:modelValue'])

// const images = ref(props.modelValue)

// watch(images, (newImages) => {
//   emit('update:modelValue', newImages)
// }, { deep: true })

// const handleImageUpload = (event) => {
//   const files = event.target.files
//   if (!files) return

//   Array.from(files).forEach(file => {
//     if (!file.type.startsWith('image/')) return

//     const reader = new FileReader()
//     reader.onload = (e) => {
//       images.value.push({
//         url: e.target.result,
//         file: file
//       })
//       newComplex.value.photos.push({
//         url: e.target.result,
//         file: file
//       })
//     }
//     reader.readAsDataURL(file)
//   })

//   // Reset input
//   event.target.value = ''
// }

// const deleteImage = (index) => {
//   images.value.splice(index, 1)
// }
</script>