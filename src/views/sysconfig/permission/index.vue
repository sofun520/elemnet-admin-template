<template>
  <div>
    {{msg}}
  </div>
</template>

<script>
import apiService from '@/api/apiService';
export default {
    name: 'userPermission',
    data(){
        return {
            msg:''
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.getUserPermission()
        })
    },
    methods:{
        getUserPermission:function(){
            var that = this;
            apiService.user.getUserPermission({}).then(function(res){
                that.msg = JSON.stringify(res.data.data) 
                console.log(res.data.data);
            });
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
