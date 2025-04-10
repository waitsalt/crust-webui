import { useSettingStore } from "@/store/setting";

function downloadStorageItem(path: string): boolean {
  const settingStore = useSettingStore();
  const storageItem = settingStore.getStorageItem(path);
  if (!storageItem) {
    console.error(`Storage item not found at path: ${path}`);
    return false;
  } else if (storageItem.type === "file") {
    const url = `https://${settingStore.setting.server.download.use}/ipfs/${storageItem.cid}?filename=${storageItem.name}`;
    downloadFile(url, storageItem.name);
    return true;
  } else {
    alert("不支持文件夹下载");
    console.error(`Cannot download directory at path: ${path}`);
    return false;
  }
}

function downloadFile(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


export { downloadStorageItem, downloadFile };
