<template>
  <div class="icon-body">
    <el-input
      v-model="name"
      style="position: relative; margin-bottom: 5px"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="Icons" name="icons">
        <div class="icon-list">
          <div v-for="item of svgIcons" :key="item" @click="selectedIcon(item)">
            <svg-icon :icon-class="item" style="height: 30px; width: 16px" />
            <span>{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons" name="elementIcons">
        <div class="icon-list">
          <div v-for="item of elementIcons" :key="item" @click="selectedIcon('el-icon-' + item)">
            <i :class="'el-icon-' + item" style="height: 30px; width: 16px" />
            <span class="span1">{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'SelectIcon',
  data() {
    return {
      svgIcons,
      elementIcons,
      name: '',
      activeName: 'icons'
    }
  },
  methods: {
    filterIcons() {
      if (this.activeName === 'icons') {
        this.svgIcons = svgIcons
        if (this.name) {
          this.svgIcons = this.svgIcons.filter(
            (item) => item.indexOf(this.name) >= 0
          )
        }
      } else if (this.activeName === 'elementIcons') {
        this.elementIcons = elementIcons
        if (this.name) {
          this.elementIcons = this.elementIcons.filter(
            (item) => item.indexOf(this.name) >= 0
          )
        }
      }
    },
    handleClick(tab) {
      this.name = ''
      if (tab.name === 'icons') {
        this.svgIcons = svgIcons
      } else if (tab.name === 'elementIcons') {
        this.elementIcons = elementIcons
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.svgIcons = svgIcons
      this.elementIcons = elementIcons
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
    .span1 {
      display: inline-block;
      vertical-align: -0.6em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
