<script setup lang="ts">
import { ref } from 'vue';
import { selectFile, parseLocalization, localizeSM, localizeEN, saveTextFile } from './utils';
import { listen } from '@tauri-apps/api/event'
import { writeText } from '@tauri-apps/api/clipboard';
import { message } from '@tauri-apps/api/dialog';

const smText = ref('');
const enText = ref('');
const title = ref('')

listen('import', async () => {
  const file = await selectFile();
  const table = parseLocalization(file);
  smText.value = localizeSM(table);
  enText.value = localizeEN(table);
})

async function copyText(text: string) {
  await writeText(text);
  await message('已复制至剪贴板');
}
</script>

<template>
  <input class="custom-title" placeholder="自定义标题..." v-model="title">
  <main>
    <p>l{{ title === '' ? '_' : `_${title}_` }}simp_chinese.yml</p>
    <p>l{{ title === '' ? '_' : `_${title}_` }}english.yml</p>
    <textarea v-model="smText" spellcheck="false" placeholder="请于菜单栏中导入所需文本表格..." wrap="off"></textarea>
    <textarea v-model="enText" spellcheck="false" placeholder="请于菜单栏中导入所需文本表格..." wrap="off"></textarea>
    <div class="buttons">
      <button class="copy" @click="copyText(smText)">复制</button>
      <button class="download"
        @click="saveTextFile(`l${title === '' ? '_' : `_${title}_`}simp_chinese`, smText)">下载</button>
    </div>
    <div class="buttons">
      <button class="copy" @click="copyText(enText)">复制</button>
      <button class="download" @click="saveTextFile(`l${title === '' ? `_${title}_` : '_'}english`, enText)">下载</button>
    </div>
  </main>
</template>

<style scoped lang="less">
.custom-title {
  display: block;
  margin: 12px auto 0;
  width: 180px;
}

main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content auto min-content;
  box-sizing: border-box;
  column-gap: 16px;
  row-gap: 16px;
  padding: 16px;
  width: 100vw;
  height: calc(100vh - 33px);


  p {
    margin: 0;
  }

  textarea {
    resize: none;
    width: calc(100%);
    box-sizing: border-box;
    border-radius: 8px;
    border: solid 1px rgba(128, 128, 128, 0.5);
    padding: 8px;
    overflow-y: auto;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: end;
    column-gap: 8px;
  }
}
</style>

