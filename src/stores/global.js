import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { rawData } from './rawData'
import { ElMessage } from 'element-plus'

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
    }
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

  return { data, getStyleContainer, saveData }
})
