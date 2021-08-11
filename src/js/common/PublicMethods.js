/**
 * 给静态图片添加鼠标滚动事件，动态改变图片大小
 * @param {*} elmnt 图片的DOM结点
 */
export function zoomElement(elmnt) {
  if (elmnt.addEventListener) {
    // IE9, Chrome, Safari, Opera
    elmnt.addEventListener('mousewheel', MouseWheelHandler, false)
    // Firefox
    elmnt.addEventListener('DOMMouseScroll', MouseWheelHandler, false)
  }

  let i = 1
  function MouseWheelHandler (e) {
    // cross-browser wheel delta
    const event = window.event || e // old IE support
    event.preventDefault()
    const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))
    if (delta === 1) {
      if (elmnt.getBoundingClientRect().width > 295) {
        i = 0
      } else {
        i = 5
      }
      elmnt.style.width = elmnt.getBoundingClientRect().width + i + 'px'
    } else if (delta === -1) {
      if (elmnt.getBoundingClientRect().width < 55) {
        i = 0
      } else {
        i = -5
      }
      elmnt.style.width = elmnt.getBoundingClientRect().width + i + 'px'
    }
    return false
  }
}

/**
 * 当info对象的值更新时调用此函数，
 * 作用是实例化某一道题目中图片数组里面的ggb图形
 * 调用此函数的组件需要具备有以下条件：
 * 1 simpleGeomParams变量
 * @param {*} vueInstance 调用此函数的组件
 * @param {*} images 要处理的图片数组
 */
export function handleInfoChange(vueInstance, images) {
  for(let i = 0; i < images.length; i++) {
    if(images[i].type == 3 && images[i].states != '{}') {
      vueInstance.simpleGeomParams[i] = {
        container: randomID(i),
        params: {
          appName: "geometry",
          width: 400,
          height: 350,
          scale: 0.5,
          ggbBase64: JSON.parse(images[i].states).ggbBase64,
          showResetIcon: true,
          enableRightClick: false,
          enableLableDrags: false,
          enableShiftDragZoom: false,
          borderColor: '#ffffff00',
          appletOnLoad: function (api) {
            api.setPerspective("G")
            api.setAxesVisible(0, 0)
          }
        }
      }
    } else {
      vueInstance.simpleGeomParams[i] = {}
    }
  }
}

/**
 * 获取一个随机生成的id，作为ggb几何图形外部div的id
 * @param {*} flag 附加标志
 */
export function randomID(flag) {
  let id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now() + flag
  return id
}