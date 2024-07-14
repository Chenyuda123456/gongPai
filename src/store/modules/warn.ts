import { defineStore } from 'pinia';

export const useWarnStore = defineStore('warn', {
  state() {
    // 存放的就是模块的变量
    return {
      isUpdate: false,
    };
  },
  getters: {
    // 相当于vue里面的计算属性，可以缓存数据
  },
  actions: {
    setIsUpdate: function () {
      this.isUpdate = !this.isUpdate;
    },
  },
});
