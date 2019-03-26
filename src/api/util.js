import apiService from './apiService'

let util = {};

util.initRouter = function(){
    const constRoutes = [];
    const otherRoutes = [];

    apiService.user.getUserPermission({}).then(function(res){
        var menuData = res.data.data;
        console.log(res.data.data);

        util.initRouterNode(constRoutes, menuData);




    });
    


}


// 生成路由节点
util.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        menu.component = lazyLoading(menu.component);
        if (item.children && item.children.length > 0) {
            menu.children = [];
            util.initRouterNode(menu.children, item.children);
        }
        let meta = {};
        // 给页面添加标题
        meta.permission = menu.permission ? menu.permission : null;
        meta.title = menu.title ? menu.title : null;
        menu.meta = meta;
        routers.push(menu);
    }
};