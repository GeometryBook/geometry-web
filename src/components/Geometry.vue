<template>
  <div :id="ggbContainerID"></div>
</template>

<script>
let strVal
export default {
  name: "Geometry",
  data () {
    let _this = this
    return {
      ggbContainerID: '',
      consState: '',
      pngBase64: '',
      imgBase64: '',
      ggbParams: {
        appName: "geometry",
        id: "ggb",
        ggbBase64: "",
        width: 700,
        height: 350,
        showResetIcon: true,
        showMenuBar: true,
        showToolBar: true,
        showAlgebraInput: true,
        scale: 1,
        borderColor: '#cccccc',
        appletOnLoad: function (api) {
          function addListener (objName) {
            printConstructionState()
          }
          function removeListener (objName) {
            printConstructionState()
          }
          function renameListener (oldObjName, newObjName) {
            printConstructionState()
          }
          function updateListener (objName) {
            strVal = api.getValueString(objName)

          }
          function clearListener () {
            _this.consState = ""
          }
          function printConstructionState () {
            let objNumber = api.getObjectNumber()
            let strState = "Current Construction State:" + "\n" + "Number of objects: " + objNumber
            for (let i = 0; i < objNumber; i++) {
              let strName = api.getObjectName(i);
              let strType = api.getObjectType(strName);
              let strCommand = api.getCommandString(strName)
              strState += "\n" + strType + " " + strName + ", " + strCommand
            }
            _this.consState = strState
          }
          api.registerAddListener(addListener)
          api.registerRemoveListener(removeListener)
          api.registerRenameListener(renameListener)
          api.registerClearListener(clearListener)
          api.registerUpdateListener(updateListener)

          let node = document.querySelector('.rightSide')
          if (node)
            var parent = node.parentElement
          if (node && parent)
            parent.removeChild(node)
        },
      },
    }
  },
  methods: {
    saveGbFile () {
      this.pngBase64 = ggb.getBase64()
      this.imgBase64 = ggb.getPNGBase64(1, true, undefined)
    },
    injectGGB (params, id) {
      this.ggbContainerID = id
      let applet = new GGBApplet(params)
      applet.inject(id)
    }
  },
  props: {
    GeomParams: Object
  },
  watch: {
    GeomParams: {
      handler (value) {
        if (value) {
          this.ggbContainerID = value.container
          this.ggbParams.ggbBase64 = value.params.ggbBase64
          this.ggbParams.showResetIcon = value.params.showResetIcon
          this.ggbParams.showMenuBar = value.params.showMenuBar
          this.ggbParams.showToolBar = value.params.showToolBar
          this.ggbParams.showAlgebraInput = value.params.showAlgebraInput
          this.injectGGB(this.ggbParams, this.ggbContainerID)
        }
      },
      deep: true,
      immediate: true
    },
  },
  created () {
  },
  mounted () {
  },
}

</script>

<style scoped>
#data {
  margin-top: 10px;
}
#data #Base64 {
  width: 500px;
  height: 300px;
  margin-top: 10px;
}
#data #construction {
  width: 200px;
  height: 300px;
  margin-left: 30px;
}
</style>