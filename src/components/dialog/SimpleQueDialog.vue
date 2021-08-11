<template>
  <div class="simple_que_wrap">
    <loader :loading="loading">
      <el-dialog :title="info.tt"
                class="group-dialog"
                width="80%"
                :visible.sync="info.visible1"
                :before-close="closeInfo"
                @opened="dragImg">
        <div>
          <!-- 显示题干 -->
          <span v-html="info.form.content"
                class="hh"></span>
          <div class="topicImg"
              v-if="info.form.images && info.form.images.length > 0">
            <!-- <img v-for="(item, index) in info.form.images"
                :key="index"
                :src="item.src"
                class="topic-auto-img"
                @click="showImg(item)"
                title="通过鼠标滚轮可进行图片缩放"
                alt=""> -->
            <div class="img"
                v-for="(item, index) in info.form.images"
                :key="index"
                style="display: inline-block">
              <img v-if="item.type == 1"
                  :src="item.src"
                  class="topic-auto-img"
                  @click="showImg(item)"
                  title="通过鼠标滚轮可进行图片缩放"
                  alt="">
              <img v-if="item.type == 2"
                  :src="item.src"
                  class="topic-auto-img"
                  @click="showImg(item)"
                  title="通过鼠标滚轮可进行图片缩放"
                  alt="">
              <div :id="simpleGeomParams[index].container"
                  v-if="item.type == 3"
                  v-ggb="index"
                  @dblclick="showImg(item)"></div>
            </div>
          </div>
          <el-collapse v-model="info.activeInfoNames"
                      v-if="(info.form.answer && info.form.answer.length > 0)">
            <el-collapse-item title="解答"
                              name="1">
              <div v-for="(item,index) in info.form.answer"
                  :key="item.id"
                  style="margin-top: 5px; margin-bottom: 5px;">
                <el-card shadow="always">
                  <div slot="header">
                    <span>解答 {{index+1}}</span>
                  </div>
                  <div v-html="item.content"
                      class="hh"></div>
                  <div class="topicImg"
                      v-if="item.images && item.images.length > 0">
                    <img v-for="(item, index) in item.images"
                        :key="index"
                        :src="item.src"
                        class="topic-auto-img"
                        @click="showImg(item)"
                        title="通过鼠标滚轮可进行图片缩放"
                        alt="">
                  </div>
                </el-card>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div style="text-align: center;margin-top: 8px;">
            <el-button type="primary"
                      size="small"
                      :disabled="loading"
                      @click="other(0)">上一题</el-button>
            <el-button type="primary"
                      size="small"
                      :disabled="loading"
                      @click="other(1)">下一题</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 预览动态几何图形 -->
      <el-dialog title=""
                :visible.sync="geomImg.visible"
                width="750px">
        <geometry ref="pre_geom"
                  :GeomParams="preGeomParams" />
      </el-dialog>
    </loader>
  </div>
</template>

<script>
  import Loader from '@/components/Loader'
  import Geometry from '@/components/Geometry'

  import {zoomElement, handleInfoChange, randomID} from '@/js/common/PublicMethods'

  // 网络请求模块
  import req from '@/network/index'

  export default {
    name: 'SimpleQueDialog',
    components: {
      Geometry,
      Loader
    },
    data() {
      return {
        loading: false,
        // 在对话框中简单展示几何图形
        simpleGeomParams: [],
        // 预览动态几何图形的开关
        geomImg: {
          visible: false,
        },
        // 预览动态几何图形参数
        preGeomParams: {
          container: '',
          params: {
            ggbBase64: '',
            showResetIcon: true,
            showMenuBar: false,
            showToolBar: false,
            showAlgebraInput: false,
          }
        }
      }
    },
    props: {
      // 存放题目的详细信息
      info: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      info: {
        handler(value) {
          // 初始化ggb图片数组
          let item = value.form.images
          if(item) {
            // 处理info信息
            handleInfoChange(this, item)
            // 延迟一会之后激活图片的缩放
            setTimeout(() => this.dragImg(), 200)
          }
        },
        deep: true
      }
    },
    directives: {
      // 自定义的ggb指令，将图片插入到对话框中
      ggb: {
        inserted: function (el, binding, vnode, oldVnode) {
          vnode.context.insertGGB(binding.value)
        },
        update: function (el, binding, vnode, oldVnode) {
          vnode.context.insertGGB(binding.value)
        }
      }
    },
    methods: {
      // 插入ggb图形
      insertGGB (ggbId) {
        if (typeof (ggbId) == "number") {
          let simApp = new GGBApplet(this.simpleGeomParams[ggbId].params)
          simApp.inject(this.simpleGeomParams[ggbId].container)
        }
      },
      // 关闭对话框触发
      closeInfo() {
        // 触发子组件事件，让父组件重置相关数据
        this.$emit('close')
      },
      // 让题目中的静态图片可以通过鼠标滚轮进行缩放
      dragImg() {
        let el = document.querySelectorAll(".topicImg .topic-auto-img")
        if (el.length > 0) {
          for (let i = 0; i < el.length; i++) {
            zoomElement(el[i])
          }
        }
      },
      // 显示图片
      showImg(item) {
        let _this = this
        if (item.type == 2) {
          // type == 2 图片类型
          window.open(item.src)
        } else if (item.type == 1) {
          // type == 1 图片类型
          let img = new Image()
          img.src = item.src
          let newWin = window.open('', '_blank')
          newWin.document.write(img.outerHTML)
          newWin.document.close()
        } else if (item.type == 3) {
          // ggb类型图形
          this.geomImg.visible = true
          this.preGeomParams.container = randomID("pre")
          setTimeout(function () {
            _this.preGeomParams.params.ggbBase64 = JSON.parse(item.states).ggbBase64
          }, 0)
        }
      },
      // 获取上一题/下一题
      other(index) {
        let msg = '没有下一题了'
        let hasNext = true
        if (index == 0) {
          msg = '没有上一题了'
          hasNext = false
        }
        this.loading = true;
        req.getNextQuestion(hasNext, this.info.form.id).then(res => {
          if (res.data.status != 0) {
            this.$message.error(res.data.msg)
            this.loading = false
          }
          else {
            if (typeof res.data.content.info != 'undefined'
              && res.data.content.info != null) {
              this.info.form = res.data.content.info
              if (typeof this.info.form.images == 'undefined') {
                this.info.form.images = []
                this.info.form = JSON.parse(JSON.stringify(this.info.form))
              }
              this.info.tt = '题目 - ' + this.info.form.id
              this.info.activeInfoNames = []
            } else {
              this.$message.info(msg)
            }
            this.loading = false
          }
        }).catch(res => {
          console.error(res)
          this.loading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>