var doctorOrder_manage_tool = null; 
$(function () { 
	initDoctorOrderManageTool(); //建立DoctorOrder管理对象
	doctorOrder_manage_tool.init(); //如果需要通过下拉框查询，首先初始化下拉框的值
	$("#doctorOrder_manage").datagrid({
		url : '/DoctorOrder/list',
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
		sortName : "orderId",
		sortOrder : "desc",
		toolbar : "#doctorOrder_manage_tool",
		columns : [[
			{
				field : "userObj",
				title : "预约用户",
				width : 140,
			},
			{
				field : "doctorObj",
				title : "预约医生",
				width : 140,
			},
			{
				field : "orderDate",
				title : "预约日期",
				width : 140,
			},
			{
				field : "orderTime",
				title : "预约时间",
				width : 140,
			},
			{
				field : "telephone",
				title : "联系电话",
				width : 140,
			},
			{
				field : "handState",
				title : "处理状态",
				width : 140,
			},
			{
				field : "addTime",
				title : "提交时间",
				width : 140,
			},
		]],
	});

	$("#doctorOrderEditDiv").dialog({
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
				if ($("#doctorOrderEditForm").form("validate")) {
					//验证表单 
					if(!$("#doctorOrderEditForm").form("validate")) {
						$.messager.alert("错误提示","你输入的信息还有错误！","warning");
					} else {
						$("#doctorOrderEditForm").form({
						    url:"/DoctorOrder/update/" + $("#doctorOrder_orderId_edit").val(),
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
						    	console.log(data);
			                	var obj = jQuery.parseJSON(data);
			                    if(obj.success){
			                        $.messager.alert("消息","信息修改成功！");
			                        $("#doctorOrderEditDiv").dialog("close");
			                        doctorOrder_manage_tool.reload();
			                    }else{
			                        $.messager.alert("消息",obj.message);
			                    } 
						    }
						});
						//提交表单
						$("#doctorOrderEditForm").submit();
					}
				}
			},
		},{
			text : "取消",
			iconCls : "icon-redo",
			handler : function () {
				$("#doctorOrderEditDiv").dialog("close");
				$("#doctorOrderEditForm").form("reset"); 
			},
		}],
	});
});

function initDoctorOrderManageTool() {
	doctorOrder_manage_tool = {
		init: function() {
			$.ajax({
				url : "/UserInfo/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#userObj_user_name_query").combobox({ 
					    valueField:"user_name",
					    textField:"realName",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{user_name:"",realName:"不限制"});
					$("#userObj_user_name_query").combobox("loadData",data); 
				}
			});
			$.ajax({
				url : "/Doctor/listAll",
				data: {
					"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
				},
				type : "get",
				success : function (data, response, status) {
					$("#doctorObj_doctorNumber_query").combobox({ 
					    valueField:"doctorNumber",
					    textField:"name",
					    panelHeight: "200px",
				        editable: false, //不允许手动输入 
					});
					data.splice(0,0,{doctorNumber:"",name:"不限制"});
					$("#doctorObj_doctorNumber_query").combobox("loadData",data); 
				}
			});
		},
		reload : function () {
			$("#doctorOrder_manage").datagrid("reload");
		},
		redo : function () {
			$("#doctorOrder_manage").datagrid("unselectAll");
		},
		search: function() {
			var queryParams = $("#doctorOrder_manage").datagrid("options").queryParams;
			queryParams["userObj.user_name"] = $("#userObj_user_name_query").combobox("getValue");
			queryParams["doctorObj.doctorNumber"] = $("#doctorObj_doctorNumber_query").combobox("getValue");
			queryParams["orderDate"] = $("#orderDate").datebox("getValue"); 
			queryParams["telephone"] = $("#telephone").val();
			queryParams["handState"] = $("#handState").val();
			queryParams["addTime"] = $("#addTime").datebox("getValue"); 
			queryParams["csrfmiddlewaretoken"] = $('input[name="csrfmiddlewaretoken"]').val();
			$("#doctorOrder_manage").datagrid("options").queryParams=queryParams; 
			$("#doctorOrder_manage").datagrid("load");
		},
		exportExcel: function() {
			$("#doctorOrderQueryForm").form({
			    url:"/DoctorOrder/OutToExcel?csrfmiddlewaretoken" + $('input[name="csrfmiddlewaretoken"]').val(),
			});
			//提交表单
			$("#doctorOrderQueryForm").submit();
		},
		remove : function () {
			var rows = $("#doctorOrder_manage").datagrid("getSelections");
			if (rows.length > 0) {
				$.messager.confirm("确定操作", "您正在要删除所选的记录吗？", function (flag) {
					if (flag) {
						var orderIds = [];
						for (var i = 0; i < rows.length; i ++) {
							orderIds.push(rows[i].orderId);
						}
						$.ajax({
							type : "POST",
							url : "/DoctorOrder/deletes",
							data : {
								orderIds : orderIds.join(","),
								"csrfmiddlewaretoken": $('input[name="csrfmiddlewaretoken"]').val()
							},
							beforeSend : function () {
								$("#doctorOrder_manage").datagrid("loading");
							},
							success : function (data) {
								if (data.success) {
									$("#doctorOrder_manage").datagrid("loaded");
									$("#doctorOrder_manage").datagrid("load");
									$("#doctorOrder_manage").datagrid("unselectAll");
									$.messager.show({
										title : "提示",
										msg : data.message
									});
								} else {
									$("#doctorOrder_manage").datagrid("loaded");
									$("#doctorOrder_manage").datagrid("load");
									$("#doctorOrder_manage").datagrid("unselectAll");
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
			var rows = $("#doctorOrder_manage").datagrid("getSelections");
			if (rows.length > 1) {
				$.messager.alert("警告操作！", "编辑记录只能选定一条数据！", "warning");
			} else if (rows.length == 1) {
				$.ajax({
					url : "/DoctorOrder/update/" + rows[0].orderId,
					type : "get",
					data : {
						//orderId : rows[0].orderId,
					},
					beforeSend : function () {
						$.messager.progress({
							text : "正在获取中...",
						});
					},
					success : function (doctorOrder, response, status) {
						$.messager.progress("close");
						if (doctorOrder) { 
							$("#doctorOrderEditDiv").dialog("open");
							$("#doctorOrder_orderId_edit").val(doctorOrder.orderId);
							$("#doctorOrder_orderId_edit").validatebox({
								required : true,
								missingMessage : "请输入记录编号",
								editable: false
							});
							$("#doctorOrder_userObj_user_name_edit").combobox({
								url:"/UserInfo/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"user_name",
							    textField:"realName",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#doctorOrder_userObj_user_name_edit").combobox("select", doctorOrder.userObjPri);
									//var data = $("#doctorOrder_userObj_user_name_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#doctorOrder_userObj_user_name_edit").combobox("select", data[0].user_name);
						            //}
								}
							});
							$("#doctorOrder_doctorObj_doctorNumber_edit").combobox({
								url:"/Doctor/listAll?csrfmiddlewaretoken=" + $('input[name="csrfmiddlewaretoken"]').val(),
								method: "GET",
							    valueField:"doctorNumber",
							    textField:"name",
							    panelHeight: "auto",
						        editable: false, //不允许手动输入 
						        onLoadSuccess: function () { //数据加载完毕事件
									$("#doctorOrder_doctorObj_doctorNumber_edit").combobox("select", doctorOrder.doctorObjPri);
									//var data = $("#doctorOrder_doctorObj_doctorNumber_edit").combobox("getData"); 
						            //if (data.length > 0) {
						                //$("#doctorOrder_doctorObj_doctorNumber_edit").combobox("select", data[0].doctorNumber);
						            //}
								}
							});
							$("#doctorOrder_orderDate_edit").datebox({
								value: doctorOrder.orderDate,
							    required: true,
							    showSeconds: true,
							});
							$("#doctorOrder_orderTime_edit").val(doctorOrder.orderTime);
							$("#doctorOrder_telephone_edit").val(doctorOrder.telephone);
							$("#doctorOrder_telephone_edit").validatebox({
								required : true,
								missingMessage : "请输入联系电话",
							});
							$("#doctorOrder_reason_edit").val(doctorOrder.reason);
							$("#doctorOrder_handState_edit").val(doctorOrder.handState);
							$("#doctorOrder_handState_edit").validatebox({
								required : true,
								missingMessage : "请输入处理状态",
							});
							$("#doctorOrder_replyContent_edit").val(doctorOrder.replyContent);
							$("#doctorOrder_addTime_edit").datetimebox({
								value: doctorOrder.addTime,
							    required: true,
							    showSeconds: true,
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
