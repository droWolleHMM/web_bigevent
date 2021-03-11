// 发起 $.post() 或 $.get() 或 $.ajax() 请求时都会先执行这个函数 ajaxPrefilter() 函数
// 调用这个函数 会先获得内置对象
$.ajaxPrefilter(function(options) {
    // 拼接URL 地址
    // console.log(options.url);
    options.url = 'http://ajax.frontend.itheima.net/' + options.url;
    // 为所有有请求的接口添加 headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }

    };

    // 全局挂载 complete 回调函数
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //清除 token
            localStorage.removeItem('token');
            // 强制返回 注册页面
            location.href = '/login.html';

        }

    }
});