<template>
  <div>
    
  </div>
</template>

<script>
import apiService from '@/api/apiService';
export default {
    name: 'userPermission',
    mounted: function () {
        this.$nextTick(function () {
            this.getUserPermission()
        })
    },
    methods:{
        getUserPermission:function(){
            apiService.user.getUserPermission({}).then(function(res){
                console.log(res.data.data);
            });
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
