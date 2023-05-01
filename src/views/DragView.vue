<template>
  <b>Wellcome To Clone LandingPage Beta =))</b>
  <div>Click to button "Show Demo" to see magic!</div>
  <div class="menu">
    <RouterLink to="/demo">
      <el-button>Show Demo</el-button>
    </RouterLink>
    <br />
    <el-button @click="global.saveData">Save</el-button>
    <br />
    <el-button @click="addTextItem">addText</el-button>
    <br />
    <el-button @click="global.data.container.height += 50">+ Height</el-button>
    <br />
    <el-button @click="global.data.container.height -= 50">- Height</el-button>
  </div>
  <div class="drag_view" :style="global.getStyleContainer()">
    <div class="container_view">
      <div class="full">
        <div class="p-options" v-for="item in global.data.listItem" :key="item.id">
          <DragItem v-if="item.active" :id="item.id" :boxItem="item.boxItem">
            <div class="full-w-h" v-html="item.content"></div>
            <el-row class="options">
              <el-button @click="copyItem(item)">Copy</el-button>
              <el-button type="danger" @click="removeItem(item)">delete</el-button>
              <el-button type="primary" @click="openEditor(item)">Edit Text</el-button>
            </el-row>
          </DragItem>
          <ShowDragItem v-else :item="item" @click="clickToItem(item)" isDev></ShowDragItem>
        </div>
        <div
          class="line-h"
          v-show="global.data.lineH.show"
          :style="{ left: `${global.data.lineH.position}px` }"
        ></div>
        <div
          class="line-w"
          v-show="global.data.lineW.show"
          :style="{ top: `${global.data.lineW.position}px` }"
        ></div>
      </div>
    </div>
  </div>

  <Vue3DraggableResizable
    :initW="600"
    :initH="26"
    :x="showEditor.x"
    :y="showEditor.y"
    :draggable="true"
    :resizable="false"
    class="p-draggable"
    v-if="showEditor.show"
  >
    <div class="e-title">
      <b>Editor</b>
      <button @click="showEditor.show = false">x</button>
    </div>
    <div class="editor">
      <editor
        v-model="showEditor.itemSelect.content"
        :init="{
          selector: '#articletextarea',
          plugins: [
            'advlist autolink lists link image charmap preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code',
            'insertdatetime media nonbreaking table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools codesample'
          ],
          toolbar:
            'codesample | bold italic sizeselect fontselect fontsizeselect | hr alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | insertfile undo redo | forecolor backcolor emoticons | code',
          fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
          height: '350',
          menubar: false
        }"
      />
    </div>
  </Vue3DraggableResizable>
</template>

<script setup>
import DragItem from '../components/DragItem.vue'
import { useGlobalStore } from '../stores/global'
const global = useGlobalStore()
import _ from 'lodash'

import Editor from '@tinymce/tinymce-vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import ShowDragItem from '../components/ShowDragItem.vue'

import { reactive, ref } from 'vue'
const showEditor = reactive({
  show: false,
  itemSelect: {},
  x: 0,
  y: 0
})
const itemChange = ref({})

const getNewBox = () => {
  return {
    id: Date.now().toString(),
    content: '<p>Text</p>',
    type: 'text',
    boxItem: {
      x: 0,
      y: 0,
      h: 50,
      w: 100,
      active: false
    }
  }
}

const addTextItem = () => {
  const newText = getNewBox()
  newText.type = 'text'
  newText.boxItem.x = 300
  newText.boxItem.y = 20
  global.data.listItem.push(newText)
}

const copyItem = (item) => {
  const newItem = _.cloneDeep(item)
  newItem.id = Date.now().toString()
  newItem.boxItem.x += 200
  global.data.listItem.push(newItem)
}

const removeItem = (item) => {
  global.data.listItem = global.data.listItem.filter((e) => e.id !== item.id)
}

const openEditor = (item) => {
  showEditor.x = item.boxItem.x + 200
  showEditor.y = item.boxItem.y
  showEditor.itemSelect = item
  showEditor.show = true
}

const clickToItem = (item) => {
  global.data.listItem.forEach((item) => {
    item.active = false
  })
  item.active = true
}
</script>

<style scoped>
.drag_view {
  padding-bottom: 100px;
  position: absolute;
  top: 100px;
  width: 100%;
}
.container_view {
  height: 100%;
  width: 1200px;
  border: 1px solid #ddd;
  margin: auto;
}
.full {
  height: 100%;
  width: 1200px;
  position: absolute;
}
.full-w-h {
  width: 100%;
  height: 100%;
}

.line-w {
  position: absolute;
  top: 100px;
  left: 0;
  height: 1px;
  width: 100%;
  background-color: red;
}
.line-h {
  position: absolute;
  top: 0;
  left: 100px;
  width: 1px;
  height: 100%;
  background-color: red;
}

.menu {
  position: fixed;
  top: 100px;
  left: 2px;
  z-index: 100;
  display: flex;
  flex-direction: column;
}
.e-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.editor {
  width: 600px;
  user-select: none;
}
.options {
  width: 500px;
  position: absolute;
  top: -40px;
  left: 0;
}
</style>

<style></style>
