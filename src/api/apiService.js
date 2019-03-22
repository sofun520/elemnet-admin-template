import fetch from './fetch'

let apiService = {}

let user = {
    page: function (params) {
        return fetch.fetch({
            url: '/api/user/page',
            method: 'get',
            params: params
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

apiService.user = user;
apiService.role = role;
apiService.resource = resource;

export default apiService;