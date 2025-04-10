import type { PinStatus, UploadFileResponse } from "@/type/crust";
import type { Task, TaskStatus } from "@/type/task";
import { TaskPool } from "@/util/taskPool";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskStore = defineStore("task", () => {
  const pool = ref<TaskPool>(new TaskPool());
  const taskMap = ref<Map<string, Task>>(new Map());
  const successTaskList = ref<Task[]>([]);
  const failedTaskList = ref<Task[]>([]);

  function addTask(task: Task) {
    taskMap.value.set(task.id, task);
  }
  function updateUploadStatus(id: string, status: TaskStatus) {
    const task = taskMap.value.get(id);
    if (task) {
      task.upload.status = status;
    }
  }
  function updateUploadProgress(id: string, progress: string) {
    const task = taskMap.value.get(id);
    if (task) {
      task.upload.progress = progress;
    }
  }
  function updateUploadResponse(id: string, respronse: UploadFileResponse) {
    const task = taskMap.value.get(id);
    if (task) {
      task.upload.response = respronse;
    }
  }
  function updatePinResponse(id: string, response: PinStatus) {
    const task = taskMap.value.get(id);
    if (task) {
      task.pin.response = response;
    }
  }
  function updatePinStatus(id: string, status: TaskStatus) {
    const task = taskMap.value.get(id);
    if (task) {
      task.pin.status = status;
    }
  }

  return {
    pool,
    taskMap,
    successTaskList,
    failedTaskList,
    addTask,
    updateUploadResponse,
    updateUploadStatus,
    updateUploadProgress,
    updatePinResponse,
    updatePinStatus,
  };
});
