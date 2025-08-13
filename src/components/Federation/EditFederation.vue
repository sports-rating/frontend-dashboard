<template>
  <div class="">
    <div class="mx-auto bg-white rounded-3xl">
      <!-- Title -->
      <div class="mb-10">
        <h2 class="text-4xl font-extrabold text-gray-800 mb-2">Обновить федерацию</h2>
      </div>

      <!-- Form Start -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="space-y-8"
      >
        <!-- Row 1 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Название федерации" prop="name">
              <el-input
                v-model="form.name"
                placeholder="например, Национальная федерация бокса"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Тип федерации" prop="is_national">
              <el-select v-model="form.is_national" placeholder="Выберите тип" clearable>
                <el-option label="Региональный" :value="false" />
                <el-option label="Национальный" :value="true" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Пользователи" prop="users">
              <el-select
                v-model="form.users"
                placeholder="Выберите пользователей"
                clearable
                multiple
              >
                <el-option
                  v-for="user in dataUsers"
                  :key="user.id"
                  :label="user.first_name + ' ' + user.last_name"
                  :value="user.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Row 2 -->
        <el-row :gutter="20">
          <el-col :span="8" v-if="form.is_national === false">
            <el-form-item label="Родительская федерация" prop="parent_federation">
              <el-select
                v-model="form.parent_federation"
                placeholder="Выберите родительскую федерацию"
                clearable
              >
                <el-option
                  v-for="fed in nationalFederations"
                  :key="fed.id"
                  :label="fed.name"
                  :value="fed.id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8" v-if="form.is_national === false">
            <el-form-item label="Область" prop="region">
              <el-input v-model="form.region" placeholder="например, Западный регион" />
            </el-form-item>
          </el-col>
          <el-col :span="form.is_national === false ? 8 : 24">
            <el-form-item label="Тип спорта" prop="sports">
              <el-select
                v-model="form.sports"
                placeholder="Выберите вид спорта"
                multiple
                clearable
              >
                <el-option
                  v-for="item in data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Row 5 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Номер телефона" prop="phone_number">
              <el-input v-model="form.phone_number" placeholder="+1 (555) 123-4567" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Адрес электронной почты" prop="email">
              <el-input v-model="form.email" placeholder="example@federation.org" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Address -->
        <el-form-item label="Адрес Федерации" prop="address">
          <el-input
            v-model="form.address"
            type="textarea"
            placeholder="Улица, город, почтовый индекс"
            :rows="3"
          />
        </el-form-item>

        <!-- Uploads -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Загрузить логотип" prop="logo_file">
              <el-upload
                :auto-upload="false"
                :on-change="handleLogoChange"
                :file-list="logoFileList"
                accept="image/*"
                list-type="picture-card"
              >
                <el-icon><Upload /></el-icon>
                Upload
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Загрузить документ" prop="document_file">
              <el-upload
                multiple
                :auto-upload="false"
                :on-change="handleDocumentChange"
                :file-list="documentFileList"
                accept=".pdf,.doc,.docx"
                list-type="text"
              >
                <el-button plain>Выберите файлы</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 🎯 Sport Groups - CHANGE: Updated to new sport-grouped structure -->
        <div>
          <div class="w-full flex justify-between items-center">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">
              🎯 Возрастные и весовые группы
            </h3>
            <el-button type="success" plain size="medium" @click="addSportGroup">
              + Добавить группу
            </el-button>
          </div>

          <!-- CHANGE: Each sport group now contains multiple age groups -->
         <div
  v-for="(sportGroup, sportIndex) in form.sportGroups"
  :key="sportIndex"
  class="bg-white rounded-2xl border border-gray-200 p-6 mb-8  hover:border-primary transition"
>
  <!-- Sport Group Header -->
  <div class="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
    <div class="flex items-center gap-3">
      <i class="el-icon-basketball text-primary text-xl"></i>
      <el-select
        v-model="sportGroup.sport"
        placeholder="Выберите Спорт"
        clearable
        filterable
        class="w-64"
      >
        <el-option
          v-for="sport in selectedSports"
          :key="sport.id"
          :label="sport.name"
          :value="sport.id"
        />
      </el-select>
    </div>
    <el-button 
      type="danger" 
      size="small" 
      round 
      plain
      @click="removeSportGroup(sportIndex)"
    >
       Удалить
    </el-button>
  </div>

  <!-- Age Groups -->
  <transition-group name="fade" tag="div">
    <div
      v-for="(ageGroup, ageIndex) in sportGroup.ageGroups"
      :key="ageIndex"
      class="bg-gray-50 rounded-xl p-5 mb-4 border border-gray-200 hover:border-primary transition"
    >
      <el-row :gutter="20" class="mb-4">
        <!-- Age -->
        <el-col :span="5">
          <el-input
            v-model="ageGroup.age"
            placeholder="Например, 17"
            type="number"
            @input="ageGroup.name = `U-${ageGroup.age}`"
          >
            <template #prepend>U-</template>
          </el-input>
        </el-col>

        <!-- Age display -->
        <el-col :span="2">
          <el-input :model-value="ageGroup.age" disabled  placeholder="Возраст"/>
        </el-col>

        <!-- Gender -->
        <el-col :span="5">
          <el-select
            v-model="ageGroup.gender"
            placeholder="Пол"
            clearable
            class="w-full"
          >
            <el-option label="Мужской" value="male" />
            <el-option label="Женский" value="female" />
          </el-select>
        </el-col>

        <!-- Weight -->
        <el-col :span="5">
          <div class="flex gap-2 items-center">
            <el-input
              v-model="ageGroup.newWeight"
              placeholder="Введите вес"
              type="number"
            />
            <el-button 
              type="primary" 
              size="default" 
              plain
              round
              @click="addWeight(sportIndex, ageIndex)"
            >
              +
            </el-button>
          </div>
        </el-col>

        <!-- Remove age group -->
        <el-col :span="7">
          <div class="flex justify-end">
            <el-button 
              type="danger" 
              size="small" 
              round 
              plain
              @click="removeAgeGroup(sportIndex, ageIndex)"
            >
              <img src="/delete.svg" alt="delete" class="w-4 h-4">
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- Weights -->
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="flex flex-wrap gap-2">
            <transition-group name="zoom" tag="div" class="flex flex-wrap gap-2">
              <el-tag
                v-for="(weight, weightIndex) in ageGroup.weights"
                :key="weightIndex"
                closable
                effect="dark"
                class="rounded-full px-3 py-1"
                @close="removeWeight(sportIndex, ageIndex, weightIndex)"
              >
                {{ weight }} кг
              </el-tag>
            </transition-group>
          </div>
        </el-col>
      </el-row>
    </div>
  </transition-group>

  <!-- Add Age Group -->
  <div class="flex justify-center pt-4 border-t border-gray-100">
    <el-button 
      type="primary" 
      plain
      round
      @click="addAgeGroup(sportIndex)"
    >
      + Добавить возрастную группу
    </el-button>
  </div>
</div>

        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 pt-6 border-t mt-8">
          <el-button @click="goBack">Отмена</el-button>
          <el-button type="primary" :loading="loading" @click="submitForm">
            Обновить федерацию
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import api from "../../utils/axios";
import { useRoute, useRouter } from "vue-router";
import router from "../../router";


const route = useRoute();
const router = useRouter();

const formRef = ref();
const loading = ref(false);

const logoFileList = ref([]);
const documentFileList = ref([]);

const data = ref([]);
const dataUsers = ref([]);
const federations = ref([]);

// CHANGE: Updated form structure to use sportGroups instead of ageGroups
const form = reactive({
  name: "",
  is_national: true,
  users: [],
  parent_federation: "",
  region: "",
  sports: [],
  address: "",
  phone_number: "",
  email: "",
  website: "",
  logo_file: null,
  document_file: [],
  sportGroups: [], // CHANGE: New structure for sport-grouped age groups
});

// CHANGE: Updated functions to work with sport groups
const addSportGroup = () => {
  form.sportGroups.push({
    sport: null,
    ageGroups: [
      {
        name: "",
        age: null,
        weights: [],
        newWeight: null,
        gender: "male",
      }
    ]
  });
};

const removeSportGroup = (sportIndex) => {
  form.sportGroups.splice(sportIndex, 1);
};

const addAgeGroup = (sportIndex) => {
  form.sportGroups[sportIndex].ageGroups.push({
    name: "",
    age: null,
    weights: [],
    newWeight: null,
    gender: "male",
  });
};

const removeAgeGroup = (sportIndex, ageIndex) => {
  form.sportGroups[sportIndex].ageGroups.splice(ageIndex, 1);
};

const addWeight = (sportIndex, ageIndex) => {
  const ageGroup = form.sportGroups[sportIndex].ageGroups[ageIndex];
  if (ageGroup.newWeight) {
    ageGroup.weights.push(ageGroup.newWeight);
    ageGroup.newWeight = null;
  }
};

const removeWeight = (sportIndex, ageIndex, weightIndex) => {
  form.sportGroups[sportIndex].ageGroups[ageIndex].weights.splice(weightIndex, 1);
};

const getSportName = (sportId) => {
  const sport = data.value.find(s => s.id === sportId);
  return sport ? sport.name : '';
};

const getData = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/sport/");
    data.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const getUsers = async () => {
  try {
    const res = await api.get(
      "https://api.7srating.uz/api/dashboard/users/?user_role=federation"
    );
    dataUsers.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const getFederations = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/federation/");
    federations.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const nationalFederations = computed(() =>
  federations.value.filter((f) => f.is_national)
);

const selectedSports = computed(() =>
  data.value.filter((sport) => form.sports.includes(sport.id))
);

onMounted(() => {
  getUsers();
  getData();
  getFederations();
  loadFederation();
});

const federationId = route.params.id;

// CHANGE: Updated loadFederation to convert old structure to new sport-grouped structure
const loadFederation = async () => {
  if (!federationId) {
    ElMessage.error("Идентификатор федерации не найден");
    return;
  }
  try {
    loading.value = true;
    const res = await api.get(`/federation/${federationId}/`);
    const d = res.data.data;

    form.name = d.name || "";
    form.is_national = d.is_national;
    form.users = d.users?.map((u) => u.id) || [];
    form.parent_federation = d.parent_federation || "";
    form.region = d.region || "";
    form.sports = d.sports?.map((s) => s.id) || [];
    form.address = d.address || "";
    form.phone_number = d.phone_number || "";
    form.email = d.email || "";
    form.website = d.website || "";

    // CHANGE: Convert old age groups structure to new sport-grouped structure
    if (d.age_groups && d.age_groups.length > 0) {
      const sportGroupsMap = new Map();
      
      d.age_groups.forEach((ag) => {
        const sportId = ag.sport.id || ag.sport;
        
        if (!sportGroupsMap.has(sportId)) {
          sportGroupsMap.set(sportId, {
            sport: sportId,
            ageGroups: []
          });
        }
        
        sportGroupsMap.get(sportId).ageGroups.push({
          id: ag.id,
          name: ag.name,
          age: ag.age,
          weights: ag.weights || [],
          newWeight: null,
          gender: ag.gender,
        });
      });
      
      form.sportGroups = Array.from(sportGroupsMap.values());
    } else {
      form.sportGroups = [];
    }

    // Logo files for upload component
    if (d.logo) {
      logoFileList.value = [
        {
          name: d.logo.split("/").pop(),
          url: d.logo,
          status: "finished",
          uid: "logo",
        },
      ];
    } else {
      logoFileList.value = [];
    }

    if (Array.isArray(d.documents)) {
      documentFileList.value = d.documents.map((doc) => ({
        name: doc.file.split("/").pop(),
        url: doc.file,
        status: "finished",
        uid: doc.id,
      }));
      form.document_file = [];
    } else {
      documentFileList.value = [];
      form.document_file = [];
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("Не удалось загрузить данные федерации");
  } finally {
    loading.value = false;
  }
};

const handleLogoChange = (file) => {
  form.logo_file = file.raw;
  logoFileList.value = [file];
};

const handleDocumentChange = (file, fileList) => {
  documentFileList.value = fileList;
  form.document_file = fileList.filter((f) => f.raw).map((f) => f.raw);
};

// CHANGE: Updated submitForm to handle new sport-grouped structure
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("Пожалуйста, исправьте ошибки в форме.");
      return;
    }

    try {
      loading.value = true;

      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("is_national", form.is_national ? "true" : "false");

      form.users.forEach((u) => fd.append("users", u));
      form.sports.forEach((s) => fd.append("sports", s));

      if (form.parent_federation) fd.append("parent_federation", form.parent_federation);
      if (form.region) fd.append("region", form.region);

      fd.append("address", form.address);
      fd.append("phone_number", form.phone_number);
      fd.append("email", form.email);
      fd.append("website", form.website || "");

      if (form.logo_file) {
        fd.append("logo", form.logo_file);
      }

      if (form.document_file.length > 0) {
        form.document_file.forEach((file) => {
          fd.append("documents", file);
        });
      }

      // CHANGE: Convert sport groups back to flat age groups structure for API
      const flatAgeGroups = [];
      form.sportGroups.forEach((sportGroup) => {
        sportGroup.ageGroups.forEach((ageGroup) => {
          const name = ageGroup.name && ageGroup.name.trim() !== "" 
            ? ageGroup.name.trim() 
            : `U-${ageGroup.age || ""}`.trim();
          
          flatAgeGroups.push({
            ...ageGroup,
            name,
            sport: sportGroup.sport
          });
        });
      });

      // Remove duplicates
      const uniqueAgeGroups = [];
      const set = new Set();
      flatAgeGroups.forEach((ag) => {
        const key = `${ag.name}_${ag.sport}_${ag.gender}`;
        if (!set.has(key)) {
          set.add(key);
          uniqueAgeGroups.push(ag);
        }
      });

      uniqueAgeGroups.forEach((ag, i) => {
        if (ag.id) {
          fd.append(`age_groups[${i}]id`, ag.id);
        }
        fd.append(`age_groups[${i}]name`, ag.name);
        fd.append(`age_groups[${i}]sport`, ag.sport);
        fd.append(`age_groups[${i}]age`, ag.age ?? "");
        fd.append(`age_groups[${i}]weights`, JSON.stringify(ag.weights || []));
        fd.append(`age_groups[${i}]gender`, ag.gender || "");
      });

      await api.patch(`/federation/${federationId}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      ElMessage.success("Федерация успешно обновлена!");
      router.push("/federation-list");
    } catch (err) {
      console.error(err);
      ElMessage.error("Не удалось обновить федерацию!");
    } finally {
      loading.value = false;
    }
  });
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.custom-dialog .el-dialog__body {
  padding-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
}

.form-container .el-form-item {
  margin-bottom: 20px;
}
</style>

<style>
.el-input {
  height: 40px !important;
}

.el-input__wrapper {
  height: 40px;
  padding: 0 11px;
  align-items: center;
  display: flex;
}

.el-select__wrapper {
  height: 40px;
  padding: 0 11px;
  align-items: center;
  display: flex;
}
</style>
