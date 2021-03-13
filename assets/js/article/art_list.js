$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 定义一个查询对象 需要用到时上传到服务器
    var q = {
        pagenum: 1, // 页码值，默认显示第一页的数据
        pagesize: 2, // 每页显示几条数据，默认是两条
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
    }


    // 定义美化时间函数
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date);


        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDay());


        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;

    }


    // 定义补零函数
    function padZero(n) {
        n > 9 ? n : '0' + n;
    }


    initTable();
    initCate();


    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板数据渲染数据
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染数据的方法
                renderPage(res.total);
            }
        })
    }



    // 获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }

                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render();

            }

        })
    }


    // 为表格添加 submit 点击事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询的 q 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新条件重新渲染数据
        initTable();
    })


    // 渲染分页数据
    function renderPage(total) {
        // console.log(total);
        // 使用laypage.render() 渲染分页数据
        laypage.render({
            elem: 'pageBox', // 装分页的盒子 id
            count: total, // 数据的总数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 显示哪一个分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 当页面切换时会调用 jump 这个函数
            jump: function(obj, first) {
                //获取点击的页面值
                // 可以根据 first 的值判断是哪一种方式触发的函数
                // 如果 first 的结果是 true 则是第2种触发方式
                // 否则是 第二种触发方式
                // console.log(first);
                // console.log(obj.curr);
                // 吧点击的页面值赋值给 q 查询对象
                // 调用 jump 函数有两种方法
                // 1. 当点击分页的时候的会调用 jump 回调
                // 2. 当调用 render() 函数是会调用 jump 回调
                q.pagenum = obj.curr;
                // 把每页显示数据给 q 对象上
                q.pagesize = obj.limit;
                // initTable(); // 会一直死循环
                if (!first) {
                    initTable();
                }
            }
        })
    }


    // 通过代理的方式为删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // 获取自定义属性
        var id = $(this).attr('data-id');
        //弹出询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 当删除文章后先验证这一页面是否还有数据如果没有数据则让页面值 - 1 然后调用 initTable()
                    if (len === 1) {
                        // 如果删除按钮个数为1则删除完后页面值 -1
                        // 页面值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }

            })
            layer.close(index);
        });
    })
})