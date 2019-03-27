<template >
  <div style="padding:10px">
    <el-form size="small" :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item size="mini">
        <el-input size="mini" v-model="searchForm.account" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-input size="mini" v-model="searchForm.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button  size="mini" type="primary" @click="searchSubmit">查询</el-button>
        <el-button  size="mini"  @click="searchForm={};loadList()">重置</el-button>
        <el-button  size="mini"  @click="createUserDialogVisiable=true;">新建用户</el-button>
      </el-form-item>
    </el-form>

    <div style="margin-top:-10px;">
      <el-table
        :data="tableData"
        v-loading="loading"
        border
        stripe
        size="mini"
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column
          prop="account"
          label="账号"
          width="180">
        </el-table-column>

        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button @click="setUserRole(scope.row.id)" type="text" size="small">分配角色</el-button>
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

    <el-dialog :close-on-click-modal="false" title="创建用户" :visible.sync="createUserDialogVisiable" width="40%">
      <div style="padding:0 20px 0 20px;margin-bottom:30px;">
        <el-form ref="saveSysUserForm" size="mini" :rules="sysUserRule" :model="sysUser" label-width="80px">
          <el-form-item label="用户名" prop="account">
            <el-input v-model="sysUser.account"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="name">
            <el-input v-model="sysUser.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="sysUser.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="surePassword">
            <el-input type="password" v-model="sysUser.surePassword" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="sysUser.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="sysUser.email"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="sysUser.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="createUserDialogVisiable = false;">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveUserSubmit('saveSysUserForm')">确 定</el-button>
      </div>
    </el-dialog>


    <!-- @change="handleCheckedCitiesChange" -->
    <el-dialog :close-on-click-modal="false" title="配置用户角色" :visible.sync="setUserRoleDialogVisiable" width="40%">
      <div style="padding:0 20px 0 20px;margin-bottom:30px;">
        <el-checkbox-group size="mini" v-model="checkedRoles">
          <template v-for="role in roles">
              <el-checkbox :checked="role.check" :label="role.id" :key="role.id"><span style="font-size:12px;">{{role.name}}[{{role.roleNo}}]</span></el-checkbox><br/>
          </template>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="setUserRoleDialogVisiable = false;roles=[]">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveUserRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import apiService from '@/api/apiService';
  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.sysUser.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback)=>{
        var reg= /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
        console.log(reg.test(value))
        if(reg.test(value)){
          callback();
        }else{
          callback(new Error('手机号码格式错误'));
        }
      }
      return {
        loading:false,
        tableData: [],
        searchForm: {
          account: '',
          name: ''
        },
        pageNum:1,
        pageSize:10,
        pageTotal:0,
        checkedRoles:[],
        roles:[],
        setUserRoleDialogVisiable:false,
        setUserId:'',
        createUserDialogVisiable:false,
        sysUser:{},
        sysUserRule:{
          account:[{ required: true, message: '用户名不能为空'}],
          name:[{ required: true, message: '昵称不能为空'}],
          password:[{ required: true, message: '密码不能为空'}],
          surePassword:[{ required: true, message: '密码不能为空'},{ validator: validatePass2, trigger: 'blur' }],
          email:[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
          phone:[{ validator: validatePhone, trigger: 'blur' }]
        }
      }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.loadList()
        })
    },
    methods:{
      loadList:function(){
        var that = this;
        var params = this.searchForm;
        params.pageNum = this.pageNum;
        params.pageSize = this.pageSize;
        this.loading = true;
        apiService.user.page(params).then(function(res){
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
      setUserRole:function(user){
        var that = this;
        that.setUserId = user;
        that.roles = [];
        that.checkedRoles = [];
        this.setUserRoleDialogVisiable = true;

        apiService.userRole.queryRoleListByUserId({userId:user}).then(function(res){
          that.roles = res.data.data;
          that.roles.forEach(function(va,i){
            if(va.checked==1){
              va.check = true;
            }else{
              va.check = false;
            }
          });
          console.log(that.roles);
        });

        // apiService.role.list({}).then(function(res){
        //   that.roles = res.data.data.list;
        //   console.log(that.roles);
        // });
        
        

      },
      del:function(id){
        console.log(id)
      },
      saveUserRoleSubmit:function(){
        console.log(this.checkedRoles.join(","));
        console.log(this.setUserId);
        var that = this;
        apiService.userRole.batchSave({roles:this.checkedRoles.join(","),userId:this.setUserId}).then(function(res){
          if(res.data.success){
            that.setUserRoleDialogVisiable = false;
            that.$message({
              message: '配置用户角色成功',
              type: 'success'
            });
          }
        });

      },
      saveUserSubmit:function(formName){
        console.log('save user')
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
            console.log(that.sysUser);
            apiService.user.save(that.sysUser).then(res=>{
              console.log(res.data.success);
              if(res.data.success){
                that.$message.info('创建用户成功');
                that.createUserDialogVisiable = false;
                that.sysUser = {};
                that.loadList();
              }
            });

          }else{
            that.$message.error('表单校验失败');
          }
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
.el-checkbox{
  /* width: 200px;
  float: left; */
}

.el-select-dropdown__item{
  font-size:12px;
}

.el-form-item__label{
  font-size: 12px;
}
</style>
