from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.Patient.models import Patient
from apps.Doctor.models import Doctor
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台病人添加
    def get(self,request):
        doctors = Doctor.objects.all()  # 获取所有医生信息
        context = {
            'doctors': doctors,
        }

        # 使用模板
        return render(request, 'Patient/patient_frontAdd.html', context)

    def post(self, request):
        patient = Patient() # 新建一个病人对象然后获取参数
        patient.patientName = request.POST.get('patient.patientName')
        patient.sex = request.POST.get('patient.sex')
        patient.cardNumber = request.POST.get('patient.cardNumber')
        patient.telephone = request.POST.get('patient.telephone')
        patient.illnessCase = request.POST.get('patient.illnessCase')
        patient.doctorObj = Doctor.objects.get(doctorNumber=request.POST.get('patient.doctorObj.doctorNumber'))
        patient.addTime = request.POST.get('patient.addTime')
        patient.save() # 保存病人信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改病人
    def get(self, request, patientId):
        context = {'patientId': patientId}
        return render(request, 'Patient/patient_frontModify.html', context)


class FrontListView(BaseView):  # 前台病人查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        telephone = self.getStrParam(request, 'telephone')
        doctorObj_doctorNumber = self.getStrParam(request, 'doctorObj.doctorNumber')
        addTime = self.getStrParam(request, 'addTime')
        patientName = self.getStrParam(request, 'patientName')
        cardNumber = self.getStrParam(request, 'cardNumber')
        # 然后条件组合查询过滤
        patients = Patient.objects.all()
        if telephone != '':
            patients = patients.filter(telephone__contains=telephone)
        if doctorObj_doctorNumber != '':
            patients = patients.filter(doctorObj=doctorObj_doctorNumber)
        if addTime != '':
            patients = patients.filter(addTime__contains=addTime)
        if patientName != '':
            patients = patients.filter(patientName__contains=patientName)
        if cardNumber != '':
            patients = patients.filter(cardNumber__contains=cardNumber)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(patients, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        patients_page = self.paginator.page(self.currentPage)

        # 获取所有医生信息
        doctors = Doctor.objects.all()
        # 构造模板需要的参数
        context = {
            'doctors': doctors,
            'patients_page': patients_page,
            'telephone': telephone,
            'doctorObj_doctorNumber': doctorObj_doctorNumber,
            'addTime': addTime,
            'patientName': patientName,
            'cardNumber': cardNumber,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'Patient/patient_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示病人详情页
    def get(self, request, patientId):
        # 查询需要显示的病人对象
        patient = Patient.objects.get(patientId=patientId)
        context = {
            'patient': patient
        }
        # 渲染模板显示
        return render(request, 'Patient/patient_frontshow.html', context)


class ListAllView(View): # 前台查询所有病人
    def get(self,request):
        patients = Patient.objects.all()
        patientList = []
        for patient in patients:
            patientObj = {
                'patientId': patient.patientId,
                'patientName': patient.patientName,
            }
            patientList.append(patientObj)
        return JsonResponse(patientList, safe=False)


class UpdateView(BaseView):  # Ajax方式病人更新
    def get(self, request, patientId):
        # GET方式请求查询病人对象并返回病人json格式
        patient = Patient.objects.get(patientId=patientId)
        return JsonResponse(patient.getJsonObj())

    def post(self, request, patientId):
        # POST方式提交病人修改信息更新到数据库
        patient = Patient.objects.get(patientId=patientId)
        patient.patientName = request.POST.get('patient.patientName')
        patient.sex = request.POST.get('patient.sex')
        patient.cardNumber = request.POST.get('patient.cardNumber')
        patient.telephone = request.POST.get('patient.telephone')
        patient.illnessCase = request.POST.get('patient.illnessCase')
        patient.doctorObj = Doctor.objects.get(doctorNumber=request.POST.get('patient.doctorObj.doctorNumber'))
        patient.addTime = request.POST.get('patient.addTime')
        patient.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台病人添加
    def get(self,request):
        doctors = Doctor.objects.all()  # 获取所有医生信息
        context = {
            'doctors': doctors,
        }

        # 渲染显示模板界面
        return render(request, 'Patient/patient_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        patient = Patient() # 新建一个病人对象然后获取参数
        patient.patientName = request.POST.get('patient.patientName')
        patient.sex = request.POST.get('patient.sex')
        patient.cardNumber = request.POST.get('patient.cardNumber')
        patient.telephone = request.POST.get('patient.telephone')
        patient.illnessCase = request.POST.get('patient.illnessCase')
        patient.doctorObj = Doctor.objects.get(doctorNumber=request.POST.get('patient.doctorObj.doctorNumber'))
        patient.addTime = request.POST.get('patient.addTime')
        patient.save() # 保存病人信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class DoctorAddView(BaseView):  # 后台病人添加
    def get(self,request):
        doctors = Doctor.objects.all()  # 获取所有医生信息
        context = {
            'doctors': doctors,
        }

        # 渲染显示模板界面
        return render(request, 'Patient/patient_doctor_add.html', context)

    def post(self, request):
        # POST方式处理图书添加业务
        patient = Patient() # 新建一个病人对象然后获取参数
        patient.patientName = request.POST.get('patient.patientName')
        patient.sex = request.POST.get('patient.sex')
        patient.cardNumber = request.POST.get('patient.cardNumber')
        patient.telephone = request.POST.get('patient.telephone')
        patient.illnessCase = request.POST.get('patient.illnessCase')
        patient.doctorObj = Doctor.objects.get(doctorNumber=request.session.get('doctorNumber'))
        patient.addTime = request.POST.get('patient.addTime')
        patient.save() # 保存病人信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新病人
    def get(self, request, patientId):
        context = {'patientId': patientId}
        return render(request, 'Patient/patient_modify.html', context)



class ListView(BaseView):  # 后台病人列表
    def get(self, request):
        # 使用模板
        return render(request, 'Patient/patient_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        telephone = self.getStrParam(request, 'telephone')
        doctorObj_doctorNumber = self.getStrParam(request, 'doctorObj.doctorNumber')
        addTime = self.getStrParam(request, 'addTime')
        patientName = self.getStrParam(request, 'patientName')
        cardNumber = self.getStrParam(request, 'cardNumber')
        # 然后条件组合查询过滤
        patients = Patient.objects.all()
        if telephone != '':
            patients = patients.filter(telephone__contains=telephone)
        if doctorObj_doctorNumber != '':
            patients = patients.filter(doctorObj=doctorObj_doctorNumber)
        if addTime != '':
            patients = patients.filter(addTime__contains=addTime)
        if patientName != '':
            patients = patients.filter(patientName__contains=patientName)
        if cardNumber != '':
            patients = patients.filter(cardNumber__contains=cardNumber)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(patients, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        patients_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        patientList = []
        for patient in patients_page:
            patient = patient.getJsonObj()
            patientList.append(patient)
        # 构造模板页面需要的参数
        patient_res = {
            'rows': patientList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(patient_res, json_dumps_params={'ensure_ascii':False})


class DoctorListView(BaseView):  # 后台病人列表
    def get(self, request):
        # 使用模板
        return render(request, 'Patient/patient_doctorQuery_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        telephone = self.getStrParam(request, 'telephone')
        doctorObj_doctorNumber = request.session.get('doctorNumber')
        addTime = self.getStrParam(request, 'addTime')
        patientName = self.getStrParam(request, 'patientName')
        cardNumber = self.getStrParam(request, 'cardNumber')
        # 然后条件组合查询过滤
        patients = Patient.objects.all()
        if telephone != '':
            patients = patients.filter(telephone__contains=telephone)
        if doctorObj_doctorNumber != '':
            patients = patients.filter(doctorObj=doctorObj_doctorNumber)
        if addTime != '':
            patients = patients.filter(addTime__contains=addTime)
        if patientName != '':
            patients = patients.filter(patientName__contains=patientName)
        if cardNumber != '':
            patients = patients.filter(cardNumber__contains=cardNumber)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(patients, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        patients_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        patientList = []
        for patient in patients_page:
            patient = patient.getJsonObj()
            patientList.append(patient)
        # 构造模板页面需要的参数
        patient_res = {
            'rows': patientList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(patient_res, json_dumps_params={'ensure_ascii':False})


class DeletesView(BaseView):  # 删除病人信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        patientIds = self.getStrParam(request, 'patientIds')
        patientIds = patientIds.split(',')
        count = 0
        try:
            for patientId in patientIds:
                Patient.objects.get(patientId=patientId).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出病人信息到excel并下载
    def get(self, request):
        # 收集查询参数
        telephone = self.getStrParam(request, 'telephone')
        doctorObj_doctorNumber = self.getStrParam(request, 'doctorObj.doctorNumber')
        addTime = self.getStrParam(request, 'addTime')
        patientName = self.getStrParam(request, 'patientName')
        cardNumber = self.getStrParam(request, 'cardNumber')
        # 然后条件组合查询过滤
        patients = Patient.objects.all()
        if telephone != '':
            patients = patients.filter(telephone__contains=telephone)
        if doctorObj_doctorNumber != '':
            patients = patients.filter(doctorObj=doctorObj_doctorNumber)
        if addTime != '':
            patients = patients.filter(addTime__contains=addTime)
        if patientName != '':
            patients = patients.filter(patientName__contains=patientName)
        if cardNumber != '':
            patients = patients.filter(cardNumber__contains=cardNumber)
        #将查询结果集转换成列表
        patientList = []
        for patient in patients:
            patient = patient.getJsonObj()
            patientList.append(patient)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(patientList)
        # 设置要导入到excel的列
        columns_map = {
            'patientId': '病人id',
            'patientName': '病人姓名',
            'sex': '病人性别',
            'cardNumber': '身份证号',
            'telephone': '联系电话',
            'doctorObj': '医生',
            'addTime': '登记时间',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'patients.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="patients.xlsx"'
        return response

