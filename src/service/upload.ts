import { useSettingStore } from "@/store/setting";
import type { UploadFileResponse } from "@/type/crust";
import { useTaskStore } from "@/store/task";
import type { Task } from "@/type/task";
import { pin } from "./pin";
import { axiosAuth } from "@/util/axios";
import { getFullPath } from "@/util";
import type { FileItem } from "@/type/setting";

async function uploadFile(task: Task) {
  const settingStore = useSettingStore();
  const taskStore = useTaskStore();

  const formData = new FormData();
  formData.append("file", task.content, task.content.name);

  try {
    taskStore.updateUploadStatus(task.id, "start");
    taskStore.updatePinStatus(task.id, "wait");

    const uploadUrl = `https://${settingStore.setting.server.upload.use}/api/v0/add?pin=true&cid-version=1&hash=sha2-256`;
    let res: UploadFileResponse = await axiosAuth.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          // 计算上传进度百分比
          const percentCompleted = (
            (progressEvent.loaded * 100) /
            progressEvent.total
          ).toFixed(2);
          taskStore.updateUploadProgress(task.id, percentCompleted);
        }
      },
    });

    taskStore.updateUploadResponse(task.id, res);
    taskStore.updateUploadStatus(task.id, "success");

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
      cid: "",
      status: "failed",
      requestId: "",
    };

    // 检查是否存在 存在则更新 不存在则新建
    const storageItem = settingStore.getStorageItem(fullPath);
    if (storageItem !== null) {
      settingStore.updateStorageItem(fullPath, fileItem);
    } else {
      settingStore.addStorageItem(fullPath, fileItem);
    }

    taskStore.pinPool.add(() => pin(task));
  } catch {
    taskStore.updateUploadStatus(task.id, "error");

    taskStore.failedTaskList.push(task);
    taskStore.taskMap.delete(task.id);
  }
}

export { uploadFile };
