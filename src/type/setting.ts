interface User {
  seed: string;
  token: string;
}

type StorageItem = FileItem | FolderItem;

interface FileItem {
  type: "file";
  name: string;
  size: number;
  cid: string;
  status: "success" | "failed";
  created: number;
  requestId: string;
}

interface FolderItem {
  type: "folder";
  name: string;
  size: number;
  created: number;
  children: StorageItem[];
}

interface Setting {
  user: User;
  skipExistStorageItem: boolean,
  server: {
    upload: {
      use: string,
      list: string[]
    }
    download: {
      use: string,
      list: string[]
    }
    pin: {
      use: string,
      list: string[]
    }
  }
  storage: FolderItem;
}

export type { User, FileItem, FolderItem, StorageItem, Setting };
