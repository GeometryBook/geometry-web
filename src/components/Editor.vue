<template>
  <div id="editor">
    <!-- 编辑器 -->
    <quill-editor class="editor"
                  ref="myTextEditor"
                  v-model="content"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
                  @change="onEditorChange($event)">
      <div :id="id"
           slot="toolbar">
        <button class="ql-bold"
                title="加粗">Bold</button>
        <button class="ql-italic"
                title="斜体">Italic</button>
        <button class="ql-underline"
                title="下划线">underline</button>
        <button class="ql-strike"
                title="删除线">strike</button>
        <button class="ql-header"
                value="1"
                title="标题1"></button>
        <button class="ql-header"
                value="2"
                title="标题2"></button>
        <button class="ql-list"
                value="ordered"
                title="有序列表"></button>
        <button class="ql-list"
                value="bullet"
                title="无序列表"></button>
        <select class="ql-color"
                value="color"
                title="字体颜色"></select>
        <select class="ql-background"
                value="background"
                title="背景颜色"></select>
        <select class="ql-align"
                value="align"
                title="对齐"></select>
        <button class="ql-clean"
                title="还原"></button>
        <button class="ql-mathjaxEditor"
                title="数学公式、字符"
                @click="dialogFormVisible = true; MJData.flag = 0"></button>
        <select class="ql-header"
                title="段落格式">
          <option selected>文本</option>
          <option value="1">标题1</option>
          <option value="2">标题2</option>
          <option value="3">标题3</option>
          <option value="4">标题4</option>
          <option value="5">标题5</option>
          <option value="6">标题6</option>
        </select>
        <select class="ql-size"
                title="字体大小">
        </select>
        <select class="ql-font"
                title="字体">
          <option value="SimSun">宋体</option>
          <option value="SimHei">黑体</option>
          <option value="Microsoft-YaHei">微软雅黑</option>
          <option value="KaiTi">楷体</option>
          <option value="FangSong">仿宋</option>
          <option value="Arial">Arial</option>
        </select>
      </div>
    </quill-editor>

    <!-- 编辑公式弹窗 -->
    <el-dialog :id="id"
               width="540px"
               title="编辑公式"
               :visible.sync="dialogFormVisible"
               @open="mathJaxFunc('#' + id + ' ' + '.output')"
               @opened="mathDialogOpened"
               @close="mathDialogClose"
               append-to-body>
      <el-form>
        <el-form-item label="编辑"
                      :label-width="formLabelWidth">
          <div class="edit"
               style="width: 100%; border: 1px solid #dcdfe6;">
            <div class="option"
                 style="display:flex;justify-content: space-around;border-bottom: 1px solid #dcdfe6;">
              <el-dropdown @command="handleCommand"
                           placement="top"
                           trigger="hover">
                <span class="el-dropdown-link">
                  常用表达式<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown"
                                  class="expressions">
                  <el-dropdown-item v-for="(item,index) in epList"
                                    :key="index"
                                    :command="getCommand(item)"
                                    :class="getClass(item)"></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand"
                           placement="top"
                           trigger="hover">
                <span class="el-dropdown-link">
                  常用函数<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown"
                                  class="functions">
                  <el-dropdown-item v-for="(item,index) in funcList"
                                    :key="index"
                                    :command="getCommand(item)"
                                    :class="getClass(item)"></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand"
                           placement="top"
                           trigger="hover">
                <span class="el-dropdown-link">
                  希腊字母<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown"
                                  class="epsilon">
                  <el-dropdown-item v-for="(item,index) in esList"
                                    :key="index"
                                    :command="getCommand(item)"
                                    :class="getClass(item)"></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand"
                           placement="top"
                           trigger="hover">
                <span class="el-dropdown-link">
                  常用符号<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown"
                                  class="comSymbols">
                  <el-dropdown-item v-for="(item,index) in csList"
                                    :key="index"
                                    :command="getCommand(item)"
                                    :class="getClass(item)"></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown @command="handleCommand"
                           placement="top"
                           trigger="hover">
                <span class="el-dropdown-link">
                  特殊符号/空格<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown"
                                  class="speSymbols">
                  <el-dropdown-item v-for="(item,index) in ssList"
                                    :key="index"
                                    :command="getCommand(item)"
                                    :class="getClass(item)"></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <el-input v-model="value"
                      id="mathjaxInput"
                      type="textarea"
                      :rows="4"
                      autocomplete="off"
                      @focus="setPos()"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="预览"
                      :label-width="formLabelWidth">
          <div class="output"
               v-html="'\\(' + value + '\\)'"
               style="width: 100%; height: 70px; border: 1px solid #dcdfe6; display: flex; justify-content: center; align-items: center;"></div>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="input">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
import Mathjax from '../js/mathjax'
import Icons from '../js/iconsvg'
import { epList, funcList, esList, csList, ssList } from '../js/iconList'
Quill.register(Mathjax, true)

let fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
let Font = Quill.import('formats/font')
Font.whitelist = fonts  //将字体加入白名单
Quill.register(Font, true)

let sel

export default {
  name: "editor",
  data () {
    return {
      content: null,
      editorOption: {
        modules: {
          toolbar: {
            container: '#' + this.id,
            handlers: {
              shadeBox: null,
            }
          }
        },
        placeholder: '', //提示
        readyOnly: false, //是否只读
        theme: 'snow', //主题 snow/bubble
        syntax: true, //语法检测

      },
      value: '',
      dialogFormVisible: false,  //公式输入弹窗
      formLabelWidth: "50px",
      epList,
      funcList,
      esList,
      csList,
      ssList,
      modifyObj: null,
      MJData: {
        value: '',
        flag: 0
      },
    }
  },
  props: ["editorContent", "id"],
  components: {
    quillEditor,
  },
  computed: {
    editor () {
      return this.$refs.myTextEditor.quill
    },
  },
  mounted () {
    this.initButton()

  },
  watch: {
    value (value) {
      this.mathJaxFunc("#" + this.id + " .output")
    },
    editorContent (value) {
      this.editor.root.innerHTML = value
    },
  },
  methods: {
    // 失去焦点
    onEditorBlur (editor) {
    },
    // 获得焦点
    onEditorFocus (editor) {
      //获得焦点事件
      this.modifyFormula()
    },
    // 开始
    onEditorReady (editor) {
      this.editor.root.innerHTML = this.editorContent
    },
    // 值发生变化
    onEditorChange (editor) {
      this.content = editor.html
    },
    emit () {
      this.$emit("handle", this.editor.root.innerHTML)
    },
    getCommand (item) {
      return item.command
    },
    getClass (item) {
      return item.class
    },
    initButton () {
      let editorParent = this.editor.root.parentNode
      let toolbar = editorParent.previousElementSibling
      let qlHeader = toolbar.querySelector(".ql-header .ql-picker-label"),
        qlSize = toolbar.querySelector(".ql-size .ql-picker-label"),
        qlFont = toolbar.querySelector(".ql-font .ql-picker-label")
      if (qlHeader.children[0]) {
        qlHeader.removeChild(qlHeader.children[0])
      }
      if (qlSize.children[0]) {
        qlSize.removeChild(qlSize.children[0])
      }
      if (qlFont.children[0]) {
        qlFont.removeChild(qlFont.children[0])
      }

      const mathjaxButton = toolbar.querySelector('.ql-mathjaxEditor')
      mathjaxButton.innerHTML = `<img src='${Icons['math']}'>`
    },
    mathDialogOpened () {
      let edit = document.querySelector("#" + this.id + " .edit")
      let textField = edit.getElementsByClassName("el-textarea__inner")
      if (this.MJData.flag) {
        this.value = textField.value = this.MJData.value
      }
      let dropdownDiv = edit.querySelectorAll('.el-dropdown')
      dropdownDiv.forEach(function (dropdown) {
        dropdown.addEventListener('mouseover', function (e) {
          let list = dropdown.querySelectorAll('li')
          if (list) {
            list.forEach(function (item) {
              let className = item.getAttribute('class')
              if (className) {
                let temp = className.slice(23)
                item.innerHTML = `<img src='${Icons[temp]}'>`
              }
            })
          }
        })
      })
    },
    mathDialogClose () {
      this.value = ''
    },
    mathJaxFunc (element) {
      let _this = this
      setTimeout(function () {
        if (!_this.mathConfig.isMathjaxConfig) {
          _this.mathConfig.initMathjaxConfig()
        }
        _this.mathConfig.MathQueue(element)
      }, 0)
    },
    input () {
      let range = this.editor.getSelection(true)
      this.editor.deleteText(range.index, range.length)
      if (this.modifyObj) {
        let prev = this.modifyObj.parentNode
        if (prev) {
          prev.removeChild(this.modifyObj)
          this.modifyObj = null
        }
      }
      if (range.index % 2 == 0) {
        this.editor.insertEmbed(range.index, 'mathjax', this.value)
        this.editor.setSelection(range.index + range.length + 1)
      } else {
        this.editor.insertEmbed(range.index - 1, 'mathjax', this.value)
        this.editor.setSelection(range.index + range.length)
      }
      this.dialogFormVisible = false
    },
    setPos () {
      if (document.selection) {
        sel = document.selection.createRange()
      }
    },
    handleCommand (command) {
      var _this = this
      var textField = document.querySelector("#" + this.id + " #mathjaxInput")
      // IE 浏览器
      if (document.selection) {
        textField.focus()
        sel = document.selection.createRange()
        sel.text = command + ' '
        sel.select()
      }
      //FireFox、Chrome等
      else if (textField.selectionStart || textField.selectionStart == '0') {
        var startPos = textField.selectionStart
        var endPos = textField.selectionEnd
        //保存滚动条
        var restoreTop = textField.scrollTop
        textField.value = textField.value.substring(0, startPos) + command + ' ' + textField.value.substring(endPos, textField.value.length)
        _this.value = textField.value
        if (restoreTop > 0) {
          textField.scrollTop = restoreTop
        }
        textField.focus()
        textField.selectionStart = startPos + command.length + 1
        textField.selectionEnd = startPos + command.length + 1
      } else {
        textField.value = textField.value + command + ' '
        _this.value = textField.value
        textField.focus()
      }
    },
    modifyFormula () {
      let MJ = document.querySelectorAll('.ql-mj')
      let _this = this
      if (MJ.length > 0) {
        for (var i = 0; i < MJ.length; i++) {
          MJ[i].onclick = function () {
            _this.modifyObj = this
            _this.dialogFormVisible = true
            _this.MJData = {
              value: this.getAttribute('data-value'),
              flag: 1
            }
          }
        }
      }
    },
  },
}
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #606266;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown-menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.el-dropdown-menu.expressions {
  width: 440px;
  height: 100px;
}
.el-dropdown-menu.functions {
  width: 520px;
  height: 180px;
}
.el-dropdown-menu.epsilon {
  width: 440px;
  height: 170px;
}
.el-dropdown-menu.comSymbols {
  width: 440px;
  height: 180px;
}
.el-dropdown-menu.speSymbols {
  width: 440px;
  height: 154px;
}
.el-dropdown-menu .el-dropdown-menu__item {
  min-width: 32px;
  min-height: 30px;
  padding: 0px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#editor {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.editor {
  line-height: normal !important;
  width: 100%;
}

.editor >>> .ql-container {
  font-size: 16px;
}

.editor >>> .ql-container.ql-snow {
  height: 100px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 0px 0px 7px 7px;
}

.editor >>> .ql-toolbar.ql-snow {
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  border: 1px solid #dcdfe6;
  border-radius: 7px 7px 0px 0px;
}

.editor >>> .ql-toolbar.ql-snow > * {
  box-sizing: border-box;
  /* flex: 0 0 12.5%; */
  display: flex;
  justify-content: center;
  /* margin: 0 5px; */
}

.editor >>> .ql-toolbar.ql-snow .ql-picker-options {
  /* width: auto; */
  min-width: 50%;
}

.editor >>> .ql-toolbar.ql-snow.ql-toolbar button svg:hover path {
  fill: #0066cc;
}

.editor >>> .ql-toolbar.ql-snow .ql-color .ql-picker-label,
.editor >>> .ql-toolbar.ql-snow .ql-background .ql-picker-label,
.editor >>> .ql-toolbar.ql-snow .ql-align .ql-picker-label {
  width: 30px;
}

.editor >>> .ql-snow .ql-editor img {
  max-width: 300px;
}

.editor >>> .ql-snow .ql-picker.ql-header,
.editor >>> .ql-snow .ql-picker.ql-size,
.editor >>> .ql-snow .ql-picker.ql-font {
  width: auto;
}

.editor >>> .ql-snow .ql-picker.ql-header:focus .ql-picker-label,
.editor >>> .ql-snow .ql-picker.ql-size:focus .ql-picker-label,
.editor >>> .ql-snow .ql-picker.ql-font:focus .ql-picker-label {
  background-color: #0066cc;
}

.editor >>> .ql-snow .ql-picker.ql-header .ql-picker-label::before,
.editor >>> .ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-label[data-value='1']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-label[data-value='2']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-label[data-value='3']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-label[data-value='4']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-label[data-value='5']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-label[data-value='6']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-header
  .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='SimSun']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='SimSun']::before {
  content: '宋体';
  font-family: 'SimSun';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='SimHei']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='SimHei']::before {
  content: '黑体';
  font-family: 'SimHei';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='Microsoft-YaHei']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='Microsoft-YaHei']::before {
  content: '微软雅黑';
  font-family: 'Microsoft YaHei';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='KaiTi']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='KaiTi']::before {
  content: '楷体';
  font-family: 'KaiTi';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='FangSong']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='FangSong']::before {
  content: '仿宋';
  font-family: 'FangSong';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='Arial']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='Arial']::before {
  content: 'Arial';
  font-family: 'Arial';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='Times-New-Roman']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='Times-New-Roman']::before {
  content: 'Times New Roman';
  font-family: 'Times New Roman';
}

.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value='sans-serif']::before,
.editor
  >>> .ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value='sans-serif']::before {
  content: 'sans-serif';
  font-family: 'sans-serif';
}

.editor >>> .ql-font-SimSun {
  font-family: 'SimSun';
}

.editor >>> .ql-font-SimHei {
  font-family: 'SimHei';
}

.editor >>> .ql-font-Microsoft-YaHei {
  font-family: 'Microsoft YaHei';
}

.editor >>> .ql-font-KaiTi {
  font-family: 'KaiTi';
}

.editor >>> .ql-font-FangSong {
  font-family: 'FangSong';
}

.editor >>> .ql-font-Arial {
  font-family: 'Arial';
}

.editor >>> .ql-font-Times-New-Roman {
  font-family: 'Times New Roman';
}

.editor >>> .ql-font-sans-serif {
  font-family: 'sans-serif';
}

#inputData >>> .ql-font-SimSun {
  font-family: 'SimSun';
}

/* #inputData p {
  margin: 0px;
  padding: 0px;
} */

#inputData >>> .ql-font-SimHei {
  font-family: 'SimHei';
}

#inputData >>> .ql-font-Microsoft-YaHei {
  font-family: 'Microsoft YaHei';
}

#inputData >>> .ql-font-KaiTi {
  font-family: 'KaiTi';
}

#inputData >>> .ql-font-FangSong {
  font-family: 'FangSong';
}

#inputData >>> .ql-font-Arial {
  font-family: 'Arial';
}

#inputData >>> .ql-font-Times-New-Roman {
  font-family: 'Times New Roman';
}

#inputData >>> .ql-font-sans-serif {
  font-family: 'sans-serif';
}

#inputData {
  width: 550px;
  height: 300px;
  border: 1px solid #000;
  float: left;
  margin: 20px 0 0 20px;
  box-sizing: border-box;
  line-height: 1.42;
  /* height: 100%; */
  outline: none;
  overflow-y: auto;
  padding: 12px 15px;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  /* clear: both; */
}
#inputData > * {
  cursor: text;
}
#inputData >>> p,
#inputData >>> ol,
#inputData >>> ul,
#inputData >>> pre,
#inputData >>> blockquote,
#inputData >>> h1,
#inputData >>> h2,
#inputData >>> h3,
#inputData >>> h4,
#inputData >>> h5,
#inputData >>> h6 {
  margin: 0;
  padding: 0;
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
#inputData >>> ol,
#inputData >>> ul {
  margin-left: 1.5em;
  list-style-position: inside;
}
#inputData >>> ol > li,
#inputData >>> ul > li {
  list-style-type: none;
}
#inputData >>> ul > li::before {
  content: '\2022';
}
#inputData >>> ul[data-checked='true'],
#inputData >>> ul[data-checked='false'] {
  pointer-events: none;
}
#inputData >>> ul[data-checked='true'] > li *,
#inputData >>> ul[data-checked='false'] > li * {
  pointer-events: all;
}
#inputData >>> ul[data-checked='true'] > li::before,
#inputData >>> ul[data-checked='false'] > li::before {
  color: #777;
  cursor: pointer;
  pointer-events: all;
}
#inputData >>> ul[data-checked='true'] > li::before {
  content: '\2611';
}
#inputData >>> ul[data-checked='false'] > li::before {
  content: '\2610';
}
#inputData >>> li::marker， #inputData >>> li::before {
  display: inline-block;
  white-space: nowrap;
  width: 1.2em;
}
/* #inputData >>> li::marker, */
#inputData >>> li::before {
  margin-left: -1.35em;
  margin-right: 0.6em;
}
/* #inputData >>> ol li, */
#inputData >>> ul li {
  padding-left: 1.5em;
}
#inputData >>> ol li {
  counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
  counter-increment: list-0;
}
#inputData >>> ol li::marker {
  content: counter(list-0, decimal) '. ';
}
#inputData >>> ol li.ql-indent-1 {
  counter-increment: list-1;
}
#inputData >>> ol li.ql-indent-1::marker {
  content: counter(list-1, lower-alpha) '. ';
  margin-left: 3em;
}
#inputData >>> ol li.ql-indent-1 {
  counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
#inputData >>> ol li.ql-indent-2 {
  counter-increment: list-2;
}
#inputData >>> ol li.ql-indent-2::marker {
  content: counter(list-2, lower-roman) '. ';
}
#inputData >>> ol li.ql-indent-2 {
  counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
#inputData >>> ol li.ql-indent-3 {
  counter-increment: list-3;
}
#inputData >>> ol li.ql-indent-3::marker {
  content: counter(list-3, decimal) '. ';
}
#inputData >>> ol li.ql-indent-3 {
  counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
#inputData >>> ol li.ql-indent-4 {
  counter-increment: list-4;
}
#inputData >>> ol li.ql-indent-4::marker {
  content: counter(list-4, lower-alpha) '. ';
}
#inputData >>> ol li.ql-indent-4 {
  counter-reset: list-5 list-6 list-7 list-8 list-9;
}
#inputData >>> ol li.ql-indent-5 {
  counter-increment: list-5;
}
#inputData >>> ol li.ql-indent-5::marker {
  content: counter(list-5, lower-roman) '. ';
}
#inputData >>> ol li.ql-indent-5 {
  counter-reset: list-6 list-7 list-8 list-9;
}
#inputData >>> ol li.ql-indent-6 {
  counter-increment: list-6;
}
#inputData >>> ol li.ql-indent-6::marker {
  content: counter(list-6, decimal) '. ';
}
#inputData >>> ol li.ql-indent-6 {
  counter-reset: list-7 list-8 list-9;
}
#inputData >>> ol li.ql-indent-7 {
  counter-increment: list-7;
}
#inputData >>> ol li.ql-indent-7::marker {
  content: counter(list-7, lower-alpha) '. ';
}
#inputData >>> ol li.ql-indent-7 {
  counter-reset: list-8 list-9;
}
#inputData >>> ol li.ql-indent-8 {
  counter-increment: list-8;
}
#inputData >>> ol li.ql-indent-8::marker {
  content: counter(list-8, lower-roman) '. ';
}
#inputData >>> ol li.ql-indent-8 {
  counter-reset: list-9;
}
#inputData >>> ol li.ql-indent-9 {
  counter-increment: list-9;
}
#inputData >>> ol li.ql-indent-9::marker {
  content: counter(list-9, decimal) '. ';
}
#inputData >>> .ql-indent-1 {
  padding-left: 3em;
}
#inputData >>> ul li.ql-indent-1 {
  padding-left: 4.5em;
}

#inputData >>> .ql-indent-2 {
  padding-left: 6em;
}
#inputData >>> ul li.ql-indent-2 {
  padding-left: 7.5em;
}
#inputData >>> .ql-indent-3 {
  padding-left: 9em;
}
#inputData >>> ul li.ql-indent-3 {
  padding-left: 10.5em;
}
#inputData >>> .ql-indent-4 {
  padding-left: 12em;
}
#inputData >>> ul li.ql-indent-4 {
  padding-left: 13.5em;
}
#inputData >>> .ql-indent-5 {
  padding-left: 15em;
}
#inputData >>> ul li.ql-indent-5 {
  padding-left: 16.5em;
}
#inputData >>> .ql-indent-6 {
  padding-left: 18em;
}
#inputData >>> ul li.ql-indent-6 {
  padding-left: 19.5em;
}
#inputData >>> .ql-indent-7 {
  padding-left: 21em;
}
#inputData >>> ul li.ql-indent-7 {
  padding-left: 22.5em;
}
#inputData >>> .ql-indent-8 {
  padding-left: 24em;
}
#inputData >>> ul li.ql-indent-8 {
  padding-left: 25.5em;
}
#inputData >>> .ql-indent-9 {
  padding-left: 27em;
}
#inputData >>> ul li.ql-indent-9 {
  padding-left: 28.5em;
}
#inputData >>> .ql-video {
  display: block;
  max-width: 100%;
}
#inputData >>> .ql-video.ql-align-center {
  margin: 0 auto;
}
#inputData >>> .ql-video.ql-align-right {
  margin: 0 0 0 auto;
}
#inputData >>> .ql-size-small {
  font-size: 0.75em;
}
#inputData >>> .ql-size-large {
  font-size: 1.5em;
}
#inputData >>> .ql-size-huge {
  font-size: 2.5em;
}
#inputData >>> .ql-align-center {
  text-align: center;
}
#inputData >>> .ql-align-justify {
  text-align: justify;
}
#inputData >>> .ql-align-right {
  text-align: right;
}
#inputData >>> .ql-blank::marker {
  color: rgba(0, 0, 0, 0.6);
  content: attr(data-placeholder);
  font-style: italic;
  left: 15px;
  pointer-events: none;
  position: absolute;
  right: 15px;
}
#inputData >>> img {
  max-width: 300px;
}
</style>