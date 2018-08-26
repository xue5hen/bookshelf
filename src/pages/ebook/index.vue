<template lang="pug">
  .page.page-ebook
    .read-wrapper
      #read
      .read-mask
        .left(@click="pagePrev")
        .center(@click="showController=!showController")
        .right(@click="pageNext")
      read-header(:show="showController")
      read-footer(
        :show="showController",
        :navigationList="navigationList",:navigationLoading="navigationLoading",@setNavigation="setNavigation",
        :progressDefault="progressDefault",:progressLoading="progressLoading",@setProgress="setProgress",
        :fontSizeList="fontSizeList",:fontSizeDefault="fontSizeDefault",@setFontSize="setFontSize",
        :themeList="themeList",:themeDefault="themeDefault",@setTheme="setTheme"
      )
</template>

<script>
import Epub from 'epubjs'
import readHeader from './read-header'
import readFooter from './read-footer'
export default {
  name: 'Ebook',
  components: {
    readHeader,
    readFooter
  },
  props: {
    bookUrl: {
      type: String,
      default: '/static/data/ebook/三国演义.epub'
    }
  },
  data () {
    return {
      book: null,
      rendtion: null,
      locations: null,
      navigation: null,
      showController: false,
      navigationList: [],
      navigationLoading: true,
      progressDefault: 0,
      progressLoading: true,
      fontSizes: null,
      fontSizeDefault: 0,
      fontSizeList: [12, 14, 16, 18, 20, 22, 24],
      themes: null,
      themeDefault: 0,
      themeList: [
        {name: 'default', style: {body: {color: '#000', background: '#fff'}}},
        {name: 'eye', style: {body: {color: '#000', background: '#ceeaba'}}},
        {name: 'night', style: {body: {color: '#fff', background: '#000'}}},
        {name: 'gold', style: {body: {color: '#000', background: '#f1ece2'}}}
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.showEpub()
    })
  },
  methods: {
    showEpub () {
      // 生成Book
      this.book = new Epub(this.bookUrl)
      // 生成Rendition
      this.rendtion = this.book.renderTo('read')
      // 渲染电子书
      this.rendtion.display()
      // 获取主题themes对象 && 注册主题样式 && 使用默认样式
      this.themes = this.rendtion.themes
      this.themeList.forEach((v) => {
        this.themes.register(v.name, v.style)
      })
      this.themeDefault = localStorage.getItem('themeDefault') || 0
      this.themes.select(this.themeList[this.themeDefault].name)
      // 使用默认字体大小
      this.fontSizeDefault = localStorage.getItem('fontSizeDefault') || 0
      this.setFontSize(this.fontSizeDefault)
      // 获取Locations对象 && 读写电子书进度
      this.book.ready.then(() => {
        return this.book.locations.generate()
      }).then((res) => {
        this.navigation = this.book.navigation
        this.navigationList = this.navigation ? (this.navigation.toc || []) : []
        this.locations = this.book.locations
        this.progressDefault = localStorage.getItem('progressDefault') || 0
        this.setProgress(this.progressDefault)
        this.progressLoading = false
        this.navigationLoading = false
      })
    },
    pagePrev () {
      // 向上翻页
      if (this.rendtion) {
        this.rendtion.prev()
      }
    },
    pageNext () {
      // 向下翻页
      if (this.rendtion) {
        this.rendtion.next()
      }
    },
    setNavigation (href) {
      this.showController = false
      this.rendtion.display(href)
    },
    setProgress (progress) {
      let percentage = progress / 100
      let location = percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0
      this.rendtion.display(location)
      localStorage.setItem('progressDefault', progress)
    },
    setTheme (index) {
      if (this.themes) {
        this.themes.select(this.themeList[index].name)
        this.themeDefault = index
        localStorage.setItem('themeDefault', index)
      }
    },
    setFontSize (index) {
      if (this.themes) {
        this.fontSizeDefault = index
        localStorage.setItem('fontSizeDefault', index)
        this.themes.fontSize(this.fontSizeList[index] + 'px')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/mixins';
.read-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  #read {
    height: 100%;
  }
  .read-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
    .left {
      width: 10rem;
    }
    .center {
      width: 0;
      flex-grow: 1;
    }
    .right {
      width: 10rem;
    }
  }
}
</style>
