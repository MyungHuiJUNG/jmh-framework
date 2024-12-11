import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default function useToastAlert() {
  const showToast = (message) => {
    toast(`<strong>알림이 도착하였습니다.</strong><br>${message}`, {
      theme: "auto",
      type: "info",
      position: "bottom-right",
      hideProgressBar: true,
      transition: "zoom",
      dangerouslyHTMLString: true,
    });
  };

  return { showToast };
}
