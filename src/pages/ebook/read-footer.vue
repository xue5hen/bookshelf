<template lang="pug">
  transition(name="slide-up")
    .read-footer(v-show="show")
      transition(name="slide-left")
        .navigation-controller(v-show="tabContainerActive==='navigation'")
          ul.navigation-list(v-if="!navigationLoading",:style="{fontSize:fontSizeDefault + 'px'}")
            li(v-for="(v,i) in navigationList",:key="i",@click="setNavigation(v.href,i)") {{v.label}}
          span(v-else) 加载中...
      transition(name="fade")
        .navigation-mask(v-show="tabContainerActive==='navigation'",@click="clickNavigationMask")
      transition(name="slide-up")
        .read-footer-item.read-footer-tabcontainer(v-show="show && tabContainerShow")
          .progress-controller(v-show="tabContainerActive==='progress'")
            .progress-bar
              input.progress(type="range",min="0",max="100",step="1",v-model="progress",
              :disabled="progressLoading",@change="setProgress",ref="progress")
            .progress-text
              span {{progressLoading ? '加载中...' : progress + '%'}}
          .theme-controller(v-show="tabContainerActive==='theme'")
            .item(v-for="(v,i) in themeList",:key="i",@click="setTheme(i)")
              .theme-color(:class="'theme-' + v.name",:style="{background:v.style.body.background}")
              .theme-text
                span {{v.name}}
          .font-size-controller(v-show="tabContainerActive==='fontSize'")
            .left(:style="{fontSize: fontSizeList[0] + 'px',left:previewFontStyle[0]}")
              span A
            .center
              .item(v-for="(v,i) in fontSizeList",:key="i",@click="setFontSize(i)")
                .line-l
                .line-m
                .line-r
                .pointer-wrapper(v-show="i==fontSizeDefault")
                  .pointer
            .right(:style="{fontSize: fontSizeList[fontSizeList.length -1] + 'px',left:previewFontStyle[1]}")
              span A
      .read-footer-item.read-footer-tabbar
        .item(@click="clickTab('navigation')")
          i.iconfont.icon-menu
        .item(@click="clickTab('progress')")
          i.iconfont.icon-progress
        .item(@click="clickTab('theme')")
          i.iconfont.icon-theme
        .item(@click="clickTab('fontSize')")
          i.iconfont.icon-font
</template>

<script>
export default {
  name: 'readFooter',
  props: {
    show: {type: Boolean, default: false},
    navigationList: {type: Array, default: () => []},
    navigationLoading: {type: Boolean, default: true},
    progressDefault: {type: [Number, String], default: 0},
    progressLoading: {type: Boolean, default: true},
    themeList: {type: Array, default: () => []},
    themeDefault: {type: [Number, String], default: 0},
    fontSizeList: {type: Array, default: () => []},
    fontSizeDefault: {type: [Number, String], default: 0}
  },
  data () {
    return {
      tabContainerActive: '',
      progress: 0
    }
  },
  computed: {
    tabContainerShow () {
      return ['progress', 'theme', 'fontSize'].includes(this.tabContainerActive)
    },
    previewFontStyle () {
      let result = [0, 0]
      if (this.fontSizeList.length) {
        let d = this.fontSizeList.length * 4
        result = [
          `calc(${(100 / d).toFixed(3)}% - ${(8 / d).toFixed(3)}rem)`,
          `calc(${(8 / d).toFixed(3)}rem - ${(100 / d).toFixed(3)}%)`
        ]
      }
      return result
    }
  },
  methods: {
    clickTab (type) {
      this.tabContainerActive = type
    },
    setNavigation (href, index) {
      this.tabContainerActive = ''
      this.$emit('setNavigation', href)
      this.progress = parseInt((index - 1) * 100 / this.navigationList.length)
      localStorage.setItem('progressDefault', this.progress)
    },
    clickNavigationMask () {
      this.tabContainerActive = ''
    },
    setProgress () {
      this.$emit('setProgress', this.progress)
    },
    setTheme (index) {
      this.$emit('setTheme', index)
    },
    setFontSize (index) {
      this.$emit('setFontSize', index)
    }
  },
  watch: {
    show (n, o) {
      this.tabContainerActive = ''
    },
    progressDefault (n, o) {
      this.progress = n
    },
    progress (n, o) {
      this.$refs.progress.style.backgroundSize = `${n}% 100%`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixins';
.read-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  height: 4rem;
  box-shadow: 0 -0.2em 1em rgba(0,0,0,.15);
  background-color: #fff;
  .navigation-controller {
    position: fixed;
    left: 0;
    top:0;
    bottom: 0;
    width: 80%;
    padding: 1em;
    z-index: 10;
    background-color: #fff;
    @include center;
    .navigation-list {
      height: 100%;
      line-height: 2;
      overflow: auto;
    }
  }
  .navigation-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9;
    background-color: rgba(0,0,0,.5);
  }
  .read-footer-item {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    background-color: #fff;
    &.read-footer-tabcontainer {
      bottom: 100%;
      height: 6rem;
      box-shadow: 0 -0.2em 1em rgba(0,0,0,.15);
      .progress-controller {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        div {
          height: 50%;
          @include center;
          &.progress-bar {
            padding: 0 1em;
            .progress {
              flex-grow: 1;
              appearance: none;
              height: 2px;
              background: linear-gradient(#999, #999) no-repeat, #ddd;
              background-size: 0 100%;
              &::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 1px solid #ddd;
                background: #fff;
                box-shadow:  .1em .1em .5em rgba(0,0,0, .15);
              }
            }
          }
        }
      }
      .theme-controller {
        flex-grow: 1;
        display: flex;
        .item {
          width: 0;
          flex-grow: 1;
          padding: .5em;
          display: flex;
          flex-direction: column;
          div {
            height: 50%;
            &.theme-default {
              border: 1px solid #ccc;
            }
            &.theme-text {
              @include center()
            }
          }
        }
      }
      .font-size-controller {
        flex-grow: 1;
        display: flex;
        .left,.right {
          position: relative;
          width: 4rem;
          @include center;
        }
        .center {
          width: 0;
          flex-grow: 1;
          display: flex;
          .item {
            flex-grow: 1;
            display: flex;
            align-items: center;
            position: relative;
            .line-l,.line-r {
              height: 0;
              flex-grow: 1;
              border-top: 1px solid #bcbcbc;
            }
            .line-m {
              width: 0;
              height: 9px;
              border-left: 1px solid #bcbcbc;
            }
            &:first-child {
              .line-l {border-top-color: transparent;}
            }
            &:last-child {
              .line-r {border-top-color: transparent;}
            }
            .pointer-wrapper {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 50%;
              border: 1px solid #ccc;
              background: #fff;
              @include center;
              .pointer {
                width: 40%;
                height: 40%;
                border-radius: 50%;
                background: #666;
              }
            }
          }
        }
      }
    }
    &.read-footer-tabbar {
      bottom: 0;
      height: 4rem;
      .item {
        flex-grow: 1;
        @include center();
        .iconfont {
          font-size: 2.4rem;
        }
      }
    }
  }
}
</style>
