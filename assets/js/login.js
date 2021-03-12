$(function() {
    $('#link_reg').on('click', function() {
        $('.reg-box').show();
        $('.login-box').hide();
    });


    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 使用 layui 自定义验证 Form.verify()
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 验证密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 两次密码验证
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (value !== pwd) {
                return '两次密码输入不一致！'
            }
        }
    });

    // 表单的提交按钮
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = { username: $('.reg-box [name=username]').val(), password: $('.reg-box [name=password]').val() };

        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！');
            // 模拟人的点击行为
            $('#link_login').click();
        });
    });


    // 登录表单按钮
    $('#form_login').submit(function(e) {
        // 阻止默认行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！');
                // console.log(res.token);
                // 将获取的 token 值存放到本地存储中
                localStorage.setItem('token', res.token);
                // 跳转到后台管理页面
                location.href = '/index.html'
            }
        });
    });
});