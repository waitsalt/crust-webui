<script lang="ts" setup>
import { useSettingStore } from "@/store/setting";
import type { FolderItem, StorageItem } from "@/type/setting";
import { onMounted } from "vue";
import { watch } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import {
    AiOutlineSetting,
    AiOutlineFile,
    AiOutlineFolder,
    AiOutlineCloudUpload,
    AiOutlineClose,
    AiOutlineDelete,
    AiOutlineCloudDownload,
} from "vue-icons-plus/ai";
import { BsArrowsMove } from "vue-icons-plus/bs";
import {
    formatSize,
    getFullPath,
    formatTimestamp,
    copyLink,
    downloadFile,
} from "@/util";

import uploadComp from "@/component/uploadComp.vue";
import settingComp from "@/component/settingComp.vue";
import deleteComp from "@/component/deleteComp.vue";
import downloadComp from "@/component/downloadComp.vue";
import MoveComp from "@/component/moveComp.vue";
import router from "@/router";

// 基础元素
const route = useRoute();
const settingStore = useSettingStore();

// 界面展示
const currentStorageItem = ref<StorageItem | null>(null);
const currentPathItemList = ref<{ name: string; path: string }[]>([]);

const updateCurrentStorageItem = () => {
    const path = router.currentRoute.value.path;
    const storageItem = settingStore.getStorageItem(path);
    currentStorageItem.value = storageItem;
};
const updateCurrentPathItemList = () => {
    const path = router.currentRoute.value.path;
    const segments = path.split("/").filter((item) => item !== "");
    const crumbs = [{ name: "home", path: "/" }]; getFullPath

    let accumulatedPath = "";
    for (const segment of segments) {
        accumulatedPath += `/${segment}`;
        crumbs.push({
            name: segment,
            path: accumulatedPath,
        });
    }
    currentPathItemList.value = crumbs;
};

// 选择框
const selectStorageItemList = ref<string[]>([]);
const selectAllStorageItem = () => {
    const selectLength = selectStorageItemList.value.length;
    const totalLength = (currentStorageItem.value as FolderItem).children
        .length;
    if (selectLength === totalLength) {
        selectStorageItemList.value = [];
    } else {
        selectStorageItemList.value = (
            currentStorageItem.value as FolderItem
        ).children.map((item) => item.name);
    }
};
const selectStorageItem = (storageItemName: string) => {
    const index = selectStorageItemList.value.indexOf(storageItemName);
    if (index === -1) {
        selectStorageItemList.value.push(storageItemName);
    } else {
        selectStorageItemList.value.splice(index, 1);
    }
};

// 功能面板
type functionType =
    | "search"
    | "upload"
    | "delete"
    | "download"
    | "move"
    | "setting"
    | null;
const functionActive = ref<functionType>(null);
const activeFunction = (choose: functionType) => {
    functionActive.value = choose;
    if (choose === null) {
        selectStorageItemList.value = [];
    }
};

// 标题变换
const changeTitle = () => {
    if (currentStorageItem.value === null) {
        document.title = `crust`;
    } else {
        document.title = `${currentStorageItem.value.name} | crust`;
    }
};

// 初始化
onMounted(async () => {
    updateCurrentStorageItem();
    updateCurrentPathItemList();
    changeTitle();
});

// 变量监听
watch(
    () => router.currentRoute.value.path,
    async () => {
        updateCurrentStorageItem();
        updateCurrentPathItemList();
        changeTitle();
        selectStorageItemList.value = [];
    },
);
</script>

<template>
    <div class="container">
        <div class="appHeader">
            <div class="leftSection">
                <div class="logo">
                    <a @click="router.push('/')">
                        <img src="/src/asset/image/favicon.ico" class="logo" alt="Logo" />
                    </a>
                </div>
                <div class="pathShow">
                    <template v-for="(crumb, index) in currentPathItemList" :key="crumb.path">
                        <router-link :to="crumb.path" class="pathItem">
                            {{ crumb.name }}
                        </router-link>
                        <span v-if="index < currentPathItemList.length - 1" class="pathSeparator">/</span>
                    </template>
                </div>
            </div>
        </div>
        <div class="storageContainer">
            <div class="storageShow">
                <div v-if="currentStorageItem === null">
                    <p>当前路经没有内容，请检查</p>
                </div>
                <div v-else-if="currentStorageItem.type === 'file'" class="fileShow">
                    <div class="fileShowIcon">
                        <AiOutlineFile class="fileShowIcon" />
                    </div>
                    <div class="fileShowMeta">
                        <h3 class="fileShowName">
                            {{ currentStorageItem.name }}
                        </h3>
                        <div class="fileShowInfo">
                            <span class="fileShowSize">{{
                                formatSize(currentStorageItem.size)
                                }}</span>
                            <span class="fileShowDate">{{
                                formatTimestamp(currentStorageItem.created)
                                }}</span>
                        </div>
                    </div>

                    <div class="fileShowActions">
                        <button class="fileShowActionCopyLink" @click="
                            copyLink(
                                `https://${settingStore.setting.server.download.use}/ipfs/${currentStorageItem.cid}?filename=${currentStorageItem.name}`,
                            )
                            ">
                            <span>复制链接</span>
                        </button>
                        <button class="fileShowActionDownload primary" @click="
                            downloadFile(
                                `https://${settingStore.setting.server.download.use}/ipfs/${currentStorageItem.cid}?filename=${currentStorageItem.name}`,
                                currentStorageItem.name,
                            )
                            ">
                            <span>下载</span>
                        </button>
                    </div>
                </div>
                <div v-else-if="currentStorageItem.type === 'folder'">
                    <div class="storageTable">
                        <div class="storageThead">
                            <input class="storageSelect" type="checkbox" :checked="currentStorageItem.children.length ===
                                selectStorageItemList.length
                                " @click="selectAllStorageItem()" />
                            <label class="storageName">名称</label>
                            <label class="storageSize">大小</label>
                            <label class="storageUpdateTime">修改时间</label>
                        </div>
                        <div class="storageContent">
                            <div class="childenItem" v-for="childenStorageItem in currentStorageItem.children" @click="
                                router.push(
                                    getFullPath(router.currentRoute.value.path, childenStorageItem.name)
                                )
                                ">
                                <input class="storageSelect" type="checkbox" :checked="selectStorageItemList.includes(
                                    childenStorageItem.name,
                                )
                                    " @click.stop="
                                        selectStorageItem(
                                            childenStorageItem.name,
                                        )
                                        " />
                                <label class="storageName" style="display: flex; align-content: center">
                                    <div v-if="
                                        childenStorageItem.type === 'file'
                                    ">
                                        <div class="fileIcon">
                                            <AiOutlineFile />
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="folderIcon">
                                            <AiOutlineFolder />
                                        </div>
                                    </div>
                                    <div>
                                        {{ childenStorageItem.name }}
                                    </div>
                                </label>
                                <label class="storageSize">{{
                                    formatSize(childenStorageItem.size)
                                    }}</label>
                                <label class="storageUpdateTime">{{
                                    formatTimestamp(childenStorageItem.created)
                                    }}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="functionChoosePanel">
            <button class="functionBtn" :class="{ functionBtnActive: functionActive === 'upload' }"
                @click="activeFunction('upload')" :disabled="currentStorageItem?.type === 'file'">
                <AiOutlineCloudUpload />
            </button>
            <button class="functionBtn" :class="{ functionBtnActive: functionActive === 'download' }"
                @click="activeFunction('download')" :disabled="selectStorageItemList.length === 0">
                <AiOutlineCloudDownload />
            </button>
            <button class="functionBtn" :class="{ functionBtnActive: functionActive === 'delete' }"
                @click="activeFunction('delete')" :disabled="selectStorageItemList.length === 0">
                <AiOutlineDelete />
            </button>
            <button class="functionBtn" :class="{ functionBtnActive: functionActive === 'move' }"
                @click="activeFunction('move')" :disabled="selectStorageItemList.length === 0">
                <BsArrowsMove />
            </button>
            <button class="functionBtn" :class="{ functionBtnActive: functionActive === 'setting' }"
                @click="activeFunction('setting')">
                <AiOutlineSetting />
            </button>
        </div>
        <div class="functionPanel" v-show="functionActive !== null" @click.self="activeFunction(null)">
            <button @click="activeFunction(null)" class="closeFunctionPanel">
                <AiOutlineClose />
            </button>
            <component :is="uploadComp" v-show="functionActive === 'upload'" />
            <component :is="downloadComp" :selectStorageItemList="selectStorageItemList"
                :activeFunction="activeFunction" v-show="functionActive === 'download'" />
            <component :is="settingComp" :updateCurrentStorageItem="updateCurrentStorageItem"
                v-show="functionActive === 'setting'" />
            <component :is="deleteComp" :updateCurrentStorageItem="updateCurrentStorageItem"
                :selectStorageItemList="selectStorageItemList" :activeFunction="activeFunction"
                v-show="functionActive === 'delete'" />
            <component :is="MoveComp" :updateCurrentStorageItem="updateCurrentStorageItem"
                :selectStorageItemList="selectStorageItemList" :activeFunction="activeFunction"
                v-show="functionActive === 'move'" />
        </div>
    </div>
</template>

<style scoped>
.container {
    margin: 0;
    padding: 0px 100px;
    overflow: auto;
}

.appHeader {
    position: sticky;
    position: -webkit-sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    top: 0;
}

.leftSection,
.rightSection {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    font-size: 15px;
}

.logo {
    width: 40px;
    height: 40px;
}

.pathShow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px;
}

.pathItem {
    color: #c0caf5;
}

.pathSeparator {
    color: #3b4261;
}

.storageContainer {
    margin: 0;
    padding: 0;
    overflow: auto;
    font-size: 15px;
}

.storageShow {
    padding: 15px 20px;
    border-radius: 10px;
    background-color: #292e42;
}

.fileShow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    color: #c0caf5;
}

.fileShowIcon {
    width: 100px;
    height: 100px;
}

.fileShowMeta {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fileShowName {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: white;
    word-break: break-all;
}

.fileShowInfo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.85rem;
    color: #a9b1d6;
}

.fileShowActions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
}

.fileShowActions button {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    background: #3b4261;
    color: #c0caf5;
}

.fileShowActions :hover {
    background-color: #1f2335;
}

.storageThead,
.childenItem {
    display: flex;
    align-items: center;
    padding: 0px 10px;
    color: #c0caf5;
    height: 50px;
    transition: all 0.5s ease;
}

.childenItem:hover {
    background-color: #545c7e;
    border-radius: 10px;
    /* cursor: pointer; */
    transform: scale(1.01);
}

.childenItem *:hover {
    cursor: pointer;
}

.storageThead {
    position: sticky;
    color: #737aa2;
    top: 0;
}

.storageSelect {
    width: 20px;
    height: 20px;
    margin-right: 20px;
}

.storageName {
    display: flex;
    align-items: center;
    width: 40%;
    gap: 5px;
}

.storageSize {
    width: 20%;
}

.storageUpdateTime {
    width: 20%;
}

.fileIcon svg,
.folderIcon svg {
    width: 30px;
    height: 30px;
    color: #7aa2f7;
}

.functionChoosePanel {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 30%;
    right: 20px;
    background-color: #292e42;
    border-radius: 50px;
    padding: 5px;
    gap: 5px;
}

.functionBtn {
    display: flex;
    border-radius: 50px;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background-color: #1f2335;
    color: #414868;
    transition: all 0.5s ease;
}

.functionBtn:hover {
    background-color: #737aa2;
    transform: scale(1.01);
    color: white;
}

.functionBtn:disabled {
    cursor: not-allowed;
    background-color: #1f2335;
}

.functionBtn svg {
    width: 50px;
    height: 50px;
}

.functionBtnActive {
    color: white;
    background-color: #737aa2;
}

.functionPanel {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.closeFunctionPanel {
    margin: 0;
    padding: 0;
    position: fixed;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: #4a5568;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
    z-index: 10;
    color: #e5e7eb;
}

.closeFunctionPanel:hover {
    background: #718096;
    transform: rotate(90deg);
}
</style>
