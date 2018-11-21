/**
 * 日期控件初始化
 * @param obj         //DOM节点ID
 * @param format      //日期返回格式 yyyy-mm-dd  yyyy-mm-dd hh:ii:ss
 * @param minView     //选择时间的层数 0:选择到小时 2:选择到天
 * @param fn          //回调方法 点击之后获取日期
 */
function initDate(obj,format,minView,fn,startDay){
    $(obj).datetimepicker({
        language:  'zh-CN',
        format: format,
        weekStart: 1,
        todayBtn:  2,
        autoclose: 1,
        todayHighlight: 2,
        startView: 2,
        minView: minView,
        forceParse: 0,
        startDate:startDay,
        clearBtn:true
    }).on('changeDate',function(){
        fn && fn(this.value);
    });
}


