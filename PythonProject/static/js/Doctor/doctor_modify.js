$(function () {
    //实例化医生介绍编辑器
    tinyMCE.init({
        selector: "#doctor_doctorDesc_modify",
        theme: 'advanced',
        language: "zh",
        strict_loading_mode: 1,
    });
    setTimeout(ajaxModifyQuery,"100");
  function ajaxModifyQuery() {	
	$.ajax({
		url : "/Doctor/update/" + $("#doctor_doctorNumber_modify").val(),
		type : "get",
		data : {
			//doctorNumber : $("#doctor_doctorNumber_modify").val(),
		},
		beforeSend : function () {
			$.messager.progress({
				text : "正在获取中...",
			});
		},
		success : function (doctor, response, status) {
			$.messager.progress("close");
			if (doctor) { 
				$("#doctor_doctorNumber_modify").val(doctor.doctorNumber);
				$("#doctor_doctorNumber_modify").validatebox({
					required : true,
					missingMessage : "请输入医生编号",
					editable: false
				});
				$("#doctor_password_modify").val(doctor.password);
				$("#doctor_password_modify").validatebox({
					required : true,
					missingMessage : "请输入登陆密码",
				});
				$("#doctor_departmentObj_departmentNo_modify").combobox({
					url:"/Department/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"departmentNo",
					textField:"departmentName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#doctor_departmentObj_departmentNo_modify").combobox("select", doctor.departmentObjPri);
						//var data = $("#doctor_departmentObj_departmentNo_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#doctor_departmentObj_departmentNo_edit").combobox("select", data[0].departmentNo);
						//}
					}
				});
				$("#doctor_name_modify").val(doctor.name);
				$("#doctor_name_modify").validatebox({
					required : true,
					missingMessage : "请输入姓名",
				});
				$("#doctor_sex_modify").val(doctor.sex);
				$("#doctor_sex_modify").validatebox({
					required : true,
					missingMessage : "请输入性别",
				});
				$("#doctor_age_modify").val(doctor.age);
				$("#doctor_age_modify").validatebox({
					required : true,
					validType : "integer",
					missingMessage : "请输入年龄",
					invalidMessage : "年龄输入不对",
				});
				$("#doctor_doctorPhotoImgMod").attr("src", doctor.doctorPhoto);
				$("#doctor_schoolRecordObj_schoolRecordId_modify").combobox({
					url:"/SchoolRecord/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
					method: "GET",
					valueField:"schoolRecordId",
					textField:"schoolRecordName",
					panelHeight: "auto",
					editable: false, //不允许手动输入 
					onLoadSuccess: function () { //数据加载完毕事件
						$("#doctor_schoolRecordObj_schoolRecordId_modify").combobox("select", doctor.schoolRecordObjPri);
						//var data = $("#doctor_schoolRecordObj_schoolRecordId_edit").combobox("getData"); 
						//if (data.length > 0) {
							//$("#doctor_schoolRecordObj_schoolRecordId_edit").combobox("select", data[0].schoolRecordId);
						//}
					}
				});
				$("#doctor_zhicheng_modify").val(doctor.zhicheng);
				$("#doctor_zhicheng_modify").validatebox({
					required : true,
					missingMessage : "请输入职称",
				});
				$("#doctor_inDate_modify").datebox({
					value: doctor.inDate,
					required: true,
					showSeconds: true,
				});
				$("#doctor_telphone_modify").val(doctor.telphone);
				$("#doctor_telphone_modify").validatebox({
					required : true,
					missingMessage : "请输入联系电话",
				});
				tinyMCE.editors['doctor_doctorDesc_modify'].setContent(doctor.doctorDesc);
			} else {
				$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
				$(".messager-window").css("z-index",10000);
			}
		}
	});

  }

	$("#doctorModifyButton").click(function(){ 
		if ($("#doctorModifyForm").form("validate")) {
			$("#doctorModifyForm").form({
			    url:"Doctor/update/" + $("#doctor_doctorNumber_modify").val(),
			    onSubmit: function(){
					if($("#doctorEditForm").form("validate"))  {
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
			$("#doctorModifyForm").submit();
		} else {
			$.messager.alert("错误提示","你输入的信息还有错误！","warning");
			$(".messager-window").css("z-index",10000);
		}
	});
});
