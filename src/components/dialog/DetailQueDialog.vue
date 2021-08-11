<template>
  <div class="detail_que_wrap">
    <loader :loading="loading">
      <el-dialog :title="info.tt"
                width="80%"
                :visible.sync="info.visible"
                class="group-dialog"
                :before-close="closeInfo">
        <div>
          <span v-html="info.form.content"
                class="hh"></span>
          <el-carousel v-if="info.form.images && info.form.images.length > 0"
                      trigger="click"
                      height="300px">
            <el-carousel-item v-for="(item, index) in info.form.images"
                              :key="index">
              <img :src="item.src"
                  class="auto-img"
                  @click="showImg(item)"
                  alt="">
            </el-carousel-item>
          </el-carousel>
          <el-collapse v-model="info.activeInfoNames"
                      v-if="info.form.source || info.form.show || (info.form.answer && info.form.answer.length > 0) || (info.form.knowledge && info.form.knowledge.length > 0)">
            <el-collapse-item v-if="info.form.source"
                              title="题目来源"
                              name="1">
              <el-card shadow="always">
                {{info.form.source}}
              </el-card>
            </el-collapse-item>
            <el-collapse-item v-if="info.form.show"
                              title="形式化表示"
                              name="2">
              <el-card shadow="always"
                      v-html="info.form.show">
                <!-- {{info.form.show}} -->
              </el-card>
            </el-collapse-item>
            <el-collapse-item v-if="info.form.answer && info.form.answer.length > 0"
                              title="解答"
                              name="3">
              <div v-for="(item,index) in info.form.answer"
                  :key="item.id"
                  style="margin-top: 5px; margin-bottom: 5px;">
                <el-card shadow="always">
                  <div slot="header">
                    <span>解答 {{index+1}}</span>
                  </div>
                  <div v-html="item.content"
                      class="hh"></div>
                  <el-carousel v-if="item.images && item.images.length > 0"
                              trigger="click"
                              height="300px">
                    <el-carousel-item v-for="(item, index) in item.images"
                                      :key="index">
                      <img :src="item.src"
                          class="auto-img"
                          @click="showImg(item)"
                          alt="">
                    </el-carousel-item>
                  </el-carousel>
                  <el-collapse v-if="item.source || item.show">
                    <el-collapse-item v-if="item.source"
                                      title="解答来源"
                                      name="1">
                      <div>{{item.source}}</div>
                    </el-collapse-item>
                    <el-collapse-item v-if="item.show"
                                      title="形式化表示"
                                      name="2">
                      <div v-html="item.show">
                        <!-- {{item.show}} -->
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-card>
              </div>
            </el-collapse-item>
            <el-collapse-item v-if="info.form.knowledge && info.form.knowledge.length > 0"
                              title="知识点"
                              name="4">
              <div v-for="(item,index) in info.form.knowledge"
                  :key="item.id"
                  style="margin-top: 5px;margin-bottom: 5px;">
                <el-card shadow="always">
                  <div slot="header">
                    <span>知识点 {{index+1}}</span>
                  </div>
                  <div v-html="item.content"
                      class="hh"></div>
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

  import {handleInfoChange, randomID} from '@/js/common/PublicMethods'

  // 网络请求模块
  import req from '@/network/index'

  export default {
    name: 'DetailQueDialog',
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
            handleInfoChange(this, item)
          }
        },
        deep: true
      }
    },
    methods: {
      // 关闭对话框触发
      closeInfo() {
        // 触发子组件事件，让父组件重置相关数据
        this.$emit('close')
      },
      // 显示图片
      showImg (item) {
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
              this.info.tt = this.info.tt.substr(0, 2) + ' - ' + this.info.form.id
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