<template >
  <div style="padding:10px;">
    <el-row>
      <el-col :span="10"><div >
        
        <!-- show-checkbox -->
        <div class="custom-tree-container" style="">
          <div class="block" style="font-size:12px !important;">
            <!-- <p><h3>配置资源菜单</h3></p> -->
            <div style="border-left:1px solid rgb(239, 239, 239);border-top:1px solid rgb(239, 239, 239);border-bottom:1px solid rgb(239, 239, 239);padding:10px;height:50px;">
              <el-button size="mini" type="primary" @click="addTopMenu">新增父菜单</el-button>
            </div>
            <div style="padding:25px;border-left:1px solid #efefef;border-bottom:1px solid #efefef;min-height:400px;">
              <el-tree
                :data="data5"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="selectNode"
                >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data)">
                      新增子菜单
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => remove(node, data)">
                      删除
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>


        </div></el-col>
      <el-col :span="14">
        <div style="height:50px;border-left:1px solid rgb(239, 239, 239);border-top:1px solid rgb(239, 239, 239);border-right:1px solid rgb(239, 239, 239);padding:10px;">
          <el-button size="mini" type="primary" @click="addBtnPer">新增权限</el-button>
          <!-- <el-button size="mini" >编辑权限</el-button> -->
          <el-button size="mini" @click="delBtnPer">删除权限</el-button>
          <span style="font-size:12px;margin-left:20px;">菜单:[{{choseNode.label}}][编码：{{choseNode.resourceNo}}]分配权限</span>
        </div>
        <div >
            <el-table
              :data="tableData"
              border
              size="mini"
              style="width: 100%;min-height:400px;"
              @selection-change="selectChange"
              >
              <el-table-column
                type="selection"
                width="50">
              </el-table-column>
              <el-table-column
                prop="title"
                label="标题"
                width="120">
              </el-table-column>
              <el-table-column
                prop="resourceNo"
                label="编码"
                width="180">
              </el-table-column>
              <el-table-column
                prop="description"
                label="描述">
              </el-table-column>
            </el-table>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="新增子菜单" :visible.sync="diaAddSubVisible" width="30%">
      <!-- <el-table :data="gridData">
        <el-table-column property="date" label="日期" width="150"></el-table-column>
        <el-table-column property="name" label="姓名" width="200"></el-table-column>
        <el-table-column property="address" label="地址"></el-table-column>
      </el-table> -->
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="isBtnPermission==true?'新增菜单按钮权限':'新增资源'" :visible.sync="addBtnDialogVisible" width="30%">
      <el-form size="mini" ref="addBtnDialogForm" label-position="left" label-width="80px" :model="addBtnDialogForm">
      <el-form-item label="父级元素">
        <el-input disabled="" v-model="choseNode.label"></el-input>
      </el-form-item>
      <el-form-item label="标题"
        prop="title"
        :rules="[
          { required: true, message: '标题不能为空'}
        ]"
      >
          <el-input v-model="addBtnDialogForm.title"></el-input>
        </el-form-item>
        <el-form-item
         label="权限编码"
         prop="resourceNo"
         :rules="[
           { required: true, message: '权限编码不能为空'}
         ]"
         >
          <el-input v-model="addBtnDialogForm.resourceNo"></el-input>
        </el-form-item>
        <el-form-item
         v-if="!isBtnPermission"
         label="资源路径"
         prop="path"
         :rules="[
           { required: true, message: '资源路径不能为空'}
         ]"
         >
          <el-input v-model="addBtnDialogForm.path"></el-input>
        </el-form-item>
        <el-form-item 
          label="图标"
          prop="icon"
          :rules="[
            { required: true, message: '图标不能为空'}
          ]"
          >
          <el-input v-model="addBtnDialogForm.icon"></el-input>
        </el-form-item>
        <el-form-item 
          label="描述"
          prop="description"
          :rules="[
            { required: true, message: '权限描述不能为空'}
          ]"
          >
          <el-input v-model="addBtnDialogForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addBtnDialogVisible = false;addBtnDialogForm={}">取 消</el-button>
        <el-button size="mini" type="primary" @click="addBtnDialogFormSubmit('addBtnDialogForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  let id = 1000;
  import apiService from '@/api/apiService';
  export default {
    data() {
      const data = [{
        id: 1,
        label: '系统设置',
        children: []
      }];
      return {
        data5: JSON.parse(JSON.stringify(data)),
        diaAddSubVisible:false,
        addBtnDialogVisible:false,
        tableData: [],
        choseNode:{},
        addBtnDialogForm:{},
        btnPermissionSelectList:[],
        isBtnPermission:false,
        isTopMenu:false
      }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.loadList()
        })
    },
    methods: {
      loadList:function(){
        var that = this;
        apiService.resource.lavel_tree({}).then(function(res){
          that.data5 = res.data.data;
          console.log(res.data.data);
        });
      },
      append(data) {
        //是否是按钮级权限
        this.isBtnPermission = false;
        // this.diaAddSubVisible = true;
        this.addBtnDialogVisible = true;

        // const newChild = { id: id++, label: 'testtest', children: [] };
        // if (!data.children) {
        //   this.$set(data, 'children', []);
        // }
        // data.children.push(newChild);

        console.log(data);


      },

      remove(node, data) {
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // children.splice(index, 1);
        console.log(data.id);
        var that = this;
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          apiService.resource.delete({id:data.id}).then(function(res){
            if(res.data.success){
              that.loadList();
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });

        }).catch((res) => {
          console.log(res);
          that.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });


      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
              <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
            </span>
          </span>);
      },
      selectNode:function(va1,va2,va3){
        var choseNode = {label:'',id:0,resourceNo:''}
        console.log(va1.label);
        choseNode.label = va1.label;
        choseNode.id = va1.id;
        choseNode.resourceNo = va1.resourceNo;
        this.choseNode = choseNode;
        var that = this;
        this.queryChildById(va1.id);
      },
      queryChildById:function(id){
        var that = this;
        apiService.resource.queryChildById({id:id}).then(function(res){
          that.tableData = res.data.data;
        });
      },
      addBtnPer:function(){
        this.isBtnPermission = true;
        this.isTopMenu = false;
        if(this.choseNode.id){
          this.addBtnDialogVisible = true;
        }else{
          this.$message({
            showClose: true,
            message: '请选择一个菜单',
            type: 'error'
          });
        }
      },
      addBtnDialogFormSubmit:function(formName){
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params = that.addBtnDialogForm;
            params.parentId = that.choseNode.id;
            if(that.isBtnPermission){
              params.menuType = '100';
            }
            if(that.isTopMenu){
              params.parentId = 0;
            }
            
            apiService.resource.save(params).then(function(res){
              if(res.data.success){
                that.addBtnDialogForm = {};
                that.$message({message:'新增成功'});
                that.addBtnDialogVisible = false;
                that.queryChildById(that.choseNode.id);
                that.loadList();
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.errorMsg,
                  type: 'error'
                });
              }
            });
          } else {
            that.$message({
              showClose: true,
              message: '表单校验失败',
              type: 'error'
            });
            return false;
          }
        });
      },
      selectChange:function(selection){
        this.btnPermissionSelectList = selection;
      },
      delBtnPer:function(){
        //点击[删除权限]按钮时触发方法
        var that = this;
        var ids = new Array();
        this.btnPermissionSelectList.forEach(function(val,i){
          ids.push(val.id);
        });

        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          apiService.resource.batchDelete({ids:ids.join(",")}).then(function(res){
            if(res.data.success){
              that.queryChildById(that.choseNode.id);
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      addTopMenu:function(){
        this.choseNode = {};
        this.addBtnDialogVisible = true;

        this.isBtnPermission = false;
        this.isTopMenu = true;

      }
    }
  };
</script>
<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .el-dialog__title{
    font-size:14px;
  }

  .custom-tree-node{
    font-size: 12px;
  }

  .el-form-item__label{
    font-size:12px;
  }
</style>