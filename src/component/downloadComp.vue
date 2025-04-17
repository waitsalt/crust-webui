<script lang="ts" setup>
import { useSettingStore } from "@/store/setting";
import { downloadFile } from "@/util";

type functionType =
    | "search"
    | "upload"
    | "download"
    | "download"
    | "move"
    | "setting"
    | null;

const props = defineProps<{
    selectStorageItemList: string[];
    activeFunction: (chosen: functionType) => void;
}>();

const settingStore = useSettingStore();
const downloadConfirm = () => {
    for (let i = 0; i < props.selectStorageItemList.length; i++) {
        const storageItem = settingStore.getStorageItem(
            props.selectStorageItemList[i],
        );
        if (storageItem !== null && storageItem.type === "file") {
            downloadFile(
                `https://${settingStore.setting.server.download.use}/ipfs/${storageItem.cid}?filename=${storageItem.name}`,
                storageItem.name,
            );
        }
    }
    props.activeFunction(null);
};
</script>

<template>
    <div class="downloadContainer">
        <h1>确认下载</h1>
        <div class="downloadStorageItemShow">
            <div class="downloadStorageItem" v-for="item in selectStorageItemList" :key="item">
                {{ item }}
            </div>
        </div>
        <div class="downloadAction">
            <button class="cancel" @click="props.activeFunction(null)">
                取消
            </button>
            <button class="confirm" @click="downloadConfirm()">确认</button>
        </div>
    </div>
</template>

<style scoped>
.downloadContainer {
    width: 400px;
    min-height: 250px;
    margin: 0 auto;
    padding: 24px;
    background-color: #24283b;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    color: #c0caf5;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.downloadContainer h1 {
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #f7768e;
    text-align: center;
}

.downloadStorageItemShow {
    flex: 1;
    margin-bottom: 24px;
    padding: 12px;
    background-color: #1a1b26;
    border-radius: 8px;
    max-height: 150px;
    overflow-y: auto;
}

.downloadStorageItem {
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: #414868;
    border-radius: 6px;
    font-size: 14px;
    word-break: break-word;
}

.downloadStorageItem:last-child {
    margin-bottom: 0;
}

.downloadAction {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.downloadAction button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.downloadAction button.cancel {
    background-color: #565f89;
    color: #c0caf5;
}

.downloadAction button.cancel:hover {
    background-color: #7aa2f7;
    color: #1a1b26;
}

.downloadAction button.confirm {
    background-color: #f7768e;
    color: #1a1b26;
}

.downloadAction button.confirm:hover {
    background-color: #ff9aae;
}
</style>
