import sketch, {
    UI,
    ShapePath,
    Rectangle,
    Style
} from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
    let doc = sketch.getSelectedDocument()
    let selection = doc.selectedLayers.layers

    if (!selection.length) {
        UI.message('Please select a layer')
        return
    }

    let correctSelection = selection.find(layer => (layer.type == 'Artboard' || layer.getParentArtboard()))

    if (!correctSelection) {
        UI.message('Please select artboards or a layers within an artboard')
        return
    }

    const artboard = getArtboard(correctSelection)
    const isRemoving = artboard.layers.find(layer => layer.name == "Greyscale Layer")

    for (let i = 0; i < selection.length; i++) {
        let parentArtboard
        let frame
        let layer = selection[i]

        parentArtboard = getArtboard(layer)

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

function removeGreyscaleLayer(layer) {
  if (layer) {
    layer.remove()
    return true
  } else {
    return false
  }
}

function getArtboard(maybeArtboard) {
    if (maybeArtboard.type == 'Artboard') {
        return maybeArtboard
    } else {
        return maybeArtboard.getParentArtboard()
    }
}
