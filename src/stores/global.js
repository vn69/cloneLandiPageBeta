import { computed, nextTick, reactive } from 'vue'
import { defineStore } from 'pinia'
import { rawData } from './rawData'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
import undoManager from './undoManager'

export const useGlobalStore = defineStore('global', () => {
  const data = reactive({
    lineW: {
      show: false,
      position: 0
    },
    lineH: {
      show: false,
      position: 0
    },
    listPosition: {
      h: [],
      w: [],
      centerH: [600],
      centerW: []
    },
    listItem: [],
    container: {
      height: 1000
    },
    // drag undo redo
    selectItem: null,
    refresh: false
  })
  // INIT
  const localData = localStorage.getItem('web-data')
  let parseData
  if (localData) {
    parseData = JSON.parse(localData)
  } else {
    parseData = rawData
  }
  data.listItem = parseData.listItem
  data.container = { ...parseData.container }
  // END INIT

  const saveData = () => {
    const dataSave = {
      listItem: data.listItem,
      container: data.container
    }
    localStorage.setItem('web-data', JSON.stringify(dataSave))
    ElMessage({
      message: 'Save data successfully!',
      type: 'success'
    })
  }

  const getStyleContainer = () => {
    return {
      height: data.container.height + 'px'
    }
  }

  const getNewBox = (id) => {
    return {
      id,
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

  const addNewItem = (id) => {
    const newText = getNewBox(id)
    newText.type = 'text'
    newText.boxItem.x = 300
    newText.boxItem.y = 20
    data.listItem.push(newText)
  }

  const handleAddTextItem = () => {
    const newId = Date.now().toString()
    addNewItem(newId)
    undoManager.add({
      undo: () => removeItem(newId),
      redo: () => addNewItem(newId)
    })
  }
  const handleRemoveItem = (id) => {
    const backupIndex = data.listItem.findIndex((e) => e.id === id)
    const backup = data.listItem.find((e) => e.id === id)
    if (backup.id) {
      removeItem(id)
      undoManager.add({
        undo: () => data.listItem.splice(backupIndex, 0, backup),
        redo: () => removeItem(id)
      })
    }
  }

  const handleCopyItem = (item) => {
    const newId = Date.now().toString()
    const cloneItem = _.cloneDeep(item)
    copyItem(cloneItem, newId)
    undoManager.add({
      undo: () => removeItem(newId),
      redo: () => copyItem(cloneItem, newId)
    })
  }

  const removeItem = (id) => {
    data.listItem = data.listItem.filter((e) => e.id !== id)
  }

  const copyItem = (item, id) => {
    const newItem = _.cloneDeep(item)
    newItem.id = id
    newItem.boxItem.x += 200
    data.listItem.push(newItem)
    return newItem
  }

  const handleAddHeight = (number) => {
    addHeight(number)
    undoManager.add({
      undo: () => minusHeight(number),
      redo: () => addHeight(number)
    })
  }
  const handleMinusHeight = (number) => {
    minusHeight(number)
    undoManager.add({
      undo: () => addHeight(number),
      redo: () => minusHeight(number)
    })
  }

  const addHeight = (number) => {
    data.container.height += number
  }
  const minusHeight = (number) => {
    data.container.height -= number
  }

  const handleDragItem = async (id) => {
    const newItem = data.listItem.find((e) => e.id === id)
    const backupBox = _.cloneDeep(data.selectItem)
    const newBox = _.cloneDeep(newItem.boxItem)
    if (backupBox) {
      undoManager.add({
        undo: () => (newItem.boxItem = { ...backupBox }),
        redo: () => (newItem.boxItem = { ...newBox })
      })
    }
    data.refresh = true
  }

  return {
    data,
    getStyleContainer,
    saveData,
    handleAddTextItem,
    handleRemoveItem,
    handleCopyItem,
    handleAddHeight,
    handleMinusHeight,
    handleDragItem
  }
})
