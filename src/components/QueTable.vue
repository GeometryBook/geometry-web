<template>
  <div class="que_table">
    <loader :loading="loading">
      <!-- 新增按钮 -->
      <div style="padding-left: 0px;margin-bottom: 5px;">
        <el-button type="primary"
                  size="small"
                  @click="showAdd"
                  style="float: left;margin-right: 5px;">新增</el-button>
      </div>
      <!-- 页面主表格 -->
      <el-table :data="list"
                border
                :height="tableHeight"
                @row-click="showTopic"
                style="width: 100%; margin-top: 3px;">
        <el-table-column width="80"
                        prop="id"
                        label="ID"
                        sortable
                        :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="props">
            <span class="line-limit-length"
                  v-html="props.row.content"></span>
          </template>
        </el-table-column>
        <el-table-column width="180"
                        prop="source"
                        label="题目来源">
        </el-table-column>
        <el-table-column width="165"
                        prop="create_time"
                        label="创建时间">
        </el-table-column>
        <el-table-column label="操作"
                        width="310">
          <template slot-scope="props">
            <el-button-group>
              <el-button type="primary"
                        size="mini"
                        :disabled="loading"
                        @click.stop="showInfo(props.row)">详情</el-button>
              <el-button type="primary"
                        size="mini"
                        :disabled="loading"
                        @click.stop="showAnswer(props.row)">解答</el-button>
              <el-button type="success"
                        size="mini"
                        :disabled="loading"
                        @click.stop="showEdit(props.row)">编辑</el-button>
              <el-button type="danger"
                        size="mini"
                        :disabled="loading"
                        @click.stop="del(props.row.id)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页器 -->
      <div style="text-align: right; margin-top: 10px">
        <el-pagination small
                      background
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalCount"
                      :page-sizes="[10, 20, 30, 40, 50]"
                      :page-size="pageSize"
                      :current-page="curPage"
                      @current-change="currentChange"
                      @size-change="sizeChange">
        </el-pagination>
      </div>

      <!-- 查看题目 -->
      <simple-que-dialog :info="info"
                          @close="closeInfo"
                          />

      <!-- 查看详情 -->
      <detail-que-dialog :info="info"
                          @close="closeInfo"
                          />

      <!-- 新增和编辑题目 -->
      <oper-que-dialog  :visible="addVisible"
                        :operation="tt"
                        :addForm="addForm"
                        :allKnowledge="allKnowledge"
                        @close="cancelAdd"
                        />

      <!-- 解答 -->
      <answer-dialog :answer="answer" 
                      @close="closeAnswer"
                      />
    </loader>
  </div>
</template>

<script>
import Loader from '@/components/Loader'

// 对话框组件
import SimpleQueDialog from '@/components/dialog/SimpleQueDialog'
import DetailQueDialog from '@/components/dialog/DetailQueDialog'
import OperQueDialog from '@/components/dialog/OperQueDialog'
import AnswerDialog from '@/components/dialog/AnswerDialog'

// 网络请求模块
import req from '@/network/index'

export default {
  name: 'QueTable',
  components: {
    Loader,
    SimpleQueDialog,
    DetailQueDialog,
    OperQueDialog,
    AnswerDialog
  },
  data () {
    return {
      loading: false,
      tableHeight: window.innerHeight - 96,
      formLabelWidth: '100px',
      list: [],
      // 分页相关
      totalCount: 0,
      pageSize: 10,
      curPage: 1,
      // 对话框标题
      tt: '',
      // 存放新增和编辑题目的表单数据
      addForm: {},
      // 新增和编辑题目的对话框显示开关
      addVisible: false,
      // 控制解答对话框的显示
      answer: {
        visible: false,
        list: [],
        tt: ''
      },
      // 请求到的题目的详细信息封装在info对象中，绑定到相应的对话框组件上
      info: {
        visible: false,
        visible1: false,
        form: {},
        activeInfoNames: []
      },
      allKnowledge: [],
    }
  },
  methods: {
    // 关闭题目信息对话框
    closeInfo() {
      this.info = {
        visible: false,
        visible1: false,
        form: {},
        activeInfoNames: []
      }
    },
    // 点击表格某一行时显示题目的主要信息
    showTopic(row) {
      this.loading = true
      req.getQueInfo(row.id).then(res => {
        if (res.data.status != 0) {
          this.$message.error(res.data.msg)
          this.loading = false
        }
        else {
          this.info.form = res.data.content.info
          if (typeof this.info.form.images == 'undefined') {
            this.info.form.images = []
            this.info.form = JSON.parse(JSON.stringify(this.info.form))
          }
          this.info.tt = '题目 - ' + row.id
          this.info.visible1 = true
          this.loading = false
        }
      }).catch(res => {
        console.error(res)
        this.loading = false
      })

    },
    // 查看题目详情
    showInfo(row) {
      this.loading = true
      req.getQueInfo(row.id).then(res => {
        if (res.data.status != 0) {
          // 请求失败
          this.$message.error(res.data.msg)
          this.loading = false
        }
        else {
          this.info.form = res.data.content.info
          if (typeof this.info.form.images == 'undefined') {
            this.info.form.images = []
            this.info.form = JSON.parse(JSON.stringify(this.info.form))
          }
          this.info.tt = '详情 - ' + row.id
          this.info.visible = true
          this.loading = false
        }
      }).catch(res => {
        console.error(res)
        this.loading = false
      })

    },
    // 关闭解答对话框
    closeAnswer() {
      this.answer = {
        visible: false,
        tt: ''
      }
    },
    // 控制分页
    sizeChange(size) {
      this.pageSize = size
      this.curPage = 1
      this.getList()
    },
    // 控制分页
    currentChange(currentPage) {
      this.curPage = currentPage
      this.getList()
    },
    // 解答题目
    showAnswer(row) {
      this.answer = {
        visible: true,
        list: [],
        collection_id: row.id,
        tt: '解答 - ' + row.id
      }
    },
    // 编辑题目
    showEdit(row) {
      this.loading = true
      req.getSimpleInfo(row.id).then(res => {
        if (res.data.status != 0) {
          this.$message.error(res.data.msg)
          this.loading = false
        }
        else {
          this.addForm = res.data.content.info
          if (typeof this.addForm.images == 'undefined') {
            this.addForm.images = []
            this.addForm = JSON.parse(JSON.stringify(this.addForm))
          }
          for (let i = 0; i < this.addForm.images.length; i++) {
            if (this.addForm.images[i].states) {
              this.addForm.images[i].states = JSON.parse(this.addForm.images[i].states)
            }
          }
          this.tt = '编辑'
          this.loading = false
          this.addVisible = true
        }
      }).catch(res => {
        console.error(res)
        this.loading = false
      })
    },
    // 删除题目
    del(id) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        req.delQue(id).then(res => {
          if (res.data.status != 0) {
            this.$message.error(res.data.msg)
            this.loading = false
          }
          else {
            this.loading = false
            this.getList()
          }
        }).catch(res => {
          console.error(res)
          this.loading = false
        })

      }).catch(() => {
      })
    },
    // 添加题目
    add(isUpdate, addForm) {
      this.loading = true
      this.cancelAdd()
      req.addQue(isUpdate, addForm).then(res => {
        if (res.data.status != 0) {
          this.$message.error(res.data.msg)
          this.loading = false
        }
        else {
          this.loading = false
          this.getList()
        }
      }).catch(res => {
        console.error(res)
        this.loading = false
      })
    },
    // 关闭添加题目的对话框
    cancelAdd() {
      this.addForm = {}
      this.addVisible = false
      this.getList()
    },
    // 激活添加题目的对话框
    showAdd() {
      this.tt = '新增'
      this.addForm = {
        content: '',
        images: [],
        show: ''
      }
      this.addVisible = true
    },
    // 获取题目列表
    getList() {
      this.loading = true
      req.getQueList(this.curPage, this.pageSize).then(res => {
        if (res.data.status != 0) {
          this.$message.error(res.data.msg)
        }
        else {
          // 拿到题目列表之后设置到data中
          this.list = res.data.content.list
          this.totalCount = res.data.content.total_count
        }
        this.loading = false
      }).catch(res => {
        console.error(res)
        this.loading = false
      })
    },
    // 拿到所有的知识点
    getAllKnowledge() {
      this.loading = true
      req.getKnowledges().then(res => {
        if (res.data.status != 0) {
          this.$message.error(res.data.msg)
        }
        else {
          this.allKnowledge = res.data.content.list
        }
        this.loading = false
      }).catch(res => {
        console.error(res)
        this.loading = false
      })
    }
  },
  created: function () {
    this.getList()
    this.getAllKnowledge()
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.que_table {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.topicImg .img .ggbContainer {
  width: 200px;
  height: 175px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 100%;
}
body .el-table th.gutter {
  display: table-cell !important;
}
.line-limit-length {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* 文本不换行，这样超出一行的部分被截取，显示... */
  display: inline-block;
  max-height: 80px;
}
.info-title {
  font-weight: bolder;
}
.info-content {
  padding-left: 10px;
}

.topicImg {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.topic-auto-img {
  width: 150px;
  margin: 20px;
  cursor: pointer;
}
.hh {
  word-wrap: break-word;
  word-break: break-all;
  font-size: 18px;
}
.ql-mj .MathJax_Preview .MJXp-math .MJXp-mo {
  margin: 0 !important;
}
.MathJax_Display {
  display: inline !important;
  margin: 1em 0;
  max-height: none;
  max-width: none;
  min-height: 0;
  min-width: 0;
  position: relative;
  text-align: left;
  text-indent: 0;
  width: 100%;
  overflow-x: auto; /*公式太长会溢出*/
  overflow-y: hidden;
}
.MathJax {
  outline: 0;
}
</style>
