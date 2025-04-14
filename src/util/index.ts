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

function formatTimestamp(timestamp: number) {
  // 如果时间戳是10位数(秒)，需要乘以1000转换为毫秒
  // 如果是13位数(毫秒)，则直接使用
  const date = new Date(
    timestamp * (timestamp.toString().length === 10 ? 1000 : 1),
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// 复制连接
const copyLink = async (url: string) => {
  await navigator.clipboard.writeText(url);
};

export {
  uuid,
  getFullPath,
  formatSize,
  formatTimestamp,
  taskFromFile,
  downloadFile,
  copyLink,
};
