<template lang="pug">
  .word
    .pinyin {{pinyin}}
    .hanzi {{word}}
</template>

<script>
import pinyin from 'pinyin'
export default {
  name: 'hanzi2pinyin',
  props: {
    word: {
      type: String,
      default: ''
    },
    adjust: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
      pinyin: ''
    }
  },
  created () {
    this.hanzi2pinyin()
  },
  methods: {
    hanzi2pinyin () {
      if (/^[\u4e00-\u9fa5]$/.test(this.word)) {
        this.pinyin = pinyin(this.word, {
          heteronym: true,
          segment: true
        })[0][this.adjust]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.word {
  display: inline-block;
  margin: .25em;
  text-align: center;
  text-indent: 0;
  .pinyin {
    height:1.2em;
  }
  .hanzi {
    line-height: 1.2;
  }
}
</style>
