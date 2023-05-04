from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Department.models import Department
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台科室信息添加
    def primaryKeyExist(self, departmentNo):  # 判断主键是否存在
        try:
            Department.objects.get(departmentNo=departmentNo)
            return True
        except Department.DoesNotExist:
            return False

    def get(self,request):

        # 使用模板
        return render(request, 'Department/department_frontAdd.html')

    def post(self, request):
        departmentNo = request.POST.get('department.departmentNo') # 判断科室编号是否存在
        if self.primaryKeyExist(departmentNo):
            return JsonResponse({'success': False, 'message': '科室编号已经存在'})

        department = Department() # 新建一个科室信息对象然后获取参数
        department.departmentNo = departmentNo
        department.departmentName = request.POST.get('department.departmentName')
        department.madeDate = request.POST.get('department.madeDate')
        department.telephone = request.POST.get('department.telephone')
        department.chargeMan = request.POST.get('department.chargeMan')
        department.departmentDesc = request.POST.get('department.departmentDesc')
        department.save() # 保存科室信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改科室信息
    def get(self, request, departmentNo):
        context = {'departmentNo': departmentNo}
        return render(request, 'Department/department_frontModify.html', context)


class FrontListView(BaseView):  # 前台科室信息查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        departmentNo = self.getStrParam(request, 'departmentNo')
        departmentName = self.getStrParam(request, 'departmentName')
        madeDate = self.getStrParam(request, 'madeDate')
        chargeMan = self.getStrParam(request, 'chargeMan')
        # 然后条件组合查询过滤
        departments = Department.objects.all()
        if departmentNo != '':
            departments = departments.filter(departmentNo__contains=departmentNo)
        if departmentName != '':
            departments = departments.filter(departmentName__contains=departmentName)
        if madeDate != '':
            departments = departments.filter(madeDate__contains=madeDate)
        if chargeMan != '':
            departments = departments.filter(chargeMan__contains=chargeMan)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(departments, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        departments_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'departments_page': departments_page,
            'departmentNo': departmentNo,
            'departmentName': departmentName,
            'madeDate': madeDate,
            'chargeMan': chargeMan,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Department/department_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示科室信息详情页
    def get(self, request, departmentNo):
        # 查询需要显示的科室信息对象
        department = Department.objects.get(departmentNo=departmentNo)
        context = {
            'department': department
        }
        # 渲染模板显示
        return render(request, 'Department/department_frontshow.html', context)


class ListAllView(View): # 前台查询所有科室信息
    def get(self,request):
        departments = Department.objects.all()
        departmentList = []
        for department in departments:
            departmentObj = {
                'departmentNo': department.departmentNo,
                'departmentName': department.departmentName,
            }
            departmentList.append(departmentObj)
        return JsonResponse(departmentList, safe=False)


class UpdateView(BaseView):  # Ajax方式科室信息更新
    def get(self, request, departmentNo):
        # GET方式请求查询科室信息对象并返回科室信息json格式
        department = Department.objects.get(departmentNo=departmentNo)
        return JsonResponse(department.getJsonObj())

    def post(self, request, departmentNo):
        # POST方式提交科室信息修改信息更新到数据库
        department = Department.objects.get(departmentNo=departmentNo)
        department.departmentName = request.POST.get('department.departmentName')
        department.madeDate = request.POST.get('department.madeDate')
        department.telephone = request.POST.get('department.telephone')
        department.chargeMan = request.POST.get('department.chargeMan')
        department.departmentDesc = request.POST.get('department.departmentDesc')
        department.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台科室信息添加
    def primaryKeyExist(self, departmentNo):  # 判断主键是否存在
        try:
            Department.objects.get(departmentNo=departmentNo)
            return True
        except Department.DoesNotExist:
            return False

    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'Department/department_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        departmentNo = request.POST.get('department.departmentNo') # 判断科室编号是否存在
        if self.primaryKeyExist(departmentNo):
            return JsonResponse({'success': False, 'message': '科室编号已经存在'})

        department = Department() # 新建一个科室信息对象然后获取参数
        department.departmentNo = departmentNo
        department.departmentName = request.POST.get('department.departmentName')
        department.madeDate = request.POST.get('department.madeDate')
        department.telephone = request.POST.get('department.telephone')
        department.chargeMan = request.POST.get('department.chargeMan')
        department.departmentDesc = request.POST.get('department.departmentDesc')
        department.save() # 保存科室信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新科室信息
    def get(self, request, departmentNo):
        context = {'departmentNo': departmentNo}
        return render(request, 'Department/department_modify.html', context)


class ListView(BaseView):  # 后台科室信息列表
    def get(self, request):
        # 使用模板
        return render(request, 'Department/department_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        departmentNo = self.getStrParam(request, 'departmentNo')
        departmentName = self.getStrParam(request, 'departmentName')
        madeDate = self.getStrParam(request, 'madeDate')
        chargeMan = self.getStrParam(request, 'chargeMan')
        # 然后条件组合查询过滤
        departments = Department.objects.all()
        if departmentNo != '':
            departments = departments.filter(departmentNo__contains=departmentNo)
        if departmentName != '':
            departments = departments.filter(departmentName__contains=departmentName)
        if madeDate != '':
            departments = departments.filter(madeDate__contains=madeDate)
        if chargeMan != '':
            departments = departments.filter(chargeMan__contains=chargeMan)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(departments, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        departments_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        departmentList = []
        for department in departments_page:
            department = department.getJsonObj()
            departmentList.append(department)
        # 构造模板页面需要的参数
        department_res = {
            'rows': departmentList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(department_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除科室信息信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        departmentNos = self.getStrParam(request, 'departmentNos')
        departmentNos = departmentNos.split(',')
        count = 0
        try:
            for departmentNo in departmentNos:
                Department.objects.get(departmentNo=departmentNo).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出科室信息信息到excel并下载
    def get(self, request):
        # 收集查询参数
        departmentNo = self.getStrParam(request, 'departmentNo')
        departmentName = self.getStrParam(request, 'departmentName')
        madeDate = self.getStrParam(request, 'madeDate')
        chargeMan = self.getStrParam(request, 'chargeMan')
        # 然后条件组合查询过滤
        departments = Department.objects.all()
        if departmentNo != '':
            departments = departments.filter(departmentNo__contains=departmentNo)
        if departmentName != '':
            departments = departments.filter(departmentName__contains=departmentName)
        if madeDate != '':
            departments = departments.filter(madeDate__contains=madeDate)
        if chargeMan != '':
            departments = departments.filter(chargeMan__contains=chargeMan)
        #将查询结果集转换成列表
        departmentList = []
        for department in departments:
            department = department.getJsonObj()
            departmentList.append(department)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(departmentList)
        # 设置要导入到excel的列
        columns_map = {
            'departmentNo': '科室编号',
            'departmentName': '科室名称',
            'madeDate': '成立日期',
            'telephone': '联系电话',
            'chargeMan': '负责人',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'departments.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="departments.xlsx"'
        return response

