var department_manage_tool = null; 
$(function () { 
	initDepartmentManageTool(); //建立Department管理对象
	department_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#department_manage").datagrid({
		url : '/Department/list',
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
		sortName : "departmentNo",
		sortOrder : "desc",
		toolbar : "#department_manage_tool",
		columns : [[
			{
				field : "departmentNo",
				title : "科室编号",
				width : 140,
			},
			{
				field : "departmentName",
				title : "科室名称",
				width : 140,
			},
			{
				field : "madeDate",
				title : "成立日期",
				width : 140,
			},
			{
				field : "telephone",
				title : "联系电话",
				width : 140,
			},
			{
				field : "chargeMan",
				title : "负责人",
				width : 140,
			},
		]],
	});

	$("#departmentEditDiv").dialog({
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
				if ($("#departmentEditForm").form("validate")) {
					//验证表单 
					if(!$("#departmentEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#departmentEditForm").form({
						    url:"/Department/update/" + $("#department_departmentNo_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#departmentEditDiv").dialog("close");
			                        department_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#departmentEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#departmentEditDiv").dialog("close");
				$("#departmentEditForm").form("reset"); 
			},
		}],
	});
});

function initDepartmentManageTool() {
	department_manage_tool = {
		init: function() {
			//实例化编辑器
			tinyMCE.init({
				selector: "#department_departmentDesc_edit",
				theme: 'advanced',
				language: "zh",
				strict_loading_mode: 1,
			});
		},
		reload : function () {
			$("#department_manage").datagrid("reload");
		},
		redo : function () {
			$("#department_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#department_manage").datagrid("options").queryParams;
			queryParams["departmentNo"] = $("#departmentNo").val();
			queryParams["departmentName"] = $("#departmentName").val();
			queryParams["madeDate"] = $("#madeDate").datebox("getValue"); 
			queryParams["chargeMan"] = $("#chargeMan").val();
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#department_manage").datagrid("options").queryParams=queryParams; 
			$("#department_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#departmentQueryForm").form({
			    url:"/Department/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#departmentQueryForm").submit();
		},
		remove : function () {
			var rows = $("#department_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var departmentNos = [];
						for (var i = 0; i < rows.length; i ++) {
							departmentNos.push(rows[i].departmentNo);
						}
						$.ajax({
							type : "POST",
							url : "/Department/deletes",
							data : {
								departmentNos : departmentNos.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#department_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#department_manage").datagrid("loaded");
									$("#department_manage").datagrid("load");
									$("#department_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#department_manage").datagrid("loaded");
									$("#department_manage").datagrid("load");
									$("#department_manage").datagrid("unselectAll");
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
			var rows = $("#department_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/Department/update/" + rows[0].departmentNo,
					type : "get",
					data : {
						//departmentNo : rows[0].departmentNo,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (department, response, status) {
						$.messager.progress("close");
						if (department) { 
							$("#departmentEditDiv").dialog("open");
							$("#department_departmentNo_edit").val(department.departmentNo);
							$("#department_departmentNo_edit").validatebox({
								required : true,
								missingMessage : "请输入科室编号",
								editable: false
							});
							$("#department_departmentName_edit").val(department.departmentName);
							$("#department_departmentName_edit").validatebox({
								required : true,
								missingMessage : "请输入科室名称",
							});
							$("#department_madeDate_edit").datebox({
								value: department.madeDate,
							    required: true,
							    showSeconds: true,
							});
							$("#department_telephone_edit").val(department.telephone);
							$("#department_telephone_edit").validatebox({
								required : true,
								missingMessage : "请输入联系电话",
							});
							$("#department_chargeMan_edit").val(department.chargeMan);
							$("#department_chargeMan_edit").validatebox({
								required : true,
								missingMessage : "请输入负责人",
							});
							tinyMCE.editors['department_departmentDesc_edit'].setContent(department.departmentDesc);
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
