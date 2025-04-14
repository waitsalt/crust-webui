<script lang="ts" setup>
import { AiOutlineDelete, AiOutlinePlus } from "vue-icons-plus/ai";

import { useSettingStore } from "@/store/setting";
import { ref } from "vue";

const props = defineProps<{
    updateCurrentStorageItem: () => void;
}>();

const settingStore = useSettingStore();

type selectPartType = "user" | "upload" | "download" | "pin";
const selectionChoose = ref<selectPartType>("user");
const chooseSelection = (choose: selectPartType) => {
    selectionChoose.value = choose;
};

// 导入 导出
const fileInput = ref<HTMLInputElement | null>(null);
const triggerFileUpload = () => {
    fileInput.value?.click();
};
const exportSettings = () => {
    const data = JSON.stringify(settingStore.setting);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crust-settings.json`;
    a.click();
    URL.revokeObjectURL(url);
};

const importSettings = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    try {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            const data = JSON.parse(e.target?.result as string);
            settingStore.updateSetting(data);
            props.updateCurrentStorageItem();
        };
    } catch (error) { }
    input.value = "";
};

// 用户界面
const userSeed = ref<string>(settingStore.setting.user.seed);
const userToken = ref<string>(settingStore.setting.user.token);
const saveUser = (type: string) => {
    if (type === "seed") {
        settingStore.setting.user.seed = userSeed.value;
    } else if (type === "token") {
        settingStore.setting.user.token = userToken.value;
    }
};

// 上传设置
const uploadUse = ref<string>(settingStore.setting.server.upload.use);
const uploadServerAdd = ref<string>("");
const addUploadServer = () => {
    settingStore.setting.server.upload.list.push(uploadServerAdd.value);
    uploadServerAdd.value = "";
};
const deleteUploadServer = (hostname: string) => {
    const index = settingStore.setting.server.upload.list.indexOf(hostname);
    settingStore.setting.server.upload.list.splice(index, 1);
};

// 下载设置
const downloadUse = ref<string>(settingStore.setting.server.download.use);
const downloadServerAdd = ref<string>("");
const addDownloadServer = () => {
    settingStore.setting.server.download.list.push(downloadServerAdd.value);
    downloadServerAdd.value = "";
};
const deleteDownloadServer = (hostname: string) => {
    const index = settingStore.setting.server.download.list.indexOf(hostname);
    settingStore.setting.server.download.list.splice(index, 1);
};

// 固定设置
const pinUse = ref<string>(settingStore.setting.server.pin.use);
const pinServerAdd = ref<string>("");
const addPinServer = () => {
    settingStore.setting.server.pin.list.push(pinServerAdd.value);
    pinServerAdd.value = "";
};
const deletePinServer = (hostname: string) => {
    const index = settingStore.setting.server.pin.list.indexOf(hostname);
    settingStore.setting.server.pin.list.splice(index, 1);
};

const chooseServerUse = (type: selectPartType, host: string) => {
    switch (type) {
        case "download":
            downloadUse.value = host;
            settingStore.setting.server.download.use = host;
            break;
        case "upload":
            uploadUse.value = host;
            settingStore.setting.server.upload.use = host;
            break;
        case "pin":
            pinUse.value = host;
            settingStore.setting.server.pin.use = host;
            break;
    }
};
</script>

<template>
    <div class="settingContainer">
        <div class="chooseSelection">
            <div class="leftSelection">
                <button class="chooseSelectionBtn" :class="{
                    chooseSelectionBtnActive: selectionChoose === 'user',
                }" @click="chooseSelection('user')">
                    用户
                </button>
                <button class="chooseSelectionBtn" :class="{
                    chooseSelectionBtnActive: selectionChoose === 'upload',
                }" @click="chooseSelection('upload')">
                    上传
                </button>
                <button class="chooseSelectionBtn" :class="{
                    chooseSelectionBtnActive:
                        selectionChoose === 'download',
                }" @click="chooseSelection('download')">
                    下载
                </button>
                <button class="chooseSelectionBtn" :class="{
                    chooseSelectionBtnActive: selectionChoose === 'pin',
                }" @click="chooseSelection('pin')">
                    固定
                </button>
            </div>
            <div class="rightSelection">
                <button class="chooseSelectionBtn" @click="triggerFileUpload()">
                    导入
                    <input ref="fileInput" type="file" accept=".json" @change="importSettings" hidden />
                </button>
                <button class="chooseSelectionBtn" @click="exportSettings()">
                    导出
                </button>
            </div>
        </div>
        <div class="chooseSelectionShow">
            <div class="showSelection" v-show="selectionChoose === 'user'">
                <div class="userInfo">
                    <label for="userSeedInput">种子</label>
                    <input type="text" id="userSeedInput" v-model="userSeed" />
                    <button @click="saveUser('seed')">保存</button>
                </div>
                <div class="userInfo">
                    <label for="userTokenInput">令牌</label>
                    <input type="text" id="userTokenInput" v-model="userToken" />
                    <button @click="saveUser('token')">保存</button>
                </div>
            </div>
            <div class="showSelection" v-show="selectionChoose === 'upload'">
                <div class="serverUse">当先使用: {{ uploadUse }}</div>
                <div class="serverAdd">
                    <div class="severHost">添加服务</div>
                    <input type="text" class="serverAddInput" v-model="uploadServerAdd" />
                    <div class="acctions">
                        <button class="serverAddBtn" @click="addUploadServer()">
                            <AiOutlinePlus />
                        </button>
                    </div>
                </div>
                <div class="serverList">
                    <div class="serverItem" :class="{ serverItemActive: server === uploadUse }" v-for="server in settingStore.setting.server.upload
                        .list" @click="chooseServerUse('upload', server)">
                        <div class="severHost">{{ server }}</div>
                        <div class="acctions">
                            <button class="serverDeleteBtn" @click.stop="deleteUploadServer(server)">
                                <AiOutlineDelete />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="showSelection" v-show="selectionChoose === 'download'">
                <div class="serverUse">当先使用: {{ downloadUse }}</div>
                <div class="serverAdd">
                    <div class="severHost">添加服务</div>
                    <input type="text" class="serverAddInput" v-model="downloadServerAdd" />
                    <div class="acctions">
                        <button class="serverAddBtn" @click="addDownloadServer()">
                            <AiOutlinePlus />
                        </button>
                    </div>
                </div>
                <div class="serverList">
                    <div class="serverItem" :class="{ serverItemActive: server === downloadUse }" v-for="server in settingStore.setting.server.download
                        .list" @click="chooseServerUse('download', server)">
                        <div class="severHost">{{ server }}</div>
                        <div class="acctions">
                            <button class="serverDeleteBtn" @click="deleteDownloadServer(server)">
                                <AiOutlineDelete />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="showSelection" v-show="selectionChoose === 'pin'">
                <div class="serverUse">当先使用: {{ pinUse }}</div>
                <div class="serverAdd">
                    <div class="severHost">添加服务</div>
                    <input type="text" class="serverAddInput" v-model="pinServerAdd" />
                    <div class="acctions">
                        <button class="serverAddBtn" @click="addPinServer()">
                            <AiOutlinePlus />
                        </button>
                    </div>
                </div>
                <div class="serverList">
                    <div class="serverItem" :class="{ serverItemActive: server === pinUse }"
                        v-for="server in settingStore.setting.server.pin.list" @click="chooseServerUse('pin', server)">
                        <div class="severHost">{{ server }}</div>
                        <div class="acctions">
                            <button class="serverDeleteBtn" @click="deletePinServer(server)">
                                <AiOutlineDelete />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settingContainer {
    width: 80%;
    height: 80%;
    margin: 0;
    padding: 0;
    background-color: #24283b;
    border-radius: 10px;
    overflow: auto;
}

.chooseSelection {
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.leftSelection,
.rightSelection {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1f2335;
    padding: 10px;
    border-radius: 50px;
    gap: 10px;
}

.chooseSelectionBtn {
    border-radius: 50px;
    text-align: center;
    padding: 5px 20px;
    border: none;
    cursor: pointer;
    background-color: #1f2335;
    color: #414868;
    transition: all 0.5s ease;
}

.chooseSelectionBtn:hover {
    background-color: #737aa2;
    transform: scale(1.01);
    color: white;
}

.chooseSelectionBtnActive {
    color: white;
    background-color: #737aa2;
}

.functionBtn svg {
    width: 50px;
    height: 50px;
}


.showSelection {
    padding: 20px;
}

/* 用户信息部分 */
.userInfo {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.userInfo label {
    width: 80px;
    font-weight: 500;
    color: white;
}

.userInfo input {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    margin-right: 10px;
    transition: border-color 0.3s;

    color: white;
    background-color: #737aa2;
}

.userInfo input:focus {
    border-color: #4299e1;
    outline: none;
}

.userInfo button {
    padding: 8px 16px;
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.userInfo button:hover {
    background-color: #3182ce;
}

/* 服务器使用提示 */
.serverUse {
    position: sticky;
    top: 80px;
    font-size: 15px;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 20px;
    background-color: #1f2335;
}

/* 服务器添加区域 */
.serverAdd {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    color: #c0caf5;
}

.severHost {
    width: 100px;
    font-weight: 500;
}

.serverAddInput {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 10px;
    margin-right: 10px;
    background-color: #1f2335;
}

.serverAddBtn {
    padding: 8px;
    background-color: #48bb78;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.serverAddBtn:hover {
    background-color: #38a169;
}

/* 服务器列表 */
.serverList {
    border: 1px solid #a9b1d6;
    border-radius: 4px;
    overflow: hidden;
}

.serverItem {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #a9b1d6;
    transition: background-color 0.3s;
    cursor: pointer;
    background-color: #1f2335;
}

.serverItem:last-child {
    border-bottom: none;
}

.serverItem:hover {
    background-color: #414868;
}

.serverItemActive {
    background-color: #414868;
}

.serverItem .severHost {
    flex: 1;
    color: #c0caf5;
}

.actions {
    display: flex;
    gap: 8px;
}

.serverDeleteBtn {
    padding: 6px;
    background-color: #f56565;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.serverDeleteBtn:hover {
    background-color: #e53e3e;
}

/* 图标大小调整 */
.serverAddBtn svg,
.serverDeleteBtn svg {
    width: 16px;
    height: 16px;
}
</style>
