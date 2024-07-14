<template>
  <a-button type="primary" @click="showDrawer">Open</a-button>
  <a-drawer
    v-model:visible="visible"
    class="custom-class"
    style="color: red"
    title="Basic Drawer"
    placement="right"
    @after-visible-change="afterVisibleChange"
  >
    <a-form :layout="formState.layout" :model="formState" v-bind="formItemLayout">
      <a-form-item label="Form Layout">
        <a-radio-group v-model:value="formState.layout">
          <a-radio-button value="horizontal">Horizontal</a-radio-button>
          <a-radio-button value="vertical">Vertical</a-radio-button>
          <a-radio-button value="inline">Inline</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Field A">
        <a-input v-model:value="formState.fieldA" placeholder="input placeholder" />
      </a-form-item>
      <a-form-item label="Field B">
        <a-input v-model:value="formState.fieldB" placeholder="input placeholder" />
      </a-form-item>
      <a-form-item :wrapper-col="buttonItemLayout.wrapperCol">
        <a-button type="primary">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, computed } from 'vue';
  import type { UnwrapRef } from 'vue';

  interface FormState {
    layout: 'horizontal' | 'vertical' | 'inline';
    fieldA: string;
    fieldB: string;
  }

  export default defineComponent({
    setup() {
      const visible = ref<boolean>(false);

      const afterVisibleChange = (bool: boolean) => {
        console.log('visible', bool);
      };

      const showDrawer = () => {
        visible.value = true;
      };
      // form
      const formState: UnwrapRef<FormState> = reactive({
        layout: 'horizontal',
        fieldA: '',
        fieldB: '',
      });
      const formItemLayout = computed(() => {
        const { layout } = formState;
        return layout === 'horizontal'
          ? {
              labelCol: { span: 4 },
              wrapperCol: { span: 14 },
            }
          : {};
      });
      const buttonItemLayout = computed(() => {
        const { layout } = formState;
        return layout === 'horizontal'
          ? {
              wrapperCol: { span: 14, offset: 4 },
            }
          : {};
      });
      return {
        visible,
        afterVisibleChange,
        showDrawer,
        formState,
        formItemLayout,
        buttonItemLayout,
      };
    },
  });
</script>
