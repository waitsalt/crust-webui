<script lang="ts" setup>
import { useSettingStore } from "@/store/setting";
import { getFullPath } from "@/util";
import { computed } from "vue";
import { watch } from "vue";
import { ref } from "vue";

const settingStore = useSettingStore();

type functionType =
    | "search"
    | "upload"
    | "delete"
    | "download"
    | "move"
    | "setting"
    | null;

const targetPath = ref<string>(decodeURIComponent(window.location.pathname));
const targetPathItemList = computed(() => {
    const path = targetPath.value;
    const segments = path.split("/").filter((item) => item !== "");
    const crumbs = [{ name: "home", path: "/" }];

    let accumulatedPath = "";
    for (const segment of segments) {
        accumulatedPath += `/${segment}`;
        crumbs.push({
            name: segment,
            path: accumulatedPath,
        });
    }
    return crumbs;
});

const targetfloderItem = computed(() => {
    const storageItem = settingStore.getStorageItem(targetPath.value);
    if (storageItem !== null && storageItem.type === "folder") {
        return storageItem.children.filter((item) => item.type === "folder");
    } else {
        return settingStore.setting.storage.children.filter(
            (item) => item.type === "folder",
        );
    }
});

const props = defineProps<{
    updateCurrentStorageItem: () => void;
    selectStorageItemList: string[];
    activeFunction: (chosen: functionType) => void;
}>();

const moveConfirm = () => {
    for (let i = 0; i < props.selectStorageItemList.length; i++) {
        settingStore.moveStorageItem(getFullPath(window.location.pathname, props.selectStorageItemList[i]), getFullPath(targetPath.value, props.selectStorageItemList[i]))
    }
    props.activeFunction(null);
};
</script>

<template>
    <div class="moveContainer">
        <div class="moveContent">
            <div class="leftRegion">
                <div class="title">选择的文件</div>
                <div class="selectStorageItemListShow">
                    <div class="selectStorageItem" v-for="storage in props.selectStorageItemList">
                        {{ storage }}
                    </div>
                </div>
            </div>
            <div class="rightRegion">
                <div class="title">选择目标目录</div>
                <div class="pathItemListShow">
                    <template v-for="(crumb, index) in targetPathItemList" :key="crumb.path">
                        <div @click="targetPath = crumb.path" class="pathItem">
                            {{ crumb.name }}
                        </div>
                        <span v-if="index < targetPathItemList.length - 1" class="pathSeparator">/</span>
                    </template>
                </div>
                <div class="selectShow">
                    <div class="folderItem" v-for="storageItem in targetfloderItem" @click="
                        targetPath = getFullPath(
                            targetPath,
                            storageItem.name,
                        )
                        ">
                        {{ storageItem.name }}
                    </div>
                    <div class="folderItemNone" v-show="targetfloderItem.length === 0">
                        没有目录
                    </div>
                </div>
            </div>
        </div>
        <div class="moveAction">
            <button class="moveCancel" @click="props.activeFunction(null)">
                取消
            </button>
            <button class="moveConfirm" @click="moveConfirm()">确认</button>
        </div>
    </div>
</template>

<style scoped>
.moveContainer {
    width: 40%;
    height: 40%;
    padding: 24px;
    gap: 20px;
    background-color: #24283b;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    color: #c0caf5;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.moveContent {
    display: flex;
    gap: 20px;
    height: 100%;
}

.leftRegion,
.rightRegion {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-content: center;
    gap: 10px;
}

.title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    /* color: #f7768e; */
    text-align: center;
}

.selectShow,
.selectStorageItemListShow {
    flex: 1;
    padding: 10px;
    background-color: #1a1b26;
    border-radius: 10px;
    overflow-y: auto;
}

.pathItemListShow {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    padding: 10px;
    background-color: #1a1b26;
    border-radius: 10px;
    gap: 10px;
    overflow-x: auto;
}

.pathItem {
    color: #c0caf5;
}

.pathItem:hover {
    color: #a9b1d6;
    cursor: pointer;
}

.pathSeparator {
    color: #3b4261;
}

.selectStorageItem,
.folderItem {
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: #414868;
    border-radius: 6px;
    font-size: 14px;
    word-break: break-word;
    transition: all 0.3s ease;
}

.selectStorageItem:hover {
    cursor: pointer;
    background: #3b4261;
}

.moveAction {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.moveAction button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #c0caf5;
    background-color: #1a1b26;
    transition: all 0.2s ease;
}

.moveAction button:hover {
    background-color: #414868;
}
</style>
