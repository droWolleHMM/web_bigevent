$(function() {
    getUserInfo();

    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 清除本地的 token 值
            localStorage.removeItem('token');
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    });
});



//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        url: 'my/userinfo',
        method: 'GET',
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('用户请求失败！')
            }
            // 调用渲染头像的函数
            getRenderAvatar(res.data);
        },
        // 验证成功与否强制执行这个函数
        // complete: function(res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //清除 token
        //         localStorage.removeItem('token');
        //         // 强制返回 注册页面
        //         location.href = '/login.html';

        //     };
        // }
    })
};



// 渲染头像函数
function getRenderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 设置欢迎语
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染用户的头像
    if (user.user_pic !== null) {
        // 有图片
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 没有图片时显示文本
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
};