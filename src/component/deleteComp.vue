<script lang="ts" setup>
import router from "@/router";
import { useSettingStore } from "@/store/setting";
import { getFullPath } from "@/util";

type functionType =
    | "search"
    | "upload"
    | "delete"
    | "download"
    | "move"
    | "setting"
    | null;

const props = defineProps<{
    updateCurrentStorageItem: () => void;
    selectStorageItemList: string[];
    activeFunction: (chosen: functionType) => void;
}>();

const settingStore = useSettingStore();
const delConfirm = () => {
    for (let i = 0; i < props.selectStorageItemList.length; i++) {
        const fullPath = getFullPath(
            router.currentRoute.value.path,
            props.selectStorageItemList[i],
        );
        settingStore.delStorageItem(fullPath);
    }
    props.activeFunction(null)
};
</script>

<template>
    <div class="deleteContainer">
        <h1>确认删除</h1>
        <div class="deleteStorageItemShow">
            <div class="deleteStorageItem" v-for="item in selectStorageItemList" :key="item">
                {{ item }}
            </div>
        </div>
        <div class="deleteAction">
            <button class="cancel" @click="props.activeFunction(null)">取消</button>
            <button class="confirm" @click="delConfirm()">确认</button>
        </div>
    </div>
</template>

<style scoped>
.deleteContainer {
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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.deleteContainer h1 {
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #f7768e;
    text-align: center;
}

.deleteStorageItemShow {
    flex: 1;
    margin-bottom: 24px;
    padding: 12px;
    background-color: #1a1b26;
    border-radius: 8px;
    max-height: 150px;
    overflow-y: auto;
}

.deleteStorageItem {
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: #414868;
    border-radius: 6px;
    font-size: 14px;
    word-break: break-word;
}

.deleteStorageItem:last-child {
    margin-bottom: 0;
}

.deleteAction {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.deleteAction button {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.deleteAction button.cancel {
    background-color: #565f89;
    color: #c0caf5;
}

.deleteAction button.cancel:hover {
    background-color: #7aa2f7;
    color: #1a1b26;
}

.deleteAction button.confirm {
    background-color: #f7768e;
    color: #1a1b26;
}

.deleteAction button.confirm:hover {
    background-color: #ff9aae;
}
</style>
