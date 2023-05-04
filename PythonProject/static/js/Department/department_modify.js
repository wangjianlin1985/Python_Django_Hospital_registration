$(function () {
    //实例化科室介绍编辑器
    tinyMCE.init({
        selector: "#department_departmentDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Department/update/" + $("#department_departmentNo_modify").val(),
		type : "get",
		data : {
			//departmentNo : $("#department_departmentNo_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (department, response, status) {
			$.messager.progress("close");
			if (department) { 
				$("#department_departmentNo_modify").val(department.departmentNo);
				$("#department_departmentNo_modify").validatebox({
					required : true,
					missingMessage : "请输入科室编号",
					editable: false
				});
				$("#department_departmentName_modify").val(department.departmentName);
				$("#department_departmentName_modify").validatebox({
					required : true,
					missingMessage : "请输入科室名称",
				});
				$("#department_madeDate_modify").datebox({
					value: department.madeDate,
					required: true,
					showSeconds: true,
				});
				$("#department_telephone_modify").val(department.telephone);
				$("#department_telephone_modify").validatebox({
					required : true,
					missingMessage : "请输入联系电话",
				});
				$("#department_chargeMan_modify").val(department.chargeMan);
				$("#department_chargeMan_modify").validatebox({
					required : true,
					missingMessage : "请输入负责人",
				});
				tinyMCE.editors['department_departmentDesc_modify'].setContent(department.departmentDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#departmentModifyButton").click(function(){ 
		if ($("#departmentModifyForm").form("validate")) {
			$("#departmentModifyForm").form({
			    url:"Department/update/" + $("#department_departmentNo_modify").val(),
			    onSubmit: function(){
					if($("#departmentEditForm").form("validate"))  {
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
                	var obj = jQuery.parseJSON(data);
                    if(obj.success){
                        $.messager.alert("消息","信息修改成功！");
                        $(".messager-window").css("z-index",10000);
                        //location.href="frontlist";
                    }else{
                        $.messager.alert("消息",obj.message);
                        $(".messager-window").css("z-index",10000);
                    } 
			    }
			});
			//提交表单
			$("#departmentModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
