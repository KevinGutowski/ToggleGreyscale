import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/
let isRemoving

export default function() {
    let sketch = require('sketch')
    let UI = sketch.UI
    let ShapePath = sketch.ShapePath
    let Rectangle = sketch.Rectangle
    let Style = sketch.Style

    let doc = sketch.getSelectedDocument()
    let selection = doc.selectedLayers.layers

    if (!selection.length) {
        console.log('triggered')
        UI.message('Please select a layer')
        return
    }

    let correctSelection = selection.find(layer => (layer.type == 'Artboard' || layer.getParentArtboard()))

    if (!correctSelection) {
        UI.message('Please select artboards or a layers within an artboard')
        return
    }

    if (correctSelection.type == 'Artboard') {
        setInitialAction(correctSelection)
    } else {
        setInitialAction(correctSelection.getParentArtboard())
    }

    for (let i = 0; i < selection.length; i++) {
        let parentArtboard
        let frame
        let layer = selection[i]

        if (layer.type == 'Artboard') {
            parentArtboard = layer
        } else if (layer.getParentArtboard()) {
            parentArtboard = layer.getParentArtboard()
        }

        let greyscaleLayer = parentArtboard.layers.find(layer => layer.name == "Greyscale Layer")

        if (isRemoving) {
            removeGreyscaleLayer(greyscaleLayer)
            continue
        }

        frame = new Rectangle(0, 0, parentArtboard.frame.width, parentArtboard.frame.height)

        if (!greyscaleLayer) {
            let overlay = new ShapePath({
              parent: parentArtboard,
              frame: frame,
              name: "Greyscale Layer",
              style: { fills: ['#FFFFFF'], borders: [], blendingMode: Style.BlendingMode.Color },
              locked: true
            })
        }
    }
}

// determine whether or not to remove or add the greyscale layer
function setInitialAction(artboard) {
    if (artboard.layers.find(layer => layer.name == "Greyscale Layer")) {
        isRemoving = true
    } else {
        isRemoving = false
    }
}

function removeGreyscaleLayer(layer) {
  if (layer) {
    layer.remove()
    return true
  } else {
    return false
  }
}
