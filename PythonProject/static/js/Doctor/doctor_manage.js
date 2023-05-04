var doctor_manage_tool = null; 
$(function () { 
	initDoctorManageTool(); //建立Doctor管理对象
	doctor_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#doctor_manage").datagrid({
		url : '/Doctor/list',
		queryParams: {
			"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
		},
		fit : true,
		fitColumns : true,
		striped : true,
		rownumbers : true,
		border : false,
		pagination : true,
		pageSize : 5,
		pageList : [5, 10, 15, 20, 25],
		pageNumber : 1,
		sortName : "doctorNumber",
		sortOrder : "desc",
		toolbar : "#doctor_manage_tool",
		columns : [[
			{
				field : "doctorNumber",
				title : "医生编号",
				width : 140,
			},
			{
				field : "departmentObj",
				title : "所在科室",
				width : 140,
			},
			{
				field : "name",
				title : "姓名",
				width : 140,
			},
			{
				field : "sex",
				title : "性别",
				width : 140,
			},
			{
				field : "age",
				title : "年龄",
				width : 70,
			},
			{
				field : "doctorPhoto",
				title : "医生照片",
				width : "70px",
				height: "65px",
				formatter: function(val,row) {
					return "<img src='" + val + "' width='65px' height='55px' />";
				}
 			},
			{
				field : "schoolRecordObj",
				title : "学历",
				width : 140,
			},
			{
				field : "zhicheng",
				title : "职称",
				width : 140,
			},
			{
				field : "inDate",
				title : "入院日期",
				width : 140,
			},
			{
				field : "telphone",
				title : "联系电话",
				width : 140,
			},
		]],
	});

	$("#doctorEditDiv").dialog({
		title : "修改管理",
		top: "10px",
		width : 1000,
		height : 600,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#doctorEditForm").form("validate")) {
					//验证表单 
					if(!$("#doctorEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#doctorEditForm").form({
						    url:"/Doctor/update/" + $("#doctor_doctorNumber_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#doctorEditDiv").dialog("close");
			                        doctor_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#doctorEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#doctorEditDiv").dialog("close");
				$("#doctorEditForm").form("reset"); 
			},
		}],
	});
});

function initDoctorManageTool() {
	doctor_manage_tool = {
		init: function() {
			$.ajax({
				url : "/Department/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#departmentObj_departmentNo_query").combobox({ 
					    valueField:"departmentNo",
					    textField:"departmentName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{departmentNo:"",departmentName:"不限制"});
					$("#departmentObj_departmentNo_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/SchoolRecord/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#schoolRecordObj_schoolRecordId_query").combobox({ 
					    valueField:"schoolRecordId",
					    textField:"schoolRecordName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{schoolRecordId:0,schoolRecordName:"不限制"});
					$("#schoolRecordObj_schoolRecordId_query").combobox("loadData",data); 
				}
			});

			//实例化编辑器
			tinyMCE.init({
				selector: "#doctor_doctorDesc_edit",
				theme: 'advanced',
				language: "zh",
				strict_loading_mode: 1,
			});
		},
		reload : function () {
			$("#doctor_manage").datagrid("reload");
		},
		redo : function () {
			$("#doctor_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#doctor_manage").datagrid("options").queryParams;
			queryParams["doctorNumber"] = $("#doctorNumber").val();
			queryParams["departmentObj.departmentNo"] = $("#departmentObj_departmentNo_query").combobox("getValue");
			queryParams["name"] = $("#name").val();
			queryParams["schoolRecordObj.schoolRecordId"] = $("#schoolRecordObj_schoolRecordId_query").combobox("getValue");
			queryParams["zhicheng"] = $("#zhicheng").val();
			queryParams["inDate"] = $("#inDate").datebox("getValue"); 
			queryParams["telphone"] = $("#telphone").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#doctor_manage").datagrid("options").queryParams=queryParams; 
			$("#doctor_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#doctorQueryForm").form({
			    url:"/Doctor/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#doctorQueryForm").submit();
		},
		remove : function () {
			var rows = $("#doctor_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var doctorNumbers = [];
						for (var i = 0; i < rows.length; i ++) {
							doctorNumbers.push(rows[i].doctorNumber);
						}
						$.ajax({
							type : "POST",
							url : "/Doctor/deletes",
							data : {
								doctorNumbers : doctorNumbers.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#doctor_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#doctor_manage").datagrid("loaded");
									$("#doctor_manage").datagrid("load");
									$("#doctor_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#doctor_manage").datagrid("loaded");
									$("#doctor_manage").datagrid("load");
									$("#doctor_manage").datagrid("unselectAll");
									$.messager.alert("消息",data.message);
								}
							},
						});
					}
				});
			} else {
				$.messager.alert("提示", "请选择要删除的记录！", "info");
			}
		},
		edit : function () {
			var rows = $("#doctor_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Doctor/update/" + rows[0].doctorNumber,
					type : "get",
					data : {
						//doctorNumber : rows[0].doctorNumber,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (doctor, response, status) {
						$.messager.progress("close");
						if (doctor) { 
							$("#doctorEditDiv").dialog("open");
							$("#doctor_doctorNumber_edit").val(doctor.doctorNumber);
							$("#doctor_doctorNumber_edit").validatebox({
								required : true,
								missingMessage : "请输入医生编号",
								editable: false
							});
							$("#doctor_password_edit").val(doctor.password);
							$("#doctor_password_edit").validatebox({
								required : true,
								missingMessage : "请输入登陆密码",
							});
							$("#doctor_departmentObj_departmentNo_edit").combobox({
								url:"/Department/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"departmentNo",
							    textField:"departmentName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#doctor_departmentObj_departmentNo_edit").combobox("select", doctor.departmentObjPri);
									//var data = $("#doctor_departmentObj_departmentNo_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#doctor_departmentObj_departmentNo_edit").combobox("select", data[0].departmentNo);
						            //}
								}
							});
							$("#doctor_name_edit").val(doctor.name);
							$("#doctor_name_edit").validatebox({
								required : true,
								missingMessage : "请输入姓名",
							});
							$("#doctor_sex_edit").val(doctor.sex);
							$("#doctor_sex_edit").validatebox({
								required : true,
								missingMessage : "请输入性别",
							});
							$("#doctor_age_edit").val(doctor.age);
							$("#doctor_age_edit").validatebox({
								required : true,
								validType : "integer",
								missingMessage : "请输入年龄",
								invalidMessage : "年龄输入不对",
							});
							$("#doctor_doctorPhotoImg").attr("src", doctor.doctorPhoto);
							$("#doctor_schoolRecordObj_schoolRecordId_edit").combobox({
								url:"/SchoolRecord/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"schoolRecordId",
							    textField:"schoolRecordName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#doctor_schoolRecordObj_schoolRecordId_edit").combobox("select", doctor.schoolRecordObjPri);
									//var data = $("#doctor_schoolRecordObj_schoolRecordId_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#doctor_schoolRecordObj_schoolRecordId_edit").combobox("select", data[0].schoolRecordId);
						            //}
								}
							});
							$("#doctor_zhicheng_edit").val(doctor.zhicheng);
							$("#doctor_zhicheng_edit").validatebox({
								required : true,
								missingMessage : "请输入职称",
							});
							$("#doctor_inDate_edit").datebox({
								value: doctor.inDate,
							    required: true,
							    showSeconds: true,
							});
							$("#doctor_telphone_edit").val(doctor.telphone);
							$("#doctor_telphone_edit").validatebox({
								required : true,
								missingMessage : "请输入联系电话",
							});
							tinyMCE.editors['doctor_doctorDesc_edit'].setContent(doctor.doctorDesc);
						} else {
							$.messager.alert("获取失败！", "未知错误导致失败，请重试！", "warning");
						}
					}
				});
			} else if (rows.length == 0) {
				$.messager.alert("警告操作！", "编辑记录至少选定一条数据！", "warning");
			}
		},
	};
}
