<template>
  <div class="">
    <div class="mx-auto rounded-3xl">
      <!-- Title -->
      <div class="mb-10">
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
          <el-col :span="12">
            <el-form-item label="Название федерации" prop="name">
              <el-input
                v-model="form.name"
                placeholder="например, Национальная федерация бокса"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Тип федерации" prop="is_national">
              <el-select v-model="form.is_national" placeholder="Выберите тип" clearable>
                <el-option label="Региональный" :value="false" />
                <el-option label="Национальный" :value="true" />
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
              <el-input v-model="form.phone_number" placeholder="+998 99 857 72 32" />
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

        <!-- 🎯 Age Groups - MODIFIED SECTION -->
        <div>
          <div class="w-full flex justify-between items-center">
            <h3 class="text-2xl font-semibold text-gray-800 mb-6">
              🎯 Возрастные и весовые группы
            </h3>

            <el-button type="success" plain size="medium" @click="addSportGroup"
              >+ Добавить группу</el-button
            >
          </div>

          <!-- Sport Groups -->
          <div
  v-for="(sportGroup, sportIndex) in form.sportGroups"
  :key="sportIndex"
  class="bg-white rounded-2xl  border border-gray-200 p-6 mb-8 transition "
>
  <!-- Sport Selection Header -->
  <div class="mb-5 pb-5 border-b border-gray-200 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <i class="el-icon-basketball text-primary text-xl"></i>
      
      <el-select
        v-model="sportGroup.sport"
        placeholder="Выберите Спорт"
        clearable
        filterable
        class="w-64"
        @change="onSportChange(sportIndex)"
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
      plain
      round
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
      class="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-4 hover:border-primary transition"
    >
      <el-row :gutter="20" class="mb-4 items-center">
        <!-- Age -->
        
        <el-col :span="6">
          <el-input
            v-model="ageGroup.name"
            placeholder="U-17, +45, U-15-35"
            type="text"
            class="rounded-lg"
          >
          </el-input>
        </el-col>


        <!-- Gender -->
        <el-col :span="4">
          <el-select
            v-model="ageGroup.gender"
            placeholder="Пол"
            clearable
            class="w-full rounded-lg"
          >
            <el-option label="Мужской" value="male" />
            <el-option label="Женский" value="female" />
          </el-select>
        </el-col>

        <!-- Add weight -->
        <el-col :span="6">
          <div class="flex gap-2 items-center">
            <el-input
              v-model="ageGroup.newWeight"
              placeholder="Введите вес"
              type="text"
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

        <!-- Delete -->
        <el-col :span="6">
          <div class="flex justify-end">
            <el-button 
              type="danger" 
              size="small" 
              plain
              @click="removeAgeGroup(sportIndex, ageIndex)"
              v-if="sportGroup.ageGroups.length > 1"
            >
              <img src="/delete.svg" alt="delete" class="w-4 h-4">
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- Weights list -->
      <el-row>
        <el-col :span="24">
          <div class="flex flex-wrap gap-2">
            <transition-group name="zoom" tag="div" class="flex gap-2 flex-wrap">
              <el-tag
                v-for="(w, wi) in ageGroup.weights"
                :key="wi"
                closable
                class="rounded-full px-3 py-1 bg-primary text-white font-medium"
                @close="removeWeight(sportIndex, ageIndex, wi)"
              >
                {{ w }}
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
      @click="addAgeGroupToSport(sportIndex)"
      :disabled="!sportGroup.sport"
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
import router from "../../router";
const emit = defineEmits(["update:visible", "created"]);

// State
const dialogVisible = ref(false);
const formRef = ref();
const loading = ref(false);
const logoFileList = ref([]);
const documentFileList = ref([]);
const data = ref([]);

const getData = async () => {
  try {
    const res = await api.get("https://api.7srating.uz/api/sport/");
    data.value = res.data.data;
  } catch (e) {
    console.log(e);
  }
};


getData();

const form = reactive({
  name: "",
  is_national: true,
  parent_federation: "",
  region: "",
  sports: [],
  address: "",
  phone_number: "",
  email: "",
  logo_file: null,
  website: "",
  document_file: null,
  sportGroups: [],
});

const addSportGroup = () => {
  form.sportGroups.push({
    sport: null,
    ageGroups: [{
      name: "",
      weights: [],
      newWeight: null,
      gender: "male",
    }]
  });
};

const addAgeGroupToSport = (sportIndex) => {
  form.sportGroups[sportIndex].ageGroups.push({
    name: "",
    weights: [],
    newWeight: null,
    gender: "male",
  });
};

const removeSportGroup = (sportIndex) => {
  form.sportGroups.splice(sportIndex, 1);
};

const removeAgeGroup = (sportIndex, ageIndex) => {
  form.sportGroups[sportIndex].ageGroups.splice(ageIndex, 1);
};

const onSportChange = (sportIndex) => {
  console.log('Sport changed for group', sportIndex);
};

const addWeight = (sportIndex, ageIndex) => {
  const ageGroup = form.sportGroups[sportIndex].ageGroups[ageIndex];
  let val = ageGroup.newWeight?.toString().trim();

  if (val) {
    if (val.endsWith("+")) {
      val = "+" + val.replace("+", "");
    }
    else if (val.endsWith("-")) {
      val = "-" + val.replace("-", "");
    }
    else {
      val = val;
    }

    ageGroup.weights.push(val);
    ageGroup.newWeight = null;
  }
};

const removeWeight = (sportIndex, ageIndex, weightIndex) => {
  form.sportGroups[sportIndex].ageGroups[ageIndex].weights.splice(weightIndex, 1);
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
    parent_federation: "",
    region: "",
    sports: [],
    address: "",
    phone_number: "",
    email: "",
    logo_file: null,
    website: "",
    document_file: null,
    sportGroups: [],
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
  if (!form.sportGroups.length) {
    return "Пожалуйста, добавьте хотя бы одну спортивную группу.";
  }

  for (const [sportIndex, sportGroup] of form.sportGroups.entries()) {
    if (!sportGroup.sport) {
      return `Спортивная группа #${sportIndex + 1}: Обязательно выберите «Спорт».`;
    }

    if (!sportGroup.ageGroups.length) {
      return `Спортивная группа #${sportIndex + 1}: Добавьте хотя бы одну возрастную группу.`;
    }

    for (const [ageIndex, ageGroup] of sportGroup.ageGroups.entries()) {
      if (!ageGroup.gender) {
        return `Спортивная группа #${sportIndex + 1}, Возрастная группа #${ageIndex + 1}: Обязательно укажите «Пол».`;
      }
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

      let ageGroupIndex = 0;
      form.sportGroups.forEach((sportGroup) => {
        sportGroup.ageGroups.forEach((ageGroup) => {
          fd.append(`age_groups[${ageGroupIndex}]name`, ageGroup.name);
          fd.append(`age_groups[${ageGroupIndex}]sport`, sportGroup.sport);
          fd.append(`age_groups[${ageGroupIndex}]weights`, JSON.stringify(ageGroup.weights));
          fd.append(`age_groups[${ageGroupIndex}]gender`, ageGroup.gender);
          ageGroupIndex++;
        });
      });

      await api.post("/federation/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      ElMessage.success("Федерация успешно создана!");
      formRef.value.resetFields();
      router.push("/federation-list");
    } catch (err) {
      console.error(err);
      ElMessage.error(err.response.data.message);
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
