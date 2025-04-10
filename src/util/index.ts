import type { Task } from "@/type/task";

function getFullPath(base: string, path: string) {
  return `/${base}/${path}`.replace(/\/+/g, "/");
}

function uuid(): string {
  var uuidValue = "",
    k,
    randomValue;
  for (k = 0; k < 32; k++) {
    randomValue = (Math.random() * 16) | 0;
    if (k == 8 || k == 12 || k == 16 || k == 20) {
      uuidValue += "-";
    }
    uuidValue += (
      k == 12 ? 4 : k == 16 ? (randomValue & 3) | 8 : randomValue
    ).toString(16);
  }
  return uuidValue;
}

const formatSize = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

function taskFromFile(path: string, file: File): Task {
  return {
    id: uuid(),
    name: file.name,
    path: path,
    size: file.size,
    content: file,
    upload: {
      status: "wait",
      progress: "00.00",
      response: null,
    },
    pin: {
      status: "wait",
      response: null,
    },
  };
}

function now() {
  const now = new Date();

  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);

  const formattedTime = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

export { uuid, getFullPath, formatSize, now, taskFromFile };
