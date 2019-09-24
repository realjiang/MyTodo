/**
 * Created by jiang on 2019/9/1 .
 */
;(function (){
  'use strict';

  var $form_add_task = $('.add-task'),
    $delete_task,
    task_list = [];

  init();

  $form_add_task.on('submit',on_add_task_form_submit);
  function on_add_task_form_submit(e){
    var   new_task = {};
    //禁用默认行为
    e.preventDefault();
    //获取新task的值
    var $input = $(this).find('input[name=content]');
    new_task.content =$input.val();
    //如果新task的值为空，就不继续执行了，直接返回，否则继续执行
    if(!new_task.content) return;
    //  存入新task
    if(add_task(new_task)){
      $input.val(null);
    }
  }
  //单独封装到一个函数中，init阶段调用，解决不能持续监听（只能删除第一次点击的）的问题
  //因为jQuery不会自动绑定数据和view的变化，需要我们手动将变化的内容添加到监控源
  //查找并监听所有删除按钮的点击事件
  function listen_task_delete(){
    $delete_task.on('click',function () {
      var $this = $(this);
      //找到删除按钮所在的task元素
      var $item = $this.parent().parent();
      //确认删除
      var tmp = confirm('确定删除？');
      var index = $item.data('index');
      tmp ? delete_task(index) : null;
    })
  }

  function add_task(new_task){
    //将新task推入task_list
    task_list.push(new_task);
    //更新localStorage
    refresh_task_list();
    // console.log('task_list',task_list);
    // store.clear();
    return true;
  }
  //刷新localStorage数据并渲染模板tpl
  function refresh_task_list(){
    store.set('task_list',task_list);
    render_task_list();
  }
  //删除一条task
  function delete_task(index){
    //如果没有index或者index不存在则直接返回
    if(index === undefined || !task_list[index]) return;
    delete task_list[index];
    //更新localStorage
    refresh_task_list();
  }
  function init(){
    // store.clear();
    task_list = store.get('task_list') || [];
    if(task_list.length){
      render_task_list();
    }
  }
  //渲染全部的task模板
  function render_task_list() {
    var $task_list = $('.task-list');
    $task_list.html('');
    for(var i = 0;i < task_list.length;i++){
       var $task = render_task_item(task_list[i],i);
       $task_list.append($task);
    }
    $delete_task = $('.action.delete');
    listen_task_delete();
  }
  //渲染单条task模板
  function render_task_item(data,index){
    if (!data || !index) return;
    var list_item_tpl =
      '<div class="task-item" data-index = "' + index + '">'+
       '<span><input type="checkbox"></span>'+
       '<span class="task-content">' + data.content + '</span>'+
      '<span class = "fr">'+
       '<span class="action delete"> 删除 </span>'+
        '<span class="action detail"> 详情 </span>'+
      '</span>'+
      '</div>';
    return $(list_item_tpl);
  }
})();
