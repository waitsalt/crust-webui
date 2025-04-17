import { useSettingStore } from "@/store/setting";
import type { FileItem } from "@/type/setting";
import { axiosAuth } from "@/util/axios";
import type { PinStatus } from "@/type/crust";

async function localPin(fullPath: string, fileItem: FileItem) {
  const settingStore = useSettingStore();

  // let fullPath = "";
  const fileItemNew: FileItem = {
    type: "file",
    name: fileItem.name,
    size: fileItem.size,
    created: Date.now(),
    cid: fileItem.cid,
    status: "failed",
    requestId: "",
  };

  try {
    const pinUrl = `https://${settingStore.setting.server.pin.use}/psa/pins`;
    const pinRes: PinStatus = await axiosAuth.post(pinUrl, {
      cid: fileItem.cid,
      name: fileItem.name,
    });

    fileItemNew.status = "success";
    fileItemNew.requestId = pinRes.requestId;
  } catch { }

  // 检查是否存在 存在则更新 不存在则新建
  const storageItem = settingStore.getStorageItem(fullPath);
  if (storageItem !== null) {
    settingStore.updateStorageItem(fullPath, fileItemNew);
  } else {
    settingStore.addStorageItem(fullPath, fileItemNew);
  }
}

export { localPin };
