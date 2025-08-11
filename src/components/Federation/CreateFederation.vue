<template>
  <div class="p-10">
    <div class="mx-auto bg-white rounded-3xl p-10 border border-gray-100">
      <!-- Title -->
      <div class="mb-10 text-center">
        <h2 class="text-4xl font-extrabold text-gray-800 mb-2">Создать федерацию</h2>
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
          <el-col :span="8">
            <el-form-item label="Номер телефона" prop="phone_number">
              <el-input v-model="form.phone_number" placeholder="+1 (555) 123-4567" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Адрес электронной почты" prop="email">
              <el-input v-model="form.email" placeholder="example@federation.org" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="Социальные сети" prop="social_media">
              <el-input v-model="form.social_media" placeholder="@federation_handle" />
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
                <el-input :model-value="ag.age" disabled placeholder="Возраст" />
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
            Создать федерацию
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { Upload } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import api from "../../utils/axios";
const emit = defineEmits(["update:visible", "created"]);

// State
const dialogVisible = ref(false);
const formRef = ref();
const loading = ref(false);
const logoFileList = ref([]);
const documentFileList = ref([]);
const data = ref([]);
const dataUsers = ref([]);

const getData = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/sport/");

    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

const getUsers = async () => {
  try {
    const res = await api.get(
      "https://api.7srating.uz/api/dashboard/users/?user_role=federation"
    );

    dataUsers.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};

getUsers();

getData();
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
  logo_file: null,
  website: "",
  document_file: null,
  social_media: "",
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
const selectedSports = computed(() => {
  return data.value.filter((sport) => form.sports.includes(sport.id));
});

const goBack = () => {
  window.history.go(-1);
};
const rules = {
  name: [
    { required: true, message: "Введите название федерации", trigger: "blur" },
    {
      min: 3,
      max: 100,
      message: "Имя должно содержать от 3 до 100 символов.",
      trigger: "blur",
    },
  ],
  is_national: [{ required: true, message: "Выберите тип федерации", trigger: "change" }],
  users: [
    {
      type: "array",
      required: true,
      message: "Пожалуйста, выберите хотя бы одного пользователя.",
      trigger: "change",
    },
  ],
  parent_federation: [
    {
      required: () => form.is_national === false,
      message: "Пожалуйста, выберите родительскую федерацию",
      trigger: "change",
    },
  ],
  region: [
    {
      required: () => form.is_national === false,
      message: "Пожалуйста, введите регион",
      trigger: "blur",
    },
    {
      min: 2,
      max: 100,
      message: "Регион должен содержать от 2 до 100 символов.",
      trigger: "blur",
    },
  ],
  sports: [
    {
      type: "array",
      required: true,
      message: "Пожалуйста, выберите хотя бы один вид спорта",
      trigger: "change",
    },
  ],
  phone_number: [
    { required: true, message: "Пожалуйста, введите номер телефона", trigger: "blur" },
    {
      pattern: /^\+?[0-9\s\-()]{7,20}$/,
      message: "Пожалуйста, введите действительный номер телефона.",
      trigger: ["blur", "change"],
    },
  ],
  email: [
    {
      required: true,
      message: "Пожалуйста, введите адрес электронной почты",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Пожалуйста, введите правильный адрес электронной почты.",
      trigger: ["blur", "change"],
    },
  ],
  social_media: [
    {
      pattern: /^@?[a-zA-Z0-9_]{1,30}$/,
      message: "Пожалуйста, введите действительный адрес социальной сети.",
      trigger: ["blur", "change"],
    },
  ],
  address: [
    { required: true, message: "Пожалуйста, введите адрес федерации", trigger: "blur" },
    {
      min: 5,
      max: 250,
      message: "Адрес должен содержать от 5 до 250 символов.",
      trigger: "blur",
    },
  ],
  logo_file: [
    { required: true, message: "Пожалуйста, загрузите файл логотипа", trigger: "change" },
  ],
  document_file: [
    {
      type: "array",
      required: true,
      message: "Пожалуйста, загрузите хотя бы один документ",
      trigger: "change",
    },
  ],
};

const federations = ref([
  { id: 1, name: "Федерация Узбекистана", is_national: true },
  { id: 2, name: "Ташкентская Федерация", is_national: false },
  { id: 3, name: "Самаркандская Федерация", is_national: true },
]);

const nationalFederations = computed(() =>
  federations.value.filter((f) => f.is_national)
);

watch(dialogVisible, (val) => {
  if (!val) resetForm();
});

watch(dialogVisible, (val) => {
  emit("update:visible", val);
  if (!val) {
    resetForm();
  }
});

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
    social_media: "",
    ageGroups: [],
  });
};

const handleLogoChange = (file) => {
  form.logo_file = file.raw;
  logoFileList.value = [file];
};

const handleDocumentChange = (file, fileList) => {
  documentFileList.value = fileList;
  form.document_file = fileList.map((f) => f.raw);
};

function validateAgeGroups() {
  if (!form.ageGroups.length) {
    return "Пожалуйста, добавьте хотя бы одну возрастную и весовую группу.";
  }

  for (const [i, ag] of form.ageGroups.entries()) {
    if (!ag.sport) {
      return `Возрастная группа #${i + 1}: Обязательно «Спорт».`;
    }
    if (!ag.age || ag.age <= 0) {
      return `Возрастная группа #${i + 1}: «Возраст» должен быть больше нуля.`;
    }
    if (!ag.name || ag.name.trim() === "") {
      return `Возрастная группа #${i + 1}: Обязательное поле «Имя».`;
    }
    if (!ag.gender) {
      return `Возрастная группа #${i + 1}: Обязательно укажите «Пол».`;
    }
  }
  return null;
}

const showValidationErrors = async () => {
  const fields = Object.keys(rules);
  for (const field of fields) {
    try {
      await formRef.value.validateField(field);
    } catch (errors) {
      if (errors && errors.length) {
        errors.forEach((err) => {
          ElMessage.error(err.message);
        });
      }
    }
  }
};

const submitForm = async () => {
  if (!formRef.value) return;
  await showValidationErrors();
  await formRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }

    const err = validateAgeGroups();
    if (err) {
      ElMessage.error(err);
      return;
    }

    try {
      loading.value = true;
      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("is_national", form.is_national);

      form.users.forEach((u) => fd.append("users", u));
      form.sports.forEach((s) => fd.append("sports", s));

      if (form.parent_federation) fd.append("parent_federation", form.parent_federation);
      if (form.region) fd.append("region", form.region);
      if (form.address) fd.append("address", form.address);

      fd.append("phone_number", form.phone_number);
      if (form.email) fd.append("email", form.email);

      if (form.logo_file) fd.append("logo", form.logo_file);

      if (form.document_file && form.document_file.length) {
        form.document_file.forEach((file, i) => {
          fd.append(`documents[${i}]file`, file);
        });
      }

      form.ageGroups.forEach((ag, i) => {
        let name =
          ag.name && ag.name.trim() !== "" ? ag.name.trim() : `U-${ag.age || ""}`.trim();

        fd.append(`age_groups[${i}]name`, name);
        fd.append(`age_groups[${i}]sport`, ag.sport);
        fd.append(`age_groups[${i}]age`, ag.age ?? "");
        fd.append(`age_groups[${i}]weights`, JSON.stringify(ag.weights));
        fd.append(`age_groups[${i}]gender`, ag.gender);
      });

      await api.post("/sport/federations/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      ElMessage.success("Федерация успешно создана!");
      formRef.value.resetFields();
    } catch (err) {
      console.error(err);
      ElMessage.error("Не удалось создать федерацию!");
    } finally {
      loading.value = false;
    }
  });
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
