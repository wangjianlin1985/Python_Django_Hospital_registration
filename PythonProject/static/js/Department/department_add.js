$(function () {
	//实例化科室介绍编辑器
    tinyMCE.init({
        selector: "#department_departmentDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#department_departmentNo").validatebox({
		required : true, 
		missingMessage : '请输入科室编号',
	});

	$("#department_departmentName").validatebox({
		required : true, 
		missingMessage : '请输入科室名称',
	});

	$("#department_madeDate").datebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#department_telephone").validatebox({
		required : true, 
		missingMessage : '请输入联系电话',
	});

	$("#department_chargeMan").validatebox({
		required : true, 
		missingMessage : '请输入负责人',
	});

	//单击添加按钮
	$("#departmentAddButton").click(function () {
		if(tinyMCE.editors['department_departmentDesc'].getContent() == "") {
			alert("请输入科室介绍");
			return;
		}
		//验证表单 
		if(!$("#departmentAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#departmentAddForm").form({
			    url:"/Department/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#departmentAddForm").form("validate"))  { 
	                	$.messager.progress({
							text : "正在提交数据中...",
						}); 
	                	return true;
	                } else {
	                    return false;
	                }
			    },
			    success:function(data){
			    	$.messager.progress("close");
                    //此处data={"Success":true}是字符串
                	var obj = jQuery.parseJSON(data); 
                    if(obj.success){ 
                        $.messager.alert("消息","保存成功！");
                        $(".messager-window").css("z-index",10000);
                        $("#departmentAddForm").form("clear");
                        tinyMCE.editors['department_departmentDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#departmentAddForm").submit();
		}
	});

	//单击清空按钮
	$("#departmentClearButton").click(function () { 
		//$("#departmentAddForm").form("clear"); 
		location.reload()
	});
});
