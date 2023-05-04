var schoolRecord_manage_tool = null; 
$(function () { 
	initSchoolRecordManageTool(); //建立SchoolRecord管理对象
	schoolRecord_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#schoolRecord_manage").datagrid({
		url : '/SchoolRecord/list',
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
		sortName : "schoolRecordId",
		sortOrder : "desc",
		toolbar : "#schoolRecord_manage_tool",
		columns : [[
			{
				field : "schoolRecordId",
				title : "记录编号",
				width : 70,
			},
			{
				field : "schoolRecordName",
				title : "学历名称",
				width : 140,
			},
		]],
	});

	$("#schoolRecordEditDiv").dialog({
		title : "修改管理",
		top: "50px",
		width : 700,
		height : 515,
		modal : true,
		closed : true,
		iconCls : "icon-edit-new",
		buttons : [{
			text : "提交",
			iconCls : "icon-edit-new",
			handler : function () {
				if ($("#schoolRecordEditForm").form("validate")) {
					//验证表单 
					if(!$("#schoolRecordEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#schoolRecordEditForm").form({
						    url:"/SchoolRecord/update/" + $("#schoolRecord_schoolRecordId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#schoolRecordEditDiv").dialog("close");
			                        schoolRecord_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#schoolRecordEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#schoolRecordEditDiv").dialog("close");
				$("#schoolRecordEditForm").form("reset"); 
			},
		}],
	});
});

function initSchoolRecordManageTool() {
	schoolRecord_manage_tool = {
		init: function() {
		},
		reload : function () {
			$("#schoolRecord_manage").datagrid("reload");
		},
		redo : function () {
			$("#schoolRecord_manage").datagrid("unselectAll");
		},
		search: function() {
			$("#schoolRecord_manage").datagrid("options").queryParams=queryParams; 
			$("#schoolRecord_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#schoolRecordQueryForm").form({
			    url:"/SchoolRecord/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#schoolRecordQueryForm").submit();
		},
		remove : function () {
			var rows = $("#schoolRecord_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var schoolRecordIds = [];
						for (var i = 0; i < rows.length; i ++) {
							schoolRecordIds.push(rows[i].schoolRecordId);
						}
						$.ajax({
							type : "POST",
							url : "/SchoolRecord/deletes",
							data : {
								schoolRecordIds : schoolRecordIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#schoolRecord_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#schoolRecord_manage").datagrid("loaded");
									$("#schoolRecord_manage").datagrid("load");
									$("#schoolRecord_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#schoolRecord_manage").datagrid("loaded");
									$("#schoolRecord_manage").datagrid("load");
									$("#schoolRecord_manage").datagrid("unselectAll");
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
			var rows = $("#schoolRecord_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/SchoolRecord/update/" + rows[0].schoolRecordId,
					type : "get",
					data : {
						//schoolRecordId : rows[0].schoolRecordId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (schoolRecord, response, status) {
						$.messager.progress("close");
						if (schoolRecord) { 
							$("#schoolRecordEditDiv").dialog("open");
							$("#schoolRecord_schoolRecordId_edit").val(schoolRecord.schoolRecordId);
							$("#schoolRecord_schoolRecordId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录编号",
								editable: false
							});
							$("#schoolRecord_schoolRecordName_edit").val(schoolRecord.schoolRecordName);
							$("#schoolRecord_schoolRecordName_edit").validatebox({
								required : true,
								missingMessage : "请输入学历名称",
							});
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
