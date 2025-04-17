<script setup lang="ts"></script>

<template>
    <div class="appContainer">
        <RouterView />
    </div>
</template>

<style scoped>
.appContainer {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #1f2335;
    color: white;
    font-family: system-ui;
    overflow: auto;
}
</style>
