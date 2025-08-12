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

          <!-- <el-col :span="8">
            <el-form-item label="Социальные сети" prop="social_media">
              <el-input v-model="form.social_media" placeholder="@federation_handle" />
            </el-form-item>
          </el-col> -->
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

        <!-- 🎯 Age Groups -->
        <div>
          <div class="w-full flex justify-between items-center">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">
              🎯 Возрастные и весовые группы
            </h3>

            <el-button type="success" plain size="medium" @click="addAgeGroup"
              >+ Добавить группу</el-button
            >
          </div>

          <div
            v-for="(ag, index) in form.ageGroups"
            :key="index"
            class="bg-gray-50 rounded-xl border p-6 mb-6 transition"
          >
            <el-row :gutter="20" class="mb-4">
              <el-col :span="6">
                <el-select
                  v-model="ag.sport"
                  placeholder="Выберите Спорт"
                  clearable
                  filterable
                  class="w-full"
                >
                  <el-option
                    v-for="sport in selectedSports"
                    :key="sport.id"
                    :label="sport.name"
                    :value="sport.id"
                  />
                </el-select>
              </el-col>

              <!-- Age name har doim U- bilan -->
              <el-col :span="6">
                <el-input
                  v-model="ag.age"
                  placeholder="например, 17"
                  type="number"
                  @input="ag.name = `U-${ag.age}`"
                >
                  <template #prepend>U-</template>
                </el-input>
              </el-col>

              <el-col :span="8">
                <el-select
                  v-model="ag.gender"
                  placeholder="Пол"
                  clearable
                  class="w-full rounded-xl"
                >
                  <el-option label="Мужской" value="male" />
                  <el-option label="Женский" value="female" />
                </el-select>
              </el-col>
            </el-row>

            <el-row :gutter="20" class="mb-4">
              <!-- Faqat raqam qismi disabled -->
              <el-col :span="6">
                <el-input :model-value="ag.age" disabled placeholder="Age" />
              </el-col>

              <el-col :span="6">
                <div class="flex gap-2">
                  <el-input
                    v-model="ag.newWeight"
                    placeholder="Введите вес"
                    type="number"
                  />
                  <el-button type="primary" class="!h-10" @click="addWeight(index)"
                    >+</el-button
                  >
                </div>
              </el-col>

              <!-- Qo‘shilgan weightlar -->
              <el-col :span="11">
                <div class="flex flex-wrap gap-1">
                  <el-tag
                    v-for="(w, wi) in ag.weights"
                    :key="wi"
                    closable
                    class="!h-10"
                    @close="removeWeight(index, wi)"
                  >
                    {{ w }}
                  </el-tag>
                </div>
              </el-col>
            </el-row>

            <div class="flex justify-end w-full">
              <el-button type="danger" size="small" @click="removeAgeGroup(index)">
                Удалять
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
import { ref, reactive, computed, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import api from "../../utils/axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const formRef = ref();
const loading = ref(false);

const logoFileList = ref([]);
const documentFileList = ref([]);

const data = ref([]);
const dataUsers = ref([]);
const federations = ref([]);

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
  // social_media: "",
  website: "",
  logo_file: null,
  document_file: [],
  ageGroups: [],
});

const addAgeGroup = () => {
  form.ageGroups.push({
    sport: form.sports || "",
    name: "",
    age: null,
    weights: [],
    newWeight: null,
    gender: "male",
  });
};

const addWeight = (agIndex) => {
  const ag = form.ageGroups[agIndex];
  if (ag.newWeight) {
    ag.weights.push(ag.newWeight);
    ag.newWeight = null;
  }
};
const removeWeight = (agIndex, wIndex) => {
  form.ageGroups[agIndex].weights.splice(wIndex, 1);
};
const removeAgeGroup = (index) => {
  form.ageGroups.splice(index, 1);
};
// Fetch sports, users, federations as before
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
    const res = await api.get("https://api.7srating.uz/api/sport/federations/");
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

getUsers();
getData();
getFederations();

const federationId = route.params.id;

const loadFederation = async () => {
  if (!federationId) {
    ElMessage.error("Идентификатор федерации не найден");
    return;
  }
  try {
    loading.value = true;
    const res = await api.get(`/sport/federation/${federationId}/`);
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
    // form.social_media = d.social_media || "";
    form.website = d.website || "";
    form.ageGroups =
      d.age_groups?.map((ag) => ({
        id: ag.id,
        sport: ag.sport.id || ag.sport,
        name: ag.name,
        age: ag.age,
        weights: ag.weights || [],
        newWeight: null,
        gender: ag.gender,
      })) || [];

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

    // Documents files for upload component
    if (Array.isArray(d.documents)) {
      documentFileList.value = d.documents.map((doc) => ({
        name: doc.file.split("/").pop(),
        url: doc.file,
        status: "finished",
        uid: doc.id,
      }));

      // We do NOT fill form.document_file with URLs, only raw new files will be appended later
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

onMounted(() => {
  loadFederation();
});

const handleLogoChange = (file) => {
  form.logo_file = file.raw;
  logoFileList.value = [file];
};

const handleDocumentChange = (file, fileList) => {
  documentFileList.value = fileList;
  form.document_file = fileList.filter((f) => f.raw).map((f) => f.raw); // only new files
};

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  logoFileList.value = [];
  documentFileList.value = [];
  Object.assign(form, {
    name: "",
    is_national: false,
    users: [],
    parent_federation: "",
    region: "",
    sports: [],
    address: "",
    phone_number: "",
    email: "",
    logo_file: null,
    website: "",
    document_file: null,
    // social_media: "",
    ageGroups: [],
  });
};

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
      // fd.append("social_media", JSON.stringify(form.social_media || {}));

      fd.append("website", form.website || "");

      if (form.logo_file) {
        fd.append("logo", form.logo_file);
      }

      // Append new documents (only new files)
      if (form.document_file.length > 0) {
        form.document_file.forEach((file) => {
          fd.append("documents", file);
        });
      }

      // Prepare unique age groups (avoid duplicates)
      const uniqueAgeGroups = [];
      const set = new Set();

      form.ageGroups.forEach((ag) => {
        const name =
          ag.name && ag.name.trim() !== "" ? ag.name.trim() : `U-${ag.age || ""}`.trim();
        const key = `${name}_${ag.sport}`;
        if (!set.has(key)) {
          set.add(key);
          uniqueAgeGroups.push({ ...ag, name });
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

      await api.patch(`/sport/federation/${federationId}/`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      ElMessage.success("Федерация успешно обновлена!");
      router.back();
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
