<template >
  <div style="padding:10px">
    <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item size="mini">
        <el-input size="mini" v-model="searchForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-input size="mini" v-model="searchForm.roleNo" placeholder="角色代码"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button  size="mini" type="primary" @click="searchSubmit">查询</el-button>
        <el-button  size="mini"  @click="searchForm={};loadList()">重置</el-button>
        <el-button  size="mini"  @click="searchForm={};loadList()">新建角色</el-button>
      </el-form-item>
    </el-form>

    <div style="margin-top:-10px;">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        size="mini"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180">
        </el-table-column>

        <el-table-column
          prop="roleNo"
          label="角色代码"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>
        <el-table-column
          prop="createDt"
          label="创建时间">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row.id)" type="text" size="small">编辑</el-button>
            <el-button @click="setRolePermissoin(scope.row.id)" type="text" size="small">分配权限</el-button>
            <el-button @click="del(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        small
        layout="total, sizes, prev, pager, next, jumper"
        :page-count="pageTotal"
        :page-size="pageSize"
        @current-change="pageNextClick"
        @size-change="pageSizeChange"
        :page-sizes="[10, 20, 30, 40]"
        >
      </el-pagination>
    </div>

    <el-dialog :close-on-click-modal="false" title="配置角色菜单" :visible.sync="setRolePermissionDialog" width="60%">
      <el-row>
        <el-col :span="8">
          <div class="rolePermissionPanelLeft">
            <el-tree
              :data="treeData"
              show-checkbox
              default-expand-all
              :expand-on-click-node="false"
              node-key="id"
              ref="tree"
              @node-click="selectNode"
              @getCheckedNodes="getCheckedNodes"
              :default-checked-keys="treeCheckedKeys">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="16">
          <div style="min-height:300px;">
            <el-table
              ref="multipleTable"
              :data="btnTableData"
              border
              size="mini"
              style="width: 100%;min-height:300px;"
              @select="selectOne"
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
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="setRolePermissionDialog = false;btnTableData=[]">取 消</el-button>
        <el-button size="mini" type="primary" @click="getCheckedNodes">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import apiService from '@/api/apiService';
  export default {
    data() {
      return {
        loading: false,
        tableData: [],
        searchForm: {
          account: '',
          name: ''
        },
        pageNum:1,
        pageSize:10,
        pageTotal:0,
        setRolePermissionDialog:false,
        treeData: [],
        btnTableData:[],
        setRoleId:'',
        treeCheckedKeys:[]
      }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.loadList()
        })
    },
    methods:{
      loadTreeSelectDataList:function(roleId){
        var that = this;
        apiService.roleResource.lavelTreeSelectData({roleId:roleId}).then(function(res){
          if(res.data.data){
            var resourceSelectArray = new Array();
            res.data.data.forEach(function(v,i){
              resourceSelectArray.push(v.resourceId);
            });
            that.treeCheckedKeys = resourceSelectArray;
            console.log(resourceSelectArray.join(","));
          }
        });
        
      },
      loadTreeDataList:function(){
        var that = this;
        apiService.resource.lavel_tree({}).then(function(res){
          that.treeData = res.data.data;
        });
      },
      loadList:function(){
        var that = this;
        var params = this.searchForm;
        params.pageNum = this.pageNum;
        params.pageSize = this.pageSize;
        this.loading = true;
        apiService.role.page(params).then(function(res){
          that.loading = false;
          that.tableData = res.data.data.list;
          that.pageTotal = res.data.data.pages;
          console.log(res.data.data.pages);
        });
      },
      searchSubmit:function(){
        this.loadList();
      },
      pageNextClick:function(pageNum){
        this.pageNum = pageNum;
        this.loadList();
      },
      pageSizeChange:function(pageSize){
        this.pageSize = pageSize;
        this.loadList();
      },
      detail:function(user){
        console.log(user)
      },
      del:function(id){
        console.log(id)
      },
      setRolePermissoin:function(id){
        this.setRoleId = id;
        this.setRolePermissionDialog = true;
        this.loadTreeDataList();
        this.loadTreeSelectDataList(id);
        this.btnTableData = [];
      },
      queryRoleBtnPermission:function(roleId,parentId){
        var that = this;
        apiService.roleResource.queryRoleBtnPermission({roleId:roleId,parentId:parentId}).then(function(res){
          console.log(res.data.data);
          that.btnTableData.forEach(row=>{
            res.data.data.forEach(da=>{
              if(row.id==da.id){
                that.$refs.multipleTable.toggleRowSelection(row);
                console.log(row);
              }
            });
          });

        });
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
        this.queryRoleBtnPermission(that.setRoleId,va1.id);
      },
      queryChildById:function(id){
        var that = this;
        apiService.resource.queryChildById({id:id}).then(function(res){
          that.btnTableData = res.data.data;
        });
      },
      getCheckedNodes() {
        var that = this;
        var ll = this.$refs.tree.getCheckedNodes();
        var menuArray = new Array();
        ll.forEach(function(v,i){
            menuArray.push(v.id);
        });
        var params  = {roleId:this.setRoleId,menus:menuArray.join(",")};
        apiService.roleResource.batchSave(params).then(function(res){
          if(res.data.success){
            that.$message({
              message: '配置角色菜单权限成功',
              type: 'success'
            });
          }
          //清除集合数据，关闭对话框
          that.setRolePermissionDialog = false;
          that.treeCheckedKeys = [];
          that.treeData = [];
          that.btnTableData = [];
        });
      },
      selectOne:function(selection, row){
        // console.log(selection);
        console.log(row.id);
        //选择一行时
        var roleResource = {};
        roleResource.roleId = this.setRoleId;
        roleResource.resourceId = row.id;
        console.log(roleResource);
        apiService.roleResource.choseOrNot(roleResource).then(function(res){
          // console.log(res.data);
        });
      }
    }
  }
</script>
<style>
.page{
  padding: 10px;
  text-align: right;
}

.el-tree-node__label{
  font-size:12px;
}

.el-dialog__body{
  padding:20px !important;
}

.rolePermissionPanelLeft{
  border-left:1px solid #efefef;border-top:1px solid #efefef;border-bottom:1px solid #efefef;min-height:300px;
}

.el-checkbox{

}
</style>
