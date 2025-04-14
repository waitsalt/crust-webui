import { useSettingStore } from "@/store/setting";
import axios from "axios";

// 普通资源
const axiosBase = axios.create({
  timeout: 0,
});

axiosBase.interceptors.request.use((config) => {
  return config;
});

axiosBase.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 认证资源
const axiosAuth = axios.create({
  timeout: 0,
});

axiosAuth.interceptors.request.use((config) => {
  const settingStore = useSettingStore();
  const token = settingStore.setting.user.token;
  if (token !== null) {
    config.headers.Authorization = `Basic ${token}`;
  } else {
    alert("请填入token或seed");
    // const access_token = await refresh_access_token();
    // user_store.user_auth.access_token = access_token;
    // config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

axiosAuth.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { axiosAuth, axiosBase };
