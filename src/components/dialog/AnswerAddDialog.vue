<template>
  <div class="answer_add_dialog">
    <loader :loading="loading">
      <el-dialog :title="answerAdd.tt"
                :visible.sync="answerAdd.visible"
                class="group-dialog"
                :before-close="closeAddAnswer">
        <el-form v-loading="loading"
                :model="answerAdd.form"
                :rules="answerAdd.addRules"
                ref="answerAddForm"
                size="small">
          <el-form-item label="内容:"
                        prop="content"
                        :label-width="formLabelWidth">
            <editor :editorContent="answerAdd.form.content"
                    id="answerAddFormEditor"
                    @handle="handleContent($event, 0)"
                    ref="myEditor_1" />
          </el-form-item>
          <el-form-item label="解答来源:"
                        prop="source"
                        :label-width="formLabelWidth">
            <el-input v-model.trim="answerAdd.form.source"
                      autocomplete="off"
                      size="small"
                      maxlength="500"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button round
                      type="success"
                      @click="addLockImg"
                      size="small"
                      :disabled="loading">添加本地图片</el-button>
            <el-button round
                      type="success"
                      @click="addRemoteImg"
                      size="small"
                      :disabled="loading">添加网络图片</el-button>
            <el-button round
                      type="success"
                      @click="addPaintingImg"
                      size="small"
                      :disabled="loading">添加绘制图形</el-button>
          </el-form-item>
          <el-form-item v-for="(img, index) in answerAdd.form.images"
                        :key="index"
                        label="图片:"
                        prop="images"
                        :label-width="formLabelWidth">
            <img style="width: 100px;float: left;"
                :src="img.src"
                v-if="img.src"
                alt="">
            <el-upload v-if="img.type == 1"
                      action="#"
                      list-type="text"
                      :data="{imgIndex: index}"
                      :on-change="handleChange"
                      :on-exceed="handleExceed"
                      :show-file-list="false"
                      :http-request="uploadAnswerImg"
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PNG,.GIF,.BMP"
                      :limit="1"
                      style="float: left;margin-left: 5px;"
                      :auto-upload="true">
              <el-button size="mini"
                        type="primary"
                        slot="trigger"
                        :disabled="loading"
                        v-if="!img.src">选择本地图片</el-button>
              <el-button size="mini"
                        type="primary"
                        slot="trigger"
                        :disabled="loading"
                        v-if="img.src">重新选择本地图片</el-button>
            </el-upload>
            <el-button v-if="img.type == 2 && !img.src"
                      size="mini"
                      type="primary"
                      :disabled="loading"
                      @click="chooseRemoteImg(index, 1)">选择网络图片</el-button>
            <el-button v-if="img.type == 2 && img.src"
                      size="mini"
                      type="primary"
                      :disabled="loading"
                      @click="chooseRemoteImg(index, 1)">重新选择网络图片</el-button>
            <el-button v-if="img.type == 3 && !img.src"
                      size="mini"
                      type="primary"
                      :disabled="loading"
                      @click="paintImg(index, 0)">绘制图形</el-button>
            <el-input v-if="img.type == 3 && img.src && img.states.construction"
                      type="textarea"
                      readonly
                      :rows="5"
                      v-model="img.states.construction"
                      style="width: 250px; float: left; margin: 0 10px">
            </el-input>
            <el-button v-if="img.type == 3 && img.src"
                      size="mini"
                      type="primary"
                      :disabled="loading"
                      @click="paintImg(index, 1)">重新绘制</el-button>
            <el-button size="mini"
                      type="danger"
                      :disabled="loading"
                      @click="rmAnswerImg(index)"
                      style="margin-left: 5px;">移除</el-button>
          </el-form-item>
          <el-form-item label="排序:"
                        prop="index"
                        :label-width="formLabelWidth">
            <el-input-number size="mini"
                            v-model="answerAdd.form.index"
                            style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item label="形式化表示:"
                        prop="show"
                        :label-width="formLabelWidth">
            <editor :editorContent="answerAdd.form.show"
                    id="answerAddFormShow"
                    @handle="handleContent($event, 1)"
                    ref="myEditor_3" />
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button @click="closeAddAnswer"
                      size="small"
                      :disabled="loading">取 消</el-button>
            <el-button type="primary"
                      @click="addAnswer('answerAddForm')"
                      size="small"
                      :disabled="loading">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 添加网络图片 -->
      <el-dialog title="请输入网络图片地址"
                :visible.sync="remoteImg.visible"
                class="group-dialog"
                :before-close="cancelChooseRemoteImg">
        <el-input v-model.trim="remoteImg.src"
                  autocomplete="off"
                  size="small"
                  maxlength="2000"></el-input>
        <div style="text-align: right;margin-top: 5px;">
          <el-button @click="cancelChooseRemoteImg"
                    size="small"
                    :disabled="loading">取 消</el-button>
          <el-button type="primary"
                    @click="confirmChooseRemoteImg"
                    size="small"
                    :disabled="loading">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 几何画板 -->
      <el-dialog title="画板"
                :visible.sync="painterImg.visible"
                width="750px">
        <geometry ref="Geometry"
                        :GeomParams="mainGeomParams" />
        <p style="color:red;margin-top:10px;font-size:12px">提示：为使图片居中显示，绘制完后请将图片适应窗口大小（点击右上角“设置”按钮，在下拉菜单中进行设置！）</p>
        <div slot="footer"
            class="dialog-footer">
          <el-button @click="painterImg.visible = false">取 消</el-button>
          <el-button type="primary"
                    @click="confirmPaintingImg">确 定</el-button>
        </div>
      </el-dialog>
    </loader>
  </div>
</template>

<script>
  import Loader from '@/components/Loader'
  import Geometry from '@/components/Geometry'
  import Editor from '@/components/Editor'

  import {randomID} from '@/js/common/PublicMethods'

  // 网络请求模块
  import req from '@/network/index'

  export default {
    name: 'AnswerAddDialog',
    components: {
      Editor,
      Geometry,
      Loader
    },
    data() {
      return {
        loading: false,
        formLabelWidth: '100px',
        // 控制选择网络图片的对话框
        remoteImg: {
          visible: false
        },
        // 控制几何画板对话框
        painterImg: {
          visible: false,
        },
        // 几何画板参数
        mainGeomParams: {
          container: '',
          params: {
            ggbBase64: '',
            showResetIcon: true,
            showMenuBar: true,
            showToolBar: true,
            showAlgebraInput: true,
          }
        }
      }
    },
    props: {
      // 解答的数据放在这个对象中
      answerAdd: {
        type: Object,
        default() {
          return {
            tt: '',
            visible: false,
            form: {},
            addRules: {
              content: [{ required: true, message: '请填写内容', trigger: 'change' }]
            }
          }
        }
      }
    },
    methods: {
      // 关闭对话框触发
      closeAddAnswer() {
        this.$refs.answerAddForm.resetFields();
        this.$emit('close')
      },
      // 将编辑器的内容写入
      handleContent(value, a) {
        // 0 题目内容编辑框
        // 1 形式化表示编辑框
        switch (a) {
          case 0:
            this.answerAdd.form.content = value
            break
          case 1:
            this.answerAdd.form.show = value
            break
          default:
            break
        }
      },
      addLockImg() {
        if (!this.answerAdd.form.images || this.answerAdd.form.images.length == 0) {
          this.answerAdd.form.images = [
            {
              type: 1,
              src: '',
              states: {}
            }
          ]
        } else {
          this.answerAdd.form.images.push({
            type: 1,
            src: '',
            states: {}
          })
        }
      },
      addRemoteImg() {
        if (!this.answerAdd.form.images || this.answerAdd.form.images.length == 0) {
          this.answerAdd.form.images = [
            {
              type: 2,
              src: '',
              states: {}
            }
          ]
        } else {
          this.answerAdd.form.images.push({
            type: 2,
            src: '',
            states: {}
          })
        }
      },
      addPaintingImg() {
        if (!this.answerAdd.form.images || this.answerAdd.form.images.length == 0) {
          this.answerAdd.form.images = [
            {
              type: 3,
              src: '',
              states: {}
            }
          ]
        } else {
          this.answerAdd.form.images.push({
            type: 3,
            src: '',
            states: {}
          })
        }
      },
      confirmPaintingImg() {
        let _this = this
        let states = {
          construction: '',
          ggbBase64: ''
        }
        this.$refs.Geometry.saveGbFile()
        setTimeout(function () {
          _this.painterImg.visible = false
          // 保存当前画的几何图形的状态，以便再次修改
          states.construction = _this.$refs.Geometry.consState
          states.ggbBase64 = _this.$refs.Geometry.pngBase64
          // 把ggb转成图片保存起来
          let imgSrc = _this.$refs.Geometry.imgBase64
          _this.answerAdd.form.images[_this.painterImg.index].src = `data:image/png;base64,${imgSrc}`
          _this.answerAdd.form.images[_this.painterImg.index].states = JSON.parse(JSON.stringify(states))
        }, 0)
      },
      handleChange(file, fileList) {
        fileList.splice(0, fileList.length);
        if (file.status == 'ready') {

        } else {

        }
      },
      handleExceed() {
        this.$message({
          message: '请先移除后再上传',
          type: 'warning'
        })
      },
      uploadAnswerImg(item) {
        let that = this
        let reader = new FileReader() //实例化文件读取对象
        reader.readAsDataURL(item.file) //将文件读取为 DataURL,也就是base64编码
        reader.onload = function (ev) { //文件读取成功完成时触发
          let dataURL = ev.target.result //获得文件读取成功后的DataURL,也就是base64编码
          that.answerAdd.form.images[item.data.imgIndex].src = dataURL
        }
      },
      chooseRemoteImg(index, a) {
        this.remoteImg = {
          visible: true,
          index: index,
          a: a
        }
      },
      cancelChooseRemoteImg() {
        this.remoteImg = {
          visible: false
        }
      },
      confirmChooseRemoteImg() {
        if (!this.remoteImg.src) {
          this.$message({
            message: '请输入图片地址',
            type: 'warning'
          })
          return
        }
        this.answerAdd.form.images[this.remoteImg.index].src = this.remoteImg.src
        this.remoteImg = {
          visible: false
        }
      },
      paintImg(index, reDraw) {
        this.painterImg = {
          visible: true,
          index,
          reDraw
        }
        let _this = this
        _this.mainGeomParams.container = randomID("main")
        setTimeout(function () {
          if (_this.painterImg.reDraw === 1) {
            _this.mainGeomParams.params.ggbBase64 = _this.answerAdd.form.images[_this.painterImg.index].states.ggbBase64
          } else {
            _this.mainGeomParams.params = {
              ggbBase64: '',
              showResetIcon: true,
              showMenuBar: true,
              showToolBar: true,
              showAlgebraInput: true,
            }
          }
        }, 0)
      },
      rmAnswerImg(index) {
        this.answerAdd.form.images.splice(index, 1)
      },
      // 提交表单
      addAnswer(formName) {
        this.loading = true
        this.$refs.myEditor_1.emit()
        this.$refs.myEditor_3.emit()
        // 校验表单
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let isUpdate = true
            if (this.answerAdd.tt == '新增解答') {
              isUpdate = false
            }
            // 将form对象转化为JSON字符串
            for (let i = 0; i < this.answerAdd.form.images.length; i++) {
              this.answerAdd.form.images[i].states = JSON.stringify(this.answerAdd.form.images[i].states)
            }
            req.addAnswer(isUpdate, this.answerAdd.form).then(res => {
              if (res.data.status != 0) {
                this.$message.error(res.data.msg)
                this.loading = false
              }
              else {
                this.closeAddAnswer()
                this.loading = false
              }
            }).catch(res => {
              console.error(res)
              this.loading = false
            })
          } else {
            this.loading = false
            return false
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>