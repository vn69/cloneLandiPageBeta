<template>
  <div class="parent">
    <Vue3DraggableResizable
      :initW="boxItem.w"
      :initH="boxItem.h"
      v-model:x="boxItem.x"
      v-model:y="boxItem.y"
      v-model:w="boxItem.w"
      v-model:h="boxItem.h"
      v-model:active="boxItem.active"
      :draggable="true"
      :resizable="true"
      @activated="print('activated')"
      @deactivated="print('deactivated')"
      @drag-start="startDrag(boxItem)"
      @resize-start="print('resize-start')"
      @dragging="handleDrag"
      @resizing="print('resizing')"
      @drag-end="endDrag(boxItem)"
      @resize-end="print('resize-end')"
    >
      <slot></slot>
    </Vue3DraggableResizable>
  </div>
</template>

<script setup>
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
import _ from 'lodash'

import { useGlobalStore } from '../stores/global'
const global = useGlobalStore()

const props = defineProps({
  boxItem: Object,
  id: String
})

const print = (val) => {
  console.log(val)
}

const onResize = (x, y, w, h) => {
  props.boxItem.x = x
  props.boxItem.y = y
  props.boxItem.w = w
  props.boxItem.h = h
}

const checkPosition = (type, p, listPosition) => {
  const spaceAbosolute = 5
  const typeLine = type == 'x' ? 'h' : 'w'
  // position
  listPosition[typeLine].forEach((position) => {
    if (p > position - spaceAbosolute && p < position + spaceAbosolute) {
      // console.log('start position')
      setTimeout(() => {
        props.boxItem[type] = position
        showLine(typeLine, position)
      }, 0)
      return
    }
    // end position
    const space = type == 'x' ? props.boxItem.w : props.boxItem.h
    const endP = p + space
    if (endP > position - spaceAbosolute && endP < position + spaceAbosolute) {
      // console.log('end position', {endP, position})
      setTimeout(() => {
        props.boxItem[type] = position - space
        showLine(typeLine, position)
      }, 0)
      return
    }

    // RESET
    clearLine(typeLine)
  })
  // center position
  const typeCenterLine = type == 'x' ? 'centerH' : 'centerW'
  listPosition[typeCenterLine].forEach((position) => {
    const space = type == 'x' ? props.boxItem.w : props.boxItem.h
    const centerP = p + space / 2
    if (centerP > position - spaceAbosolute && centerP < position + spaceAbosolute) {
      // console.log('center position')
      setTimeout(() => {
        props.boxItem[type] = position - space / 2
        showLine(typeLine, position)
      }, 0)
      return
    }
    // RESET
    clearLine(typeLine)
  })
}

const showLine = (typeLine, position) => {
  if (typeLine == 'w') {
    global.data.lineW.position = position
    global.data.lineW.show = true
    return
  }
  if (typeLine == 'h') {
    global.data.lineH.position = position
    global.data.lineH.show = true
    return
  }
}

const clearLine = (typeLine) => {
  if (typeLine == 'w') {
    global.data.lineW.show = false
    return
  }
  if (typeLine == 'h') {
    global.data.lineH.show = false
    return
  }
}

const endDrag = () => {
  console.log("endDrag");
  global.handleDragItem(props.id)
  global.data.selectItem = null

  setTimeout(() => {
    clearLine('w')
    clearLine('h')
  }, 200)
}

const handleDrag = _.throttle(function (position) {
  onDrag(position)
}, 200)

const onDrag = (position) => {
  // check
  const x = position.x
  const y = position.y
  checkPosition('x', x, global.data.listPosition)
  checkPosition('y', y, global.data.listPosition)
}

const startDrag = (boxItem) => {
  console.log('startDrag')
  global.data.selectItem = _.cloneDeep(boxItem)

  let listW = [0]
  let listH = [0, 1200]
  let centerH = [600]
  let centerW = []

  global.data.listItem.forEach((item) => {
    if (item.id == props.id) {
      return
    }
    const startX = item.boxItem.x
    const startY = item.boxItem.y
    const centerX = item.boxItem.x + item.boxItem.w / 2
    const centerY = item.boxItem.y + item.boxItem.h / 2

    listH.push(startX)
    listW.push(startY)
    centerH.push(centerX)
    centerW.push(centerY)

    listH = _.uniq(listH)
    listW = _.uniq(listW)
    centerH = _.uniq(centerH)
    centerW = _.uniq(centerW)
  })
  global.data.listPosition.w = listW
  global.data.listPosition.h = listH
  global.data.listPosition.centerH = centerH
  global.data.listPosition.centerW = centerW
}

// options
</script>

<style scoped>
.parent {
  position: absolute;
  user-select: none;
}
::v-deep .vdr-container {
  border: 1px solid rgba(0, 0, 0, 0.114);
}
</style>
