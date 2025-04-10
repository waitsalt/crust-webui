import { useSettingStore } from "@/store/setting";
import type { UploadFileResponse } from "@/type/crust";
import { useTaskStore } from "@/store/task";
import type { Task } from "@/type/task";
import { pin } from "./pin";
import { axiosAuth } from "@/util/axios";

// async function uploadStorageItem

async function uploadFile(task: Task) {
  const settingStore = useSettingStore();
  const taskStore = useTaskStore();

  const formData = new FormData();
  formData.append("file", task.content, task.content.name);

  try {
    taskStore.updateUploadStatus(task.id, "start");
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

    console.log(res);

    await pin(task);
  } catch {
    taskStore.updateUploadStatus(task.id, "error");
  }
  if (task.pin.status === "success" && task.upload.status === "success") {
    taskStore.successTaskList.push(task);
  } else {
    taskStore.failedTaskList.push(task);
  }
  taskStore.taskMap.delete(task.id);
}

export { uploadFile };
