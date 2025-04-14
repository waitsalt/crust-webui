import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { FolderItem, Setting, StorageItem } from "@/type/setting";
import { uuid } from "@/util";

export const useSettingStore = defineStore("setting", () => {
  const setting = ref<Setting>({
    user: {
      seed: "angry heavy speed build derive buffalo service page indoor crunch pioneer ritual",
      token:
        "c3Vic3RyYXRlLWNUS0Vkbm5uUWdKY1V2eDZ4QXdGV2hlcTZLcXk4b3lwQUdrV3ZteWhTUVRWTnVvYXU6MHg2ZWNjOWMwZWZiNTc2Y2NiMjE5ZWJkNzJjYmExYzA3YmJkOGEwMTcyZmQ4NGNlM2Y3MTQ4MThjODhjMjZhOTdmNWRkZTAwZGQwMzY3MjJhODA1NjUxMjg2OWRiYjU0OGY4MTNiNzUyY2E1NmE5MDc1ODU2OTA5MjIzMjEyMWU4OA==",
    },
    server: {
      pin: {
        use: "pin.crustcode.com",
        list: ["pin.crustcode.com"],
      },
      upload: {
        use: "gw.crustfiles.net",
        list: [
          "gw.crustfiles.net",
          "gw.crustgw.work",
          "crustipfs.xyz",
          "gw.smallwolf.me",
          "ipfs-gw.decloud.foundation",
          "gw.w3ipfs.com:7443",
          "gw.w3ipfs.cn:10443",
          "gw.w3ipfs.net:7443",
          "cru.izhong.top",
          "gw.w3ipfs.org.cn",
        ],
      },
      download: {
        use: "gw.crustgw.work",
        list: [
          "gw.crustgw.work",
          "gw.crustgw.org",
          "gw.crust-gateway.com",
          "gw.crust-gateway.xyz",
          "gw.w3ipfs.org.cn",
          "ipfs.io",
        ],
      },
    },
    storage: {
      type: "folder",
      name: "root",
      size: 0,
      created: Date.now(),
      children: [
        // {
        //   type: "folder",
        //   name: "root",
        //   size: 0,
        //   created: Date.now(),
        //   children: [{
        //     type: "folder",
        //     name: "root",
        //     size: 0,
        //     created: Date.now(),
        //     children: [],
        //   }],
        // }, {
        //   type: "folder",
        //   name: "root2",
        //   size: 0,
        //   created: Date.now(),
        //   children: [
        //     {
        //       type: "folder",
        //       name: "root",
        //       size: 0,
        //       created: Date.now(),
        //       children: [{
        //         type: "folder",
        //         name: "root",
        //         size: 0,
        //         created: Date.now(),
        //         children: [],
        //       }],
        //     }
        //   ],
        // }
      ],
    },
  });

  function updateSetting(newSetting: Setting) {
    setting.value = newSetting;
  }

  function getStorageItem(fullPath: string): StorageItem | null {
    const pathItemList = fullPath
      .split("/")
      .filter((pathItem) => pathItem !== "");
    let current = setting.value.storage;
    if (pathItemList.length === 0) return current;
    for (let index = 0; index < pathItemList.length - 1; index++) {
      const pathItem = pathItemList[index];
      const child = current.children.find((child) => child.name === pathItem);
      if (!child || child.type !== "folder") return null;
      current = child;
    }
    const result = current.children.find(
      (child) => child.name === pathItemList[pathItemList.length - 1],
    );
    if (result === undefined) return null;
    return result;
  }

  function addStorageItem(
    folderPath: string,
    storageItem: StorageItem,
  ): boolean {
    const pathItemList = folderPath
      .split("/")
      .filter((pathItem) => pathItem !== "");
    let current = setting.value.storage;
    if (pathItemList.length === 0) {
      current.children.push(storageItem);
      current.size += storageItem.size;
      return true;
    }
    for (let index = 0; index < pathItemList.length - 1; index++) {
      const pathItem = pathItemList[index];
      const child = current.children.find((child) => child.name === pathItem);
      if (!child) {
        const folderItem: FolderItem = {
          type: "folder",
          name: pathItem,
          size: 0,
          created: Date.now(),
          children: [],
        };
        current.children.push(folderItem);
        current = folderItem;
      } else if (child.type === "file") {
        return false;
      } else {
        current = child;
      }
    }
    const child = current.children.find(
      (child) => child.name === storageItem.name,
    );
    if (!child) {
      current.children.push(storageItem);
    } else {
      storageItem.name += `_${uuid()}`;
      current.children.push(storageItem);
    }
    return true;
  }

  function delStorageItem(fullPath: string): boolean {
    // 1. 拆分路径并过滤空项
    const pathItemList = fullPath
      .split("/")
      .filter((pathItem) => pathItem !== "");

    // 如果路径为空，直接返回false
    if (pathItemList.length === 0) return false;

    // 2. 初始化当前目录为根存储
    let current = setting.value.storage;

    // 3. 遍历到目标项的父目录
    for (let index = 0; index < pathItemList.length - 1; index++) {
      const pathItem = pathItemList[index];
      const child = current.children.find((child) => child.name === pathItem);

      // 如果找不到子项或子项不是文件夹，返回false
      if (!child || child.type !== "folder") return false;

      current = child;
    }

    // 4. 获取要删除的项名称
    const targetName = pathItemList[pathItemList.length - 1];

    // 5. 查找目标项在父目录中的索引
    const targetIndex = current.children.findIndex(
      (item) => item.name === targetName,
    );

    // 6. 如果找不到目标项，返回false
    if (targetIndex === -1) return false;

    // 7. 从父目录的children数组中删除目标项
    current.children.splice(targetIndex, 1);

    // 8. 返回删除成功
    return true;
  }

  function moveStorageItem(
    beforeFullPath: string,
    afterFolderPath: string,
  ): boolean {
    const storageItem = getStorageItem(beforeFullPath);
    if (storageItem === null) return false;
    const result = addStorageItem(afterFolderPath, storageItem);
    if (result === true) {
      return delStorageItem(beforeFullPath);
    } else {
      return false;
    }
  }

  function searchStorageItemInFolder(
    keyword: string,
    folderPath: string,
  ): StorageItem[] {
    let results: StorageItem[] = [];
    const folder = getStorageItem(folderPath);
    if (!folder || folder.type === "file") return [];
    for (const item of folder.children) {
      // 检查当前项名称是否包含关键词（不区分大小写）
      if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
        results.push(item);
      }
    }
    return results;
  }

  function searchStorageItem(
    keyword: string,
  ): [storageItem: StorageItem, path: string][] {
    const results: [StorageItem, string][] = [];

    // 递归搜索函数
    function searchInFolder(folder: FolderItem, currentPath: string) {
      for (const item of folder.children) {
        const itemPath = `${currentPath}/${item.name}`;

        // 检查当前项名称是否包含关键词（不区分大小写）
        if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
          results.push([item, itemPath]);
        }

        // 如果是文件夹，递归搜索其子项
        if (item.type === "folder") {
          searchInFolder(item, itemPath);
        }
      }
    }

    // 从根存储开始搜索，根路径为"/"
    searchInFolder(setting.value.storage, "");

    return results;
  }

  return {
    setting,
    updateSetting,
    getStorageItem,
    delStorageItem,
    addStorageItem,
    moveStorageItem,
    searchStorageItemInFolder,
    searchStorageItem,
  };
});
