import { api } from "src/boot/axios";
import { getHeaders } from "src/js/common/header";

const getMenus = (param) => {
  return api.get("/rest/api/v1/settings/menu/menus", {
    params: param,
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
  });
};

const putMenu = (param, menuId) => {
  return api.put(`/rest/api/v1/settings/menu/menus/${menuId}`, param, {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
  });
};

const deleteMenuImage = (deleteType, menuId) => {
  const param = { removeIconType: deleteType };

  return api.delete(`/rest/api/v1/settings/menu/menus/${menuId}/files`, {
    headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
    params: param,
  });
};

const getImageWithToken = async (url) => {
  try {
    const response = await api.get(url, {
      headers: getHeaders("yyyy-MM-dd HH:mm:ss").headers,
      responseType: "blob",
    });

    const blob = response.data;
    if (await isSvgFile(blob)) {
      const fixedBlob = new Blob([blob], { type: "image/svg+xml" });
      return URL.createObjectURL(fixedBlob);
    } else {
      return URL.createObjectURL(blob); // 다른 이미지 포맷은 그대로 반환
    }
  } catch (error) {
    return null;
  }
};

const isSvgFile = async (blob) => {
  // MIME 타입 우선 확인
  if (blob.type === "image/svg+xml") {
    return true;
  }

  try {
    // Blob 내용을 텍스트로 변환
    const text = await blob.text();

    // <svg> 태그가 존재하는지 확인
    if (!/<svg[\s\S]*?>/i.test(text)) {
      return false;
    }

    // 필수 네임스페이스 확인 (SVG는 반드시 `xmlns` 속성이 포함됨)
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");

    // 파싱 에러가 발생했는지 확인
    if (doc.querySelector("parsererror")) {
      return false;
    }

    // 루트 노드가 <svg>인지 확인
    const svgElement = doc.documentElement;
    return svgElement.tagName === "svg" && svgElement.hasAttribute("xmlns");
  } catch (error) {
    // 파일 읽기나 파싱 오류 시 SVG로 간주하지 않음
    return false;
  }
};

export default {
  getMenus,
  putMenu,
  deleteMenuImage,
  getImageWithToken,
};
