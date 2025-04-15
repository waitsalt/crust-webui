<script lang="ts" setup>
import { uploadFile } from "@/service/upload";
import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import type { Task } from "@/type/task";
import { formatSize, taskFromFile } from "@/util";
import { computed } from "vue";
import { ref } from "vue";

const taskStore = useTaskStore();
const settingStore = useSettingStore();
const currentTask = computed(() => {
    switch (selectionChoose.value) {
        case "doing":
            return Array.from(taskStore.taskMap.values());
        case "success":
            return taskStore.successTaskList;
        case "failed":
            return taskStore.failedTaskList;
        default:
            return [];
    }
});

type selectPartType = "doing" | "success" | "failed";
const selectionChoose = ref<selectPartType>("doing");
const chooseSelection = (choose: selectPartType) => {
    selectionChoose.value = choose;
};

const showStatus = (task: Task): string => {
    switch (task.upload.status) {
        case "wait":
            return "等待中";
        case "error":
            return "上传失败";
        case "start":
            return "上传中";
        case "success":
            switch (task.pin.status) {
                case "start":
                    return "固定中";
                case "success":
                    return "成功";
                case "error":
                    return "固定失败";
                case "wait":
                    return "等待中";
            }
    }
};

// 上传处理
const fileInput = ref<HTMLInputElement | null>(null);
const folderInput = ref<HTMLInputElement | null>(null);
const triggerFileUpload = () => {
    fileInput.value?.click();
};
const triggerFolderUpload = () => {
    folderInput.value?.click();
};
const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const path = window.location.pathname;
    if (files) {
        for (const file of files) {
            const task: Task = taskFromFile(path, file);
            taskStore.taskMap.set(task.id, task);
            taskStore.uploadPool.add(() => uploadFile(task));
        }
    }
    input.value = "";
};
const handleFolderUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const path = document.location.pathname;
    if (files) {
        for (const file of files) {
            const task: Task = taskFromFile(path, file);
            taskStore.taskMap.set(task.id, task);
            taskStore.uploadPool.add(() => uploadFile(task));
        }
    }
    input.value = "";
};

// 相关操作
// 清空列表
const clearList = (type: selectPartType) => {
    switch (type) {
        case "failed":
            taskStore.failedTaskList = [];
            break;
        case "success":
            taskStore.successTaskList = [];
            break;
    }
};
</script>

<template>
    <div class="uploadContainer">
        <div class="chooseSelection">
            <div class="leftSelection">
                <button class="chooseSelectionBtn" :class="{
                    chooseSelectionBtnActive: selectionChoose === 'doing',
                }" @click="chooseSelection('doing')">
                    进行中 ({{ taskStore.taskMap.size }})
                </button>
                <button class="chooseSelectionBtn" :class="{
                    chooseSelectionBtnActive: selectionChoose === 'success',
                }" @click="chooseSelection('success')">
                    已完成 ({{ taskStore.successTaskList.length }})
                </button>
                <button class="chooseSelectionBtn" :class="{
                    chooseSelectionBtnActive: selectionChoose === 'failed',
                }" @click="chooseSelection('failed')">
                    失败项 ({{ taskStore.failedTaskList.length }})
                </button>
            </div>
            <div class="rightSelectionContainer">
                <div class="rightSelection" v-show="selectionChoose === 'doing'">
                    <button class="chooseSelectionBtn" @click.stop="triggerFileUpload()">
                        上传文件
                        <input ref="fileInput" type="file" multiple hidden @change="handleFileUpload" />
                    </button>
                    <button class="chooseSelectionBtn" @click.stop="triggerFolderUpload()">
                        上传文件夹
                        <input ref="folderInput" type="file" webkitdirectory hidden @change="handleFolderUpload" />
                    </button>
                </div>
                <div class="rightSelection" v-show="selectionChoose === 'success'">
                    <button class="chooseSelectionBtn" @click="clearList('success')">清空列表</button>
                </div>
                <div class="rightSelection" v-show="selectionChoose === 'failed'">
                    <button class="chooseSelectionBtn">重试全部</button>
                    <button class="chooseSelectionBtn" @click="clearList('failed')">清空列表</button>
                </div>
            </div>
        </div>
        <div class="chooseSelectionShow">
            <div class="showThead">
                <div class="showName">文件名</div>
                <div class="showSize">大小</div>
                <div class="showProgress" v-show="selectionChoose === 'doing'">
                    进度
                </div>
                <div class="showStatus">状态</div>
                <div class="showAction">操作</div>
            </div>
            <div class="showBody">
                <div class="showItem" v-for="task in currentTask" :key="task.id">
                    <div class="showName">{{ task.name }}</div>
                    <div class="showSize">{{ formatSize(task.size) }}</div>
                    <div class="showProgress" v-show="selectionChoose === 'doing'">
                        <div class="progressContainer">
                            <div class="progressBar" :style="{ width: task.upload.progress + '%' }"></div>
                        </div>
                        <div class="progressText">
                            {{ task.upload.progress }}%
                        </div>
                    </div>
                    <div class="showStatus">
                        <span class="statusTag" :class="{
                            statusWaiting: task.upload.status === 'wait',
                            statusUploading: task.upload.status === 'start',
                            statusSuccess:
                                task.upload.status === 'success' &&
                                task.pin.status === 'success',
                            statusError:
                                task.upload.status === 'error' ||
                                task.pin.status === 'error',
                            statusProcessing: task.pin.status === 'start',
                        }">
                            {{ showStatus(task) }}
                        </span>
                    </div>
                    <div class="showAction"></div>
                </div>

                <div class="emptyState" v-if="currentTask.length === 0">
                    暂无{{
                        selectionChoose === "doing"
                            ? "进行中"
                            : selectionChoose === "success"
                                ? "已完成"
                                : "失败"
                    }}的任务
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.uploadContainer {
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
    padding: 20px 20px;
    z-index: 10;
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
    transition: all 0.3s ease;
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

.chooseSelectionShow {
    padding: 0 20px;
}

.showThead {
    position: sticky;
    top: 70px;
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 1fr 1fr;
    padding: 12px 16px;
    background-color: #1f2335;
    font-size: 14px;
    font-weight: 500;
    color: #a9b1d6;
    border-radius: 10px;
}

.showBody {
    padding: 0;
}

.showItem {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 1fr 1fr;
    border-radius: 10px;
    align-items: center;
    padding: 12px 16px;
    transition: all 0.2s ease;
}

.showItem:hover {
    background-color: #414868;
}

.showName {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.showSize {
    font-size: 13px;
    color: #a9b1d6;
}

.showProgress {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.progressContainer {
    width: 100%;
    height: 15px;
    background-color: #3b4261;
    border-radius: 12px;
    overflow: hidden;
}

.progressBar {
    height: 100%;
    background: #7aa2f7;
    transition: width 0.3s ease;
}

.progressText {
    width: 100px;
    text-align: center;
}

.showStatus {
    display: flex;
    padding: 0 10px;
}

.statusTag {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.statusWaiting {
    background-color: #e2e8f0;
    color: #475569;
}

.statusUploading {
    background-color: #bfdbfe;
    color: #1e40af;
}

.statusProcessing {
    background-color: #fef08a;
    color: #854d0e;
}

.statusSuccess {
    background-color: #dcfce7;
    color: #166534;
}

.statusError {
    background-color: #fee2e2;
    color: #991b1b;
}

.emptyState {
    padding: 40px 0;
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
}
</style>
