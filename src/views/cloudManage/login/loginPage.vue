<template>
  <div class="box">
    <div>
      <div class="title">
        <div>思必驰</div>
        <div>设备云管平台</div>
      </div>
      <div class="btn-box">
        <a-button type="primary">登录</a-button>
        <a-button type="primary">注册</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
  };
</script>

<style scoped lang="less">
  .box {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    > div {
      box-shadow: 0 0 10px #eee;
      padding: 40px 180px;
      margin-top: -90px;
      .title {
        color: #2a7dc9;
        font-size: 24px;
      }
      .btn-box {
        margin-top: 120px;
        button {
          margin: 0 40px;
        }
      }
    }
  }
</style>
