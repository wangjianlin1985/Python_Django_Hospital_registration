$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/SchoolRecord/update/" + $("#schoolRecord_schoolRecordId_modify").val(),
		type : "get",
		data : {
			//schoolRecordId : $("#schoolRecord_schoolRecordId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (schoolRecord, response, status) {
			$.messager.progress("close");
			if (schoolRecord) { 
				$("#schoolRecord_schoolRecordId_modify").val(schoolRecord.schoolRecordId);
				$("#schoolRecord_schoolRecordId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录编号",
					editable: false
				});
				$("#schoolRecord_schoolRecordName_modify").val(schoolRecord.schoolRecordName);
				$("#schoolRecord_schoolRecordName_modify").validatebox({
					required : true,
					missingMessage : "请输入学历名称",
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#schoolRecordModifyButton").click(function(){ 
		if ($("#schoolRecordModifyForm").form("validate")) {
			$("#schoolRecordModifyForm").form({
			    url:"SchoolRecord/update/" + $("#schoolRecord_schoolRecordId_modify").val(),
			    onSubmit: function(){
					if($("#schoolRecordEditForm").form("validate"))  {
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
			$("#schoolRecordModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
