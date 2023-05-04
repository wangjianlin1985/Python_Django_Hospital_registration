from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.SchoolRecord.models import SchoolRecord
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台学历信息添加
    def get(self,request):

        # 使用模板
        return render(request, 'SchoolRecord/schoolRecord_frontAdd.html')

    def post(self, request):
        schoolRecord = SchoolRecord() # 新建一个学历信息对象然后获取参数
        schoolRecord.schoolRecordName = request.POST.get('schoolRecord.schoolRecordName')
        schoolRecord.save() # 保存学历信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改学历信息
    def get(self, request, schoolRecordId):
        context = {'schoolRecordId': schoolRecordId}
        return render(request, 'SchoolRecord/schoolRecord_frontModify.html', context)


class FrontListView(BaseView):  # 前台学历信息查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        # 然后条件组合查询过滤
        schoolRecords = SchoolRecord.objects.all()
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(schoolRecords, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        schoolRecords_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'schoolRecords_page': schoolRecords_page,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'SchoolRecord/schoolRecord_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示学历信息详情页
    def get(self, request, schoolRecordId):
        # 查询需要显示的学历信息对象
        schoolRecord = SchoolRecord.objects.get(schoolRecordId=schoolRecordId)
        context = {
            'schoolRecord': schoolRecord
        }
        # 渲染模板显示
        return render(request, 'SchoolRecord/schoolRecord_frontshow.html', context)


class ListAllView(View): # 前台查询所有学历信息
    def get(self,request):
        schoolRecords = SchoolRecord.objects.all()
        schoolRecordList = []
        for schoolRecord in schoolRecords:
            schoolRecordObj = {
                'schoolRecordId': schoolRecord.schoolRecordId,
                'schoolRecordName': schoolRecord.schoolRecordName,
            }
            schoolRecordList.append(schoolRecordObj)
        return JsonResponse(schoolRecordList, safe=False)


class UpdateView(BaseView):  # Ajax方式学历信息更新
    def get(self, request, schoolRecordId):
        # GET方式请求查询学历信息对象并返回学历信息json格式
        schoolRecord = SchoolRecord.objects.get(schoolRecordId=schoolRecordId)
        return JsonResponse(schoolRecord.getJsonObj())

    def post(self, request, schoolRecordId):
        # POST方式提交学历信息修改信息更新到数据库
        schoolRecord = SchoolRecord.objects.get(schoolRecordId=schoolRecordId)
        schoolRecord.schoolRecordName = request.POST.get('schoolRecord.schoolRecordName')
        schoolRecord.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台学历信息添加
    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'SchoolRecord/schoolRecord_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        schoolRecord = SchoolRecord() # 新建一个学历信息对象然后获取参数
        schoolRecord.schoolRecordName = request.POST.get('schoolRecord.schoolRecordName')
        schoolRecord.save() # 保存学历信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新学历信息
    def get(self, request, schoolRecordId):
        context = {'schoolRecordId': schoolRecordId}
        return render(request, 'SchoolRecord/schoolRecord_modify.html', context)


class ListView(BaseView):  # 后台学历信息列表
    def get(self, request):
        # 使用模板
        return render(request, 'SchoolRecord/schoolRecord_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        # 然后条件组合查询过滤
        schoolRecords = SchoolRecord.objects.all()
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(schoolRecords, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        schoolRecords_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        schoolRecordList = []
        for schoolRecord in schoolRecords_page:
            schoolRecord = schoolRecord.getJsonObj()
            schoolRecordList.append(schoolRecord)
        # 构造模板页面需要的参数
        schoolRecord_res = {
            'rows': schoolRecordList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(schoolRecord_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除学历信息信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        schoolRecordIds = self.getStrParam(request, 'schoolRecordIds')
        schoolRecordIds = schoolRecordIds.split(',')
        count = 0
        try:
            for schoolRecordId in schoolRecordIds:
                SchoolRecord.objects.get(schoolRecordId=schoolRecordId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出学历信息信息到excel并下载
    def get(self, request):
        # 收集查询参数
        # 然后条件组合查询过滤
        schoolRecords = SchoolRecord.objects.all()
        #将查询结果集转换成列表
        schoolRecordList = []
        for schoolRecord in schoolRecords:
            schoolRecord = schoolRecord.getJsonObj()
            schoolRecordList.append(schoolRecord)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(schoolRecordList)
        # 设置要导入到excel的列
        columns_map = {
            'schoolRecordId': '记录编号',
            'schoolRecordName': '学历名称',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'schoolRecords.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="schoolRecords.xlsx"'
        return response

