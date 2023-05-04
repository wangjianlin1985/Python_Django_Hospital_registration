$(function () {
    //实例化病人病例编辑器
    tinyMCE.init({
        selector: "#patient_illnessCase_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Patient/update/" + $("#patient_patientId_modify").val(),
		type : "get",
		data : {
			//patientId : $("#patient_patientId_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (patient, response, status) {
			$.messager.progress("close");
			if (patient) { 
				$("#patient_patientId_modify").val(patient.patientId);
				$("#patient_patientId_modify").validatebox({
					required : true,
					missingMessage : "请输入病人id",
					editable: false
				});
				$("#patient_patientName_modify").val(patient.patientName);
				$("#patient_patientName_modify").validatebox({
					required : true,
					missingMessage : "请输入病人姓名",
				});
				$("#patient_sex_modify").val(patient.sex);
				$("#patient_sex_modify").validatebox({
					required : true,
					missingMessage : "请输入病人性别",
				});
				$("#patient_cardNumber_modify").val(patient.cardNumber);
				$("#patient_cardNumber_modify").validatebox({
					required : true,
					missingMessage : "请输入身份证号",
				});
				$("#patient_telephone_modify").val(patient.telephone);
				$("#patient_telephone_modify").validatebox({
					required : true,
					missingMessage : "请输入联系电话",
				});
				tinyMCE.editors['patient_illnessCase_modify'].setContent(patient.illnessCase);
				$("#patient_doctorObj_doctorNumber_modify").combobox({
					url:"/Doctor/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"doctorNumber",
					textField:"name",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#patient_doctorObj_doctorNumber_modify").combobox("select", patient.doctorObjPri);
						//var data = $("#patient_doctorObj_doctorNumber_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#patient_doctorObj_doctorNumber_edit").combobox("select", data[0].doctorNumber);
						//}
					}
				});
				$("#patient_addTime_modify").datetimebox({
					value: patient.addTime,
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

	$("#patientModifyButton").click(function(){ 
		if ($("#patientModifyForm").form("validate")) {
			$("#patientModifyForm").form({
			    url:"Patient/update/" + $("#patient_patientId_modify").val(),
			    onSubmit: function(){
					if($("#patientEditForm").form("validate"))  {
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
			$("#patientModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
