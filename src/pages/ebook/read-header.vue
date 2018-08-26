<template lang="pug">
  transition(name="slide-down")
    .read-header(v-show="show")
      .left
        .item(@click="$router.go(-1)")
          i.iconfont.icon-back
      .right
        .item
          i.iconfont.icon-cart
        .item
          i.iconfont.icon-user
        .item
          i.iconfont.icon-more-vertical
</template>

<script>
export default {
  name: 'readHeader',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixins';
.read-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 2;
  display: flex;
  height: 4rem;
  box-shadow: 0 0.2em 1em rgba(0,0,0,.15);
  background-color: #fff;
  .left {
    display: flex;
    width: 4rem;
    margin-right: auto;
  }
  .right {
    display: flex;
    width: 12rem;
  }
  .item {
    flex-grow: 1;
    @include center();
    .iconfont {
      font-size: 2.4rem;
    }
  }
}
</style>
