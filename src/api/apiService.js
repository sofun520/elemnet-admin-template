import fetch from './fetch'

let apiService = {}

let user = {
    page: function (params) {
        return fetch.fetch({
            url: '/api/user/page',
            method: 'get',
            params: params
        })
    },
    getUserPermission:function(params){
        return fetch.fetch({
            url: '/api/user/permission',
            method: 'get',
            params: params
        })
    },
    login:function(params){
        return fetch.fetch({
            url: '/api/login',
            method: 'post',
            data: params
        })
    }
}

let role={
    page: function (params) {
        return fetch.fetch({
            url: '/api/role/page',
            method: 'get',
            params: params
        })
    },
    list:function(params){
        return fetch.fetch({
            url: '/api/role/page',
            method: 'get',
            params: params
        })
    }
}

let resource = {
    lavel_tree:function(params){
        return fetch.fetch({
            url: '/api/resource/tree',
            method: 'get',
            params: params
        })
    },
    queryChildById:function(params){
        return fetch.fetch({
            url: '/api/resource/query_child',
            method: 'get',
            params: params
        })
    },
    save:function(params){
        return fetch.fetch({
            url: '/api/resource/save',
            method: 'post',
            data: params
        })
    },
    batchDelete:function(params){
        return fetch.fetch({
            url: '/api/resource/batchDelete',
            method: 'get',
            params: params
        })
    },
    delete:function(params){
        return fetch.fetch({
            url: '/api/resource/delete',
            method: 'get',
            params: params
        })
    }
}


let roleResource = {
    batchSave:function(params){
        return fetch.fetch({
            url: '/api/roleresource/batchSave',
            method: 'post',
            data: params
        })
    },
    lavelTreeSelectData:function(params){
        return fetch.fetch({
            url: '/api/roleresource/queryResourceListByRoleId',
            method: 'get',
            params: params
        })
    },
    choseOrNot:function(params){
        return fetch.fetch({
            url: '/api/roleresource/choseOrNot',
            method: 'post',
            data: params
        })
    },
    queryRoleBtnPermission:function(params){
        return fetch.fetch({
            url: '/api/roleresource/queryRoleBtnPermission',
            method: 'get',
            params: params
        })
    }
}


let userRole = {
    queryRoleListByUserId:function(params){
        return fetch.fetch({
            url: '/api/userrole/queryRoleListByUserId',
            method: 'get',
            params: params
        })
    },
    batchSave:function(params){
        return fetch.fetch({
            url: '/api/userrole/batchSave',
            method: 'post',
            data: params
        })
    }
}

apiService.user = user;
apiService.role = role;
apiService.resource = resource;
apiService.roleResource = roleResource;
apiService.userRole = userRole;

export default apiService;