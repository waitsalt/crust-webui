<script lang="ts" setup>
import router from "@/router";
import { useSettingStore } from "@/store/setting";
import type { StorageItem } from "@/type/setting";
import { formatSize, formatTimestamp, getFullPath } from "@/util";
import { ref } from "vue";
import { AiOutlineSearch, AiOutlineFile, AiOutlineFolder } from "vue-icons-plus/ai";

const settingStore = useSettingStore();

type functionType =
    | "search"
    | "upload"
    | "download"
    | "download"
    | "move"
    | "setting"
    | null;

const props = defineProps<{
    activeFunction: (chosen: functionType) => void;
    goPath: (path: string) => void;
}>();

const searchKey = ref<string>("");
const searchResult = ref<[storageItem: StorageItem, path: string][]>([]);
const search = () => {
    searchResult.value = settingStore.searchStorageItem(decodeURIComponent(searchKey.value));
}
const choose = (path: string) => {
    props.goPath(decodeURIComponent(path));
    props.activeFunction(null);
    console.log(path)
}

</script>

<template>
    <div class="searchContainer">
        <div class="searchBar">
            <input class="searchInput" v-model="searchKey"></input>
            <button @click="search()">
                <AiOutlineSearch />
            </button>
        </div>
        <div class="searchResultShow">
            <div class="storageThead">
                <label class="storageName">名称</label>
                <label class="storageSize">大小</label>
                <label class="storageUpdateTime">修改时间</label>
            </div>
            <div class="searchResultItem" v-for="result in searchResult" :key="result[1]" @click="choose(result[1])">
                <label class="storageName">
                    <div v-if="
                        result[0].type === 'file'
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
                        {{ result[0].name }}
                    </div>
                </label>
                <label class="storageSize">{{
                    formatSize(result[0].size)
                    }}</label>
                <label class="storageUpdateTime">{{
                    formatTimestamp(result[0].created)
                    }}</label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.searchContainer {
    width: 80%;
    height: 80%;
    margin: 0;
    padding: 20px;
    background-color: #24283b;
    border-radius: 10px;
    overflow: auto;
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
}

.searchBar {
    display: flex;
    gap: 20px;
    /* padding: 10px; */
}

.searchBar input {
    border: none;
    border-radius: 5px;
    padding: 10px;
    outline: none;
    background-color: #363b59;
    color: #fff;
}

.searchBar button {
    display: flex;
    border: none;
    border-radius: 5px;
    padding: 10px;
    outline: none;
    background-color: #363b59;
    color: #fff;
}

.searchResultShow {
    width: 90%;
    height: 100%;
    padding: 0px 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    background-color: #292e42;
    overflow: auto;
}

.storageThead,
.searchResultItem {
    display: flex;
    align-items: center;
    padding: 0px 10px;
    color: #c0caf5;
    height: 50px;
    transition: all 0.5s ease;
}

.storageThead {
    position: sticky;
    background-color: #292e42;
    top: 0;
}

.searchResultItem:hover {
    background-color: #545c7e;
    border-radius: 10px;
    /* cursor: pointer; */
    transform: scale(1.01);
}

.searchResultItem *:hover {
    cursor: pointer;
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
</style>
