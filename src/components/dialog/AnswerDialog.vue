<template>
  <div class="answer_dialog">
    <loader :loading="loading">
      <el-dialog :title="answer.tt"
                width="80%"
                :visible.sync="answer.visible"
                class="group-dialog"
                :before-close="closeAnswer">
        <div style="padding-left: 0px;margin-bottom: 5px;">
          <el-button type="primary"
                    size="small"
                    @click="showAddAnswer"
                    style="float: left;margin: 5px 5px;">新增</el-button>
        </div>
        <el-table :data="answer.list"
                  border
                  style="width: 100%; margin-top: 3px;">
          <el-table-column label="内容">
            <template slot-scope="props">
              <span class="line-limit-length"
                    v-html="props.row.content"></span>
            </template>
          </el-table-column>
          <el-table-column width="180"
                          prop="source"
                          label="解答来源">
          </el-table-column>
          <el-table-column label="形式化表示">
            <template slot-scope="props">
              <span class="line-limit-length"
                    v-html="props.row.show">
                <!-- {{props.row.show}} -->
              </span>
            </template>
          </el-table-column>
          <el-table-column width="100"
                          prop="index"
                          label="排序">
          </el-table-column>
          <el-table-column label="操作"
                          width="160">
            <template slot-scope="props">
              <el-button-group>
                <el-button type="success"
                          size="mini"
                          :disabled="loading"
                          @click="showAnswerEdit(props.row)">编辑</el-button>
                <el-button type="danger"
                          size="mini"
                          :disabled="loading"
                          @click="delAnswer(props.row.id)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!-- 解答编辑对话框 -->
      <answer-add-dialog :answerAdd="answerAdd" 
                          @close="closeAddAnswer"
                          />
    </loader>
  </div>
</template>

<script>
  import Loader from '@/components/Loader'
  // 对话框组件
  import AnswerAddDialog from '@/components/dialog/AnswerAddDialog'
  // 网络请求模块
  import req from '@/network/index'

  export default {
    name: 'AnswerDialog',
    components: {
      AnswerAddDialog,
      Loader
    },
    data() {
      return {
        loading: false,
        // 激活新增/编辑解答对话框要用到的对象
        answerAdd: {
          tt: '',
          visible: false,
          form: {},
          addRules: {
            content: [{ required: true, message: '请填写内容', trigger: 'change' }]
          }
        }
      }
    },
    props: {
      // 包含解答列表、显示控制的对象
      answer: {
        type: Object,
        default() {
          return {
            visible: false,
            collection_id: null,
            list: [],
            tt: ''
          }
        } 
      }
    },
    watch: {
      answer: {
        handler(newValue) {
          if(newValue.visible === true) {
            // 获取解答列表
            this.getAnswerList()
          }
        }
      }
    },
    methods: {
      // 关闭解答对话框
      closeAnswer() {
        this.$emit('close')
      },
      // 删除解答
      delAnswer(id) {
        this.$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          req.delAnswer(id).then(res => {
            if (res.data.status != 0) {
              this.$message.error(res.data.msg)
              this.loading = false
            }
            else {
              this.loading = false
              this.getAnswerList()
            }
          }).catch(res => {
            console.error(res)
            this.loading = false
          })
        })
      },
      // 点击新增按钮触发
      showAddAnswer() {
        this.answerAdd.tt = '新增解答'
        this.answerAdd.form = {
          collection_id: this.answer.collection_id,
          images: [],
          content: '',
          show: ''
        }
        this.answerAdd.visible = true
      },
      // 点击编辑按钮触发
      showAnswerEdit(row) {
        this.loading = true
        // 将数据写入到form对象中
        if (typeof row.images == 'undefined') {
          row.images = []
        }
        this.answerAdd.form = JSON.parse(JSON.stringify(row))
        for (let i = 0; i < this.answerAdd.form.images.length; i++) {
          if (this.answerAdd.form.images[i].states) {
            this.answerAdd.form.images[i].states = JSON.parse(this.answerAdd.form.images[i].states)
          }
        }
        this.answerAdd.tt = '更新解答'
        this.answerAdd.visible = true
        this.loading = false
      },
      // 关闭编辑对话框
      closeAddAnswer() {
        this.answerAdd.visible = false
        this.answerAdd.form = {}
        this.getAnswerList()
      },
      // 获取某一道题目的所有解答
      getAnswerList () {
        this.loading = true
        req.getAnswerList(this.answer.collection_id).then(res => {
          if (res.data.status != 0) {
            this.$message.error(res.data.msg)
          }
          else {
            this.answer.list = res.data.content.list
          }
          this.loading = false
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