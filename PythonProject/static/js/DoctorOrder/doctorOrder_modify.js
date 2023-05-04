$(function () {
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/DoctorOrder/update/" + $("#doctorOrder_orderId_modify").val(),
		type : "get",
		data : {
			//orderId : $("#doctorOrder_orderId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (doctorOrder, response, status) {
			$.messager.progress("close");
			if (doctorOrder) { 
				$("#doctorOrder_orderId_modify").val(doctorOrder.orderId);
				$("#doctorOrder_orderId_modify").validatebox({
					required : true,
					missingMessage : "请输入记录编号",
					editable: false
				});
				$("#doctorOrder_userObj_user_name_modify").combobox({
					url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"user_name",
					textField:"realName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#doctorOrder_userObj_user_name_modify").combobox("select", doctorOrder.userObjPri);
						//var data = $("#doctorOrder_userObj_user_name_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#doctorOrder_userObj_user_name_edit").combobox("select", data[0].user_name);
						//}
					}
				});
				$("#doctorOrder_doctorObj_doctorNumber_modify").combobox({
					url:"/Doctor/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"doctorNumber",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#doctorOrder_doctorObj_doctorNumber_modify").combobox("select", doctorOrder.doctorObjPri);
						//var data = $("#doctorOrder_doctorObj_doctorNumber_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#doctorOrder_doctorObj_doctorNumber_edit").combobox("select", data[0].doctorNumber);
						//}
					}
				});
				$("#doctorOrder_orderDate_modify").datebox({
					value: doctorOrder.orderDate,
					required: true,
					showSeconds: true,
				});
				$("#doctorOrder_orderTime_modify").val(doctorOrder.orderTime);
				$("#doctorOrder_telephone_modify").val(doctorOrder.telephone);
				$("#doctorOrder_telephone_modify").validatebox({
					required : true,
					missingMessage : "请输入联系电话",
				});
				$("#doctorOrder_reason_modify").val(doctorOrder.reason);
				$("#doctorOrder_handState_modify").val(doctorOrder.handState);
				$("#doctorOrder_handState_modify").validatebox({
					required : true,
					missingMessage : "请输入处理状态",
				});
				$("#doctorOrder_replyContent_modify").val(doctorOrder.replyContent);
				$("#doctorOrder_addTime_modify").datetimebox({
					value: doctorOrder.addTime,
					required: true,
					showSeconds: true,
				});
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#doctorOrderModifyButton").click(function(){ 
		if ($("#doctorOrderModifyForm").form("validate")) {
			$("#doctorOrderModifyForm").form({
			    url:"DoctorOrder/update/" + $("#doctorOrder_orderId_modify").val(),
			    onSubmit: function(){
					if($("#doctorOrderEditForm").form("validate"))  {
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
			$("#doctorOrderModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
