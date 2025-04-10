import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import type { Task } from "@/type/task";
import type { PinStatus } f../ util / axiostype / crust";
import { getFullPath } from "@/util";
import type { FileItem } from "@/type/setting";
import { axiosAuth } from "@/util/axios";

async function pin(task: Task) {
  if (task.upload.response === null) {
    return;
  }
  const cid = task.upload.response.Hash;
  const name = task.upload.response.Name;
  const taskStore = useTaskStore();
  const settingStore = useSettingStore();
  try {
    taskStore.updatePinStatus(task.id, "start");
    const pinUrl = `https://${settingStore.setting.server.pin.use}/psa/pins`;
    const pinRes: PinStatus = await axiosAuth.post(pinUrl, {
      cid: cid,
      name: name,
    });
    taskStore.updatePinResponse(task.id, pinRes);
    taskStore.updatePinStatus(task.id, "success");

    const fullPath = getFullPath(task.path, task.content.webkitRelativePath);
    const fileItem: FileItem = {
      type: "file",
      name: task.content.name,
      size: task.content.size,
      created: Date.now(),
      cid: cid,
      requestId: pinRes.requestId,
    };
    settingStore.addStorageItem(fullPath, fileItem);
  } catch {
    taskStore.updatePinStatus(task.id, "error");
  }
}

export { pin };
