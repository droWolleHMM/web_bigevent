// 发起 $.post() 或 $.get() 或 $.ajax() 请求时都会先执行这个函数 ajaxPrefilter() 函数
// 调用这个函数 会先获得内置对象
$.ajaxPrefilter(function(options) {
    // 拼接URL 地址
    // console.log(options.url);
    options.url = 'http://ajax.frontend.itheima.net/' + options.url;
});