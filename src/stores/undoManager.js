import undoManager from "undo-manager" // require the lib from node_modules
let singleton = undefined

if (!singleton) {
  singleton = new undoManager()
}

export default singleton
