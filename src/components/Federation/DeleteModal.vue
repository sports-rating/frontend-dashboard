<template>
  <el-dialog
    v-model="dialogVisible"
    title="Delete Federation"
    width="500px"
    :before-close="handleClose"
    align-center
  >
    <div class="text-center">
      <div class="mb-4">
        <el-icon size="64" color="#f56c6c">
          <WarningFilled />
        </el-icon>
      </div>

      <h3 class="text-xl font-semibold mb-4 text-gray-800">
        Are you sure you want to delete this federation?
      </h3>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" size="large"> Cancel </el-button>
        <el-button type="danger" @click="confirmDelete" :loading="loading" size="large">
          Delete Federation
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { WarningFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const props = defineProps({
  visible: Boolean,
  federation: Object,
  federations: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:visible", "confirmed"]);

// State
const dialogVisible = ref(false);
const confirmationText = ref("");
const loading = ref(false);
const showError = ref(false);


// Watch
watch(
  () => props.visible,
  (val) => {
    dialogVisible.value = val;
    if (val) {
      confirmationText.value = "";
      showError.value = false;
    }
  }
);

watch(dialogVisible, (val) => {
  emit("update:visible", val);
});

watch(confirmationText, () => {
  showError.value = false;
});

const handleClose = () => {
  dialogVisible.value = false;
};

const confirmDelete = async () => {
  try {
    loading.value = true;

    setTimeout(() => {
      emit("confirmed");
      ElMessage.success("Federation deleted successfully!");
      loading.value = false;
      handleClose();
    }, 1500);
  } catch {}
};
</script>

<style scoped>
.border-red-500 {
  border-color: #f56c6c !important;
}
</style>
