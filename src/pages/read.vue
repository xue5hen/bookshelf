<template lang="pug">
  .article
    .title {{article.title}}
    template(v-for="section in article.content")
      .section(v-if="section.type==='section'")
        hanzi2pinyin(v-for="(word,i) of section.data",:word="word",:adjust="0",:key="i")
      .section(v-else-if="section.type==='picture'")
        img(:src="section.data")
</template>

<script>
import hanzi2pinyin from '@/components/hanzi2pinyin'
export default {
  name: 'read',
  components: {
    hanzi2pinyin
  },
  data () {
    return {
      article: {},
      adjusts: {}
    }
  },
  created () {
    this.getArticle()
  },
  methods: {
    getArticle () {
      this.article = {title: 'test', content: [{type: 'section', data: '测试一下'}]}
    }
  }
}
</script>

<style lang="scss" scoped>
  .article {
    min-height: 100vh;
    padding: 1em;
    font-size: 1.6rem;
    background-color: #faeab9;
    .title {
      font-size: 1.8rem;
      height: 2em;
      line-height: 2em;
      font-weight: 600;
      color: #967a4b;
      border-bottom: 1px solid #ab8a53;
      margin-bottom: .5em;
    }
    .section {
      text-indent: 2em;
    }
  }
</style>
