<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <SysDictTable class="w-1/2" @dict-change="handleDictChange" />
    <SysDictItemTable class="w-1/2" :dictId="dictId" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import SysDictTable from './sysDictTable/index.vue';
  import SysDictItemTable from './sysDictItemTable/index.vue';

  const dictId = ref();
  // 字典选中事件
  function handleDictChange(value) {
    dictId.value = value;
  }
</script>
