<template>
  <div class="oper_que_diag">
    <loader :loading="loading">
      <el-dialog :title="operation"
                :visible.sync="visible"
                class="group-dialog"
                :before-close="cancelAdd">
        <el-form :model="addForm"
                :rules="addRules"
                ref="addForm"
                size="small">
          <el-form-item label="内容:"
                        prop="content"
                        :label-width="formLabelWidth">
            <editor :editorContent="addForm.content"
                    id="addFormContent"
                    @handle="handleContent($event, 0)"
                    ref="myEditor_0" />
          </el-form-item>
          <el-form-item label="题目来源:"
                        prop="source"
                        :label-width="formLabelWidth">
            <el-input v-model.trim="addForm.source"
                      autocomplete="off"
                      size="small"
                      maxlength="500"></el-input>
          </el-form-item>
          <el-form-item label="知识点:"
                        prop="knowledge_ids"
                        :label-width="formLabelWidth">
            <el-cascader style="width: 100%;"
                        :options="allKnowledge"
                        v-model="addForm.knowledge_ids"
                        :props="cascaderProps"
                        clearable></el-cascader>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button round
                      type="success"
                      @click="addLockImg()"
                      size="small"
                      :disabled="loading">添加本地图片</el-button>
            <el-button round
                      type="success"
                      @click="addRemoteImg()"
                      size="small"
                      :disabled="loading">添加网络图片</el-button>
            <el-button round
                      type="success"
                      @click="addPaintingImg()"
                      size="small"
                      :disabled="loading">添加绘制图形</el-button>
          </el-form-item>
          <el-form-item v-for="(img, index) in addForm.images"
                        :key="index"
                        label="图片:"
                        prop="images"
                        :label-width="formLabelWidth"
                        style="">
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
                      :http-request="uploadImg"
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
                      @click="chooseRemoteImg(index, 0)">选择网络图片</el-button>
            <el-button v-if="img.type == 2 && img.src"
                      size="mini"
                      type="primary"
                      :disabled="loading"
                      @click="chooseRemoteImg(index, 0)">重新选择网络图片</el-button>
            <el-button v-if="img.type == 3 && !img.src"
                      size="mini"
                      type="primary"
                      :disabled="loading"
                      @click="paintImg(index, 0, 0)">绘制图形</el-button>
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
                      @click="paintImg(index, 0, 1)">重新绘制</el-button>
            <el-button size="mini"
                      type="danger"
                      :disabled="loading"
                      @click="rmImg(index)"
                      style="margin-left: 5px;">移除</el-button>
          </el-form-item>
          <el-form-item label="形式化表示:"
                        prop="show"
                        :label-width="formLabelWidth">
            <editor :editorContent="addForm.show"
                    id="addFormShow"
                    @handle="handleContent($event, 1)"
                    ref="myEditor_2" />
          </el-form-item>
          <el-form-item style="text-align: right">
            <el-button @click="cancelAdd"
                      size="small"
                      :disabled="loading">取 消</el-button>
            <el-button type="primary"
                      @click="add('addForm')"
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
  import Editor from '@/components/Editor'
  import Geometry from '@/components/Geometry'

  import {randomID} from '@/js/common/PublicMethods'

  // 网络请求模块
  import req from '@/network/index'

  export default {
    name: 'OperQueDialog',
    components: {
      Editor,
      Geometry,
      Loader
    },
    data() {
      return {
        loading: false,
        // 表单的校验规则
        addRules: { 
          required: true,
          message: '请填写内容',
          trigger: 'change' 
        },
        formLabelWidth: '100px',
        // 控制层叠器的属性
        cascaderProps: {
          multiple: true,
          checkStrictly: true
        },
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
      // 是否显示
      visible: {
        type: Boolean,
        default: false
      },
      // 操作类型，新增/编辑题目
      operation: {
        type: String,
        default: '新增'
      },
      // 旧数据(编辑题目时才需要)
      addForm: {
        type: Object,
        required: this.operation === '编辑'
      },
      // 知识点数组
      allKnowledge: {
        type: Array,
        default() {
          return []
        }
      }
    },
    mounted() {
      // 挂载完成之后就取消加载动画
      this.loading = false
    },
    methods: {
      handleContent (value, a) {
        // 0 题目内容编辑框
        // 1 形式化表示编辑框
        switch (a) {
          case 0:
            this.addForm.content = value
            break
          case 1:
            this.addForm.show = value
            break
          default:
            break
        }
      },
      addLockImg () {
        if (!this.addForm.images || this.addForm.images.length == 0) {
          this.addForm.images = [
            {
              type: 1,
              src: '',
              states: {}
            }
          ]
        } else {
          this.addForm.images.push({
            type: 1,
            src: '',
            states: {}
          })
        }
      },
      addRemoteImg () {
        if (!this.addForm.images || this.addForm.images.length == 0) {
          this.addForm.images = [
            {
              type: 2,
              src: '',
              states: {}
            }
          ]
        } else {
          this.addForm.images.push({
            type: 2,
            src: '',
            states: {}
          })
        }
      },
      chooseRemoteImg (index, a) {
        this.remoteImg = {
          visible: true,
          index: index,
          a: a
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
        this.addForm.images[this.remoteImg.index].src = this.remoteImg.src
        this.remoteImg = {
          visible: false
        }
      },
      cancelChooseRemoteImg () {
        this.remoteImg = {
          visible: false
        }
      },
      rmImg (index) {
        this.addForm.images.splice(index, 1)
      },
      // 将图片转成base64编码
      uploadImg (item) {
        let that = this
        let reader = new FileReader() //实例化文件读取对象
        reader.readAsDataURL(item.file) //将文件读取为 DataURL,也就是base64编码
        reader.onload = function (ev) { //文件读取成功完成时触发
          let dataURL = ev.target.result //获得文件读取成功后的DataURL,也就是base64编码
          that.addForm.images[item.data.imgIndex].src = dataURL
        }
      },
      handleChange(file, fileList) {
        fileList.splice(0, fileList.length);
        if (file.status == 'ready') {

        } else {

        }
      },
      handleExceed () {
        this.$message({
          message: '请先移除后再上传',
          type: 'warning'
        })
      },
      addPaintingImg () {
        if (!this.addForm.images || this.addForm.images.length == 0) {
          this.addForm.images = [
            {
              type: 3,
              src: '',
              states: {}
            }
          ]
        } else {
          this.addForm.images.push({
            type: 3,
            src: '',
            states: {}
          })
        }
      },
      // 绘画几何图形
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
            _this.mainGeomParams.params.ggbBase64 = _this.addForm.images[_this.painterImg.index].states.ggbBase64
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
      // 处理画好的几何图形
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
          _this.addForm.images[_this.painterImg.index].src = `data:image/png;base64,${imgSrc}`
          _this.addForm.images[_this.painterImg.index].states = JSON.parse(JSON.stringify(states))
        }, 0)
      },
      // 关闭对话框
      cancelAdd() {
        // 重置表单
        this.$refs.addForm.resetFields()
        this.cancelChooseRemoteImg()
        this.$emit('close')
      },
      // 提交表单，新增或更新题目到数据库中
      add(formName) {
        this.loading = true
        // 触发两个Editor组件的handle事件
        this.$refs.myEditor_0.emit()
        this.$refs.myEditor_2.emit()
        // 校验表单
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 判断是新增题目还是编辑旧题目
            let isUpdate = true
            if (this.operation == '新增') {
              isUpdate = false
            }
            for (let i = 0; i < this.addForm.images.length; i++) {
              this.addForm.images[i].states = JSON.stringify(this.addForm.images[i].states)
            }
            // 触发子组件的事件，交给父组件发送请求
            req.addQue(isUpdate, this.addForm).then(res => {
              if(res.data.status != 0) {
                this.$message.error(res.data.msg)
                this.loading = false
              }
              else {
                this.loading = false
                this.cancelAdd()
              }
            }).catch(res => {
              console.error(res)
              this.loading = false
            })
            this.$refs.addForm.resetFields()
            this.loading = false
          } else {
            this.loading = false
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>