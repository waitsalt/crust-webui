import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import type { Task } from "@/type/task";
import { getFullPath } from "@/util";
import type { FileItem } from "@/type/setting";
import { axiosAuth } from "@/util/axios";
import type { PinStatus } from "@/type/crust";

async function pin(task: Task) {
  if (task.upload.response === null) {
    return;
  }
  const cid = task.upload.response.Hash;
  const name = task.upload.response.Name;
  const taskStore = useTaskStore();
  const settingStore = useSettingStore();

  let fullPath = "";
  if (task.content.webkitRelativePath === '') {
    fullPath = getFullPath(task.path, task.content.name);
  } else {
    fullPath = getFullPath(task.path, task.content.webkitRelativePath);
  }
  const fileItem: FileItem = {
    type: "file",
    name: task.content.name,
    size: task.content.size,
    created: Date.now(),
    cid: cid,
    status: "failed",
    requestId: "",
  };

  try {
    taskStore.updatePinStatus(task.id, "start");
    const pinUrl = `https://${settingStore.setting.server.pin.use}/psa/pins`;
    const pinRes: PinStatus = await axiosAuth.post(pinUrl, {
      cid: cid,
      name: name,
    });
    taskStore.updatePinResponse(task.id, pinRes);
    taskStore.updatePinStatus(task.id, "success");

    fileItem.status = "success";
    fileItem.requestId = pinRes.requestId;

  } catch {
    taskStore.updatePinStatus(task.id, "error");
  }

  // 检查是否存在 存在则更新 不存在则新建
  const storageItem = settingStore.getStorageItem(fullPath);
  if (storageItem !== null) {
    settingStore.updateStorageItem(fullPath, fileItem);
  } else {
    settingStore.addStorageItem(fullPath, fileItem);
  }

  if (task.pin.status === "success" && task.upload.status === "success") {
    taskStore.successTaskList.push(task);
  } else {
    taskStore.failedTaskList.push(task);
  }
  taskStore.taskMap.delete(task.id);
}

export { pin };
