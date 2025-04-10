import type { PinStatus, UploadFileResponse } from "@/type/crust";
import { uuid } from "@/util";

type TaskStatus = "wait" | "start" | "success" | "error";

interface Task {
  id: string;
  name: string;
  path: string;
  size: number;
  content: File;
  upload: {
    status: TaskStatus;
    progress: string;
    response: null | UploadFileResponse;
  };
  pin: {
    status: TaskStatus;
    response: null | PinStatus;
  };
}

export type { Task, TaskStatus };
