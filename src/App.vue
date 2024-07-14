<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  import 'dayjs/locale/zh-cn';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>

<style lang="less">
  .ant-table-cell-ellipsis {
    white-space: normal !important;
  }
  .vben-basic-drawer-header__back {
    display: none !important;
  }
  .ant-form-item-control-input-content {
    > div {
      max-width: 100%;
      > div {
        max-width: 100%;
      }
    }
  }
</style>
