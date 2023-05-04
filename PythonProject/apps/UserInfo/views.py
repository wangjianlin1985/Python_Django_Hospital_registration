from django.views.generic import View
from apps.BaseView import BaseView
from django.shortcuts import render
from django.core.paginator import Paginator
from apps.UserInfo.models import UserInfo
from django.http import JsonResponse
from django.http import FileResponse
from apps.BaseView import ImageFormatException
from django.conf import settings
import pandas as pd
import os


class FrontAddView(BaseView):  # 前台用户信息添加
    def primaryKeyExist(self, user_name):  # 判断主键是否存在
        try:
            UserInfo.objects.get(user_name=user_name)
            return True
        except UserInfo.DoesNotExist:
            return False

    def get(self,request):

        # 使用模板
        return render(request, 'UserInfo/userInfo_frontAdd.html')

    def post(self, request):
        user_name = request.POST.get('userInfo.user_name') # 判断用户名是否存在
        if self.primaryKeyExist(user_name):
            return JsonResponse({'success': False, 'message': '用户名已经存在'})

        userInfo = UserInfo() # 新建一个用户信息对象然后获取参数
        userInfo.user_name = user_name
        userInfo.password = request.POST.get('userInfo.password')
        userInfo.realName = request.POST.get('userInfo.realName')
        userInfo.sex = request.POST.get('userInfo.sex')
        try:
            userInfo.photo = self.uploadImageFile(request,'userInfo.photo')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        userInfo.birthday = request.POST.get('userInfo.birthday')
        userInfo.cardNumber = request.POST.get('userInfo.cardNumber')
        userInfo.city = request.POST.get('userInfo.city')
        userInfo.telephone = request.POST.get('userInfo.telephone')
        userInfo.address = request.POST.get('userInfo.address')
        import datetime
        userInfo.regTime = str(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        userInfo.save() # 保存用户信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class FrontModifyView(BaseView):  # 前台修改用户信息
    def get(self, request, user_name):
        context = {'user_name': user_name}
        return render(request, 'UserInfo/userInfo_frontModify.html', context)


class FrontListView(BaseView):  # 前台用户信息查询列表
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        self.getCurrentPage(request)  # 获取当前要显示第几页
        # 下面获取查询参数
        user_name = self.getStrParam(request, 'user_name')
        realName = self.getStrParam(request, 'realName')
        birthday = self.getStrParam(request, 'birthday')
        cardNumber = self.getStrParam(request, 'cardNumber')
        city = self.getStrParam(request, 'city')
        # 然后条件组合查询过滤
        userInfos = UserInfo.objects.all()
        if user_name != '':
            userInfos = userInfos.filter(user_name__contains=user_name)
        if realName != '':
            userInfos = userInfos.filter(realName__contains=realName)
        if birthday != '':
            userInfos = userInfos.filter(birthday__contains=birthday)
        if cardNumber != '':
            userInfos = userInfos.filter(cardNumber__contains=cardNumber)
        if city != '':
            userInfos = userInfos.filter(city__contains=city)
        # 对查询结果利用Paginator进行分页
        self.paginator = Paginator(userInfos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        userInfos_page = self.paginator.page(self.currentPage)

        # 构造模板需要的参数
        context = {
            'userInfos_page': userInfos_page,
            'user_name': user_name,
            'realName': realName,
            'birthday': birthday,
            'cardNumber': cardNumber,
            'city': city,
            'currentPage': self.currentPage,
            'totalPage': self.totalPage,
            'recordNumber': self.recordNumber,
            'startIndex': self.startIndex,
            'pageList': self.pageList,
        }
        # 渲染模板界面
        return render(request, 'UserInfo/userInfo_frontquery_result.html', context)


class FrontShowView(View):  # 前台显示用户信息详情页
    def get(self, request, user_name):
        # 查询需要显示的用户信息对象
        userInfo = UserInfo.objects.get(user_name=user_name)
        context = {
            'userInfo': userInfo
        }
        # 渲染模板显示
        return render(request, 'UserInfo/userInfo_frontshow.html', context)


class ListAllView(View): # 前台查询所有用户信息
    def get(self,request):
        userInfos = UserInfo.objects.all()
        userInfoList = []
        for userInfo in userInfos:
            userInfoObj = {
                'user_name': userInfo.user_name,
                'realName': userInfo.realName,
            }
            userInfoList.append(userInfoObj)
        return JsonResponse(userInfoList, safe=False)


class UpdateView(BaseView):  # Ajax方式用户信息更新
    def get(self, request, user_name):
        # GET方式请求查询用户信息对象并返回用户信息json格式
        userInfo = UserInfo.objects.get(user_name=user_name)
        return JsonResponse(userInfo.getJsonObj())

    def post(self, request, user_name):
        # POST方式提交用户信息修改信息更新到数据库
        userInfo = UserInfo.objects.get(user_name=user_name)
        userInfo.password = request.POST.get('userInfo.password')
        userInfo.realName = request.POST.get('userInfo.realName')
        userInfo.sex = request.POST.get('userInfo.sex')
        try:
            photoName = self.uploadImageFile(request, 'userInfo.photo')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        if photoName != 'img/NoImage.jpg':
            userInfo.photo = photoName
        userInfo.birthday = request.POST.get('userInfo.birthday')
        userInfo.cardNumber = request.POST.get('userInfo.cardNumber')
        userInfo.city = request.POST.get('userInfo.city')
        userInfo.telephone = request.POST.get('userInfo.telephone')
        userInfo.address = request.POST.get('userInfo.address')
        userInfo.regTime = request.POST.get('userInfo.regTime')
        userInfo.save()
        return JsonResponse({'success': True, 'message': '保存成功'})

class AddView(BaseView):  # 后台用户信息添加
    def primaryKeyExist(self, user_name):  # 判断主键是否存在
        try:
            UserInfo.objects.get(user_name=user_name)
            return True
        except UserInfo.DoesNotExist:
            return False

    def get(self,request):

        # 渲染显示模板界面
        return render(request, 'UserInfo/userInfo_add.html')

    def post(self, request):
        # POST方式处理图书添加业务
        user_name = request.POST.get('userInfo.user_name') # 判断用户名是否存在
        if self.primaryKeyExist(user_name):
            return JsonResponse({'success': False, 'message': '用户名已经存在'})

        userInfo = UserInfo() # 新建一个用户信息对象然后获取参数
        userInfo.user_name = user_name
        userInfo.password = request.POST.get('userInfo.password')
        userInfo.realName = request.POST.get('userInfo.realName')
        userInfo.sex = request.POST.get('userInfo.sex')
        try:
            userInfo.photo = self.uploadImageFile(request,'userInfo.photo')
        except ImageFormatException as ife:
            return JsonResponse({'success': False, 'message': ife.error})
        userInfo.birthday = request.POST.get('userInfo.birthday')
        userInfo.cardNumber = request.POST.get('userInfo.cardNumber')
        userInfo.city = request.POST.get('userInfo.city')
        userInfo.telephone = request.POST.get('userInfo.telephone')
        userInfo.address = request.POST.get('userInfo.address')
        userInfo.regTime = request.POST.get('userInfo.regTime')
        userInfo.save() # 保存用户信息信息到数据库
        return JsonResponse({'success': True, 'message': '保存成功'})


class BackModifyView(BaseView):  # 后台更新用户信息
    def get(self, request, user_name):
        context = {'user_name': user_name}
        return render(request, 'UserInfo/userInfo_modify.html', context)


class ListView(BaseView):  # 后台用户信息列表
    def get(self, request):
        # 使用模板
        return render(request, 'UserInfo/userInfo_query_result.html')

    def post(self, request):
        # 获取当前要显示第几页和每页几条数据
        self.getPageAndSize(request)
        # 收集查询参数
        user_name = self.getStrParam(request, 'user_name')
        realName = self.getStrParam(request, 'realName')
        birthday = self.getStrParam(request, 'birthday')
        cardNumber = self.getStrParam(request, 'cardNumber')
        city = self.getStrParam(request, 'city')
        # 然后条件组合查询过滤
        userInfos = UserInfo.objects.all()
        if user_name != '':
            userInfos = userInfos.filter(user_name__contains=user_name)
        if realName != '':
            userInfos = userInfos.filter(realName__contains=realName)
        if birthday != '':
            userInfos = userInfos.filter(birthday__contains=birthday)
        if cardNumber != '':
            userInfos = userInfos.filter(cardNumber__contains=cardNumber)
        if city != '':
            userInfos = userInfos.filter(city__contains=city)
        # 利用Paginator对查询结果集分页
        self.paginator = Paginator(userInfos, self.pageSize)
        # 计算总的页码数，要显示的页码列表，总记录等
        self.calculatePages()
        # 获取第page页的Page实例对象
        userInfos_page = self.paginator.page(self.currentPage)
        # 查询的结果集转换为列表
        userInfoList = []
        for userInfo in userInfos_page:
            userInfo = userInfo.getJsonObj()
            userInfoList.append(userInfo)
        # 构造模板页面需要的参数
        userInfo_res = {
            'rows': userInfoList,
            'total': self.recordNumber,
        }
        # 渲染模板页面显示
        return JsonResponse(userInfo_res, json_dumps_params={'ensure_ascii':False})

class DeletesView(BaseView):  # 删除用户信息信息
    def get(self, request):
        return self.handle(request)

    def post(self, request):
        return self.handle(request)

    def handle(self, request):
        user_names = self.getStrParam(request, 'user_names')
        user_names = user_names.split(',')
        count = 0
        try:
            for user_name in user_names:
                UserInfo.objects.get(user_name=user_name).delete()
                count = count + 1
            message = '%s条记录删除成功！' % count
            success = True
        except Exception as e:
            message = '数据库外键约束删除失败！'
            success = False
        return JsonResponse({'success': success, 'message': message})


class OutToExcelView(BaseView):  # 导出用户信息信息到excel并下载
    def get(self, request):
        # 收集查询参数
        user_name = self.getStrParam(request, 'user_name')
        realName = self.getStrParam(request, 'realName')
        birthday = self.getStrParam(request, 'birthday')
        cardNumber = self.getStrParam(request, 'cardNumber')
        city = self.getStrParam(request, 'city')
        # 然后条件组合查询过滤
        userInfos = UserInfo.objects.all()
        if user_name != '':
            userInfos = userInfos.filter(user_name__contains=user_name)
        if realName != '':
            userInfos = userInfos.filter(realName__contains=realName)
        if birthday != '':
            userInfos = userInfos.filter(birthday__contains=birthday)
        if cardNumber != '':
            userInfos = userInfos.filter(cardNumber__contains=cardNumber)
        if city != '':
            userInfos = userInfos.filter(city__contains=city)
        #将查询结果集转换成列表
        userInfoList = []
        for userInfo in userInfos:
            userInfo = userInfo.getJsonObj()
            userInfoList.append(userInfo)
        # 利用pandas实现数据的导出功能
        pf = pd.DataFrame(userInfoList)
        # 设置要导入到excel的列
        columns_map = {
            'user_name': '用户名',
            'password': '密码',
            'realName': '姓名',
            'sex': '性别',
            'birthday': '出生日期',
            'cardNumber': '身份证',
            'city': '籍贯',
            'telephone': '联系电话',
            'address': '家庭地址',
            'regTime': '注册时间',
        }
        pf = pf[columns_map.keys()]
        pf.rename(columns=columns_map, inplace=True)
        # 将空的单元格替换为空字符
        pf.fillna('', inplace=True)
        #设定文件名和导出路径
        filename = 'userInfos.xlsx'
        # 这个路径可以在settings中设置也可以直接手动输入
        root_path = settings.MEDIA_ROOT + '/output/'
        file_path = os.path.join(root_path, filename)
        pf.to_excel(file_path, encoding='utf-8', index=False)
        # 将生成的excel文件输出到网页下载
        file = open(file_path, 'rb')
        response = FileResponse(file)
        response['Content-Type'] = 'application/octet-stream'
        response['Content-Disposition'] = 'attachment;filename="userInfos.xlsx"'
        return response

