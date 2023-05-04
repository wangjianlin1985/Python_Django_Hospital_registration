$(function () {
	//实例化医生介绍编辑器
    tinyMCE.init({
        selector: "#doctor_doctorDesc",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
	$("#doctor_doctorNumber").validatebox({
		required : true, 
		missingMessage : '请输入医生编号',
	});

	$("#doctor_password").validatebox({
		required : true, 
		missingMessage : '请输入登陆密码',
	});

	$("#doctor_name").validatebox({
		required : true, 
		missingMessage : '请输入姓名',
	});

	$("#doctor_sex").validatebox({
		required : true, 
		missingMessage : '请输入性别',
	});

	$("#doctor_age").validatebox({
		required : true,
		validType : "integer",
		missingMessage : '请输入年龄',
		invalidMessage : '年龄输入不对',
	});

	$("#doctor_zhicheng").validatebox({
		required : true, 
		missingMessage : '请输入职称',
	});

	$("#doctor_inDate").datebox({
	    required : true, 
	    showSeconds: true,
	    editable: false
	});

	$("#doctor_telphone").validatebox({
		required : true, 
		missingMessage : '请输入联系电话',
	});

	//单击添加按钮
	$("#doctorAddButton").click(function () {
		if(tinyMCE.editors['doctor_doctorDesc'].getContent() == "") {
			alert("请输入医生介绍");
			return;
		}
		//验证表单 
		if(!$("#doctorAddForm").form("validate")) {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		} else {
			$("#doctorAddForm").form({
			    url:"/Doctor/add",
				queryParams: {
			    	"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
			    onSubmit: function(){
					if($("#doctorAddForm").form("validate"))  { 
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
                        $("#doctorAddForm").form("clear");
                        tinyMCE.editors['doctor_doctorDesc'].setContent("");
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    }
			    }
			});
			//提交表单
			$("#doctorAddForm").submit();
		}
	});

	//单击清空按钮
	$("#doctorClearButton").click(function () { 
		//$("#doctorAddForm").form("clear"); 
		location.reload()
	});
});
