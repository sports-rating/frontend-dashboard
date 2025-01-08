import { ref, watch } from "vue";

export function useDarkMode() {
  const isDarkMode = ref(localStorage.getItem("darkMode") === "true");

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle("dark", isDarkMode.value);
    localStorage.setItem("darkMode", isDarkMode.value);
  };

  watch(isDarkMode, (newVal) => {
    document.documentElement.classList.toggle("dark", newVal);
    localStorage.setItem("darkMode", newVal);
  });

  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return { isDarkMode, toggleDarkMode };
}
