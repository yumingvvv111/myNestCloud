import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { __ as t } from 'i18n';

import { CreateUserInput, UpdateUserInput, UserInfoData, CreatePunchRequestInput, FaceRegisterInput } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
import { platform } from 'os';

@Controller()
export class UserGrpcController {
    constructor(
        @Inject(UserService) private readonly userService: UserService
    ) { }

    @GrpcMethod('UserService')
    async faceLogin(payload: { img: string }) {

        let username = await this.userService.getUsernameByAI(payload.img);//fixme
        const data = await this.userService.faceLogin('a8');
        // console.log(121212121212, username, data);
        return { code: 200, message: t('Login success'), data };
    }


    @GrpcMethod('UserService')
    async faceRegister(payload: { img: string, name: string, password: string }) {

        let { img, name, password } = payload;
        let resData = {
            status: 1,
            tokenInfo: {
                accessToken: '',
                expiresIn: 0
            },
            userInfoData: {
                userId: "",
                username: "",
                mobile: "",
                email: ""
            }
        };

        if(!name){
            resData.status = 0;
            return { code: 200, message: t('Please type in user name'), data: resData };
        }

        if(!password){
            resData.status = 0;
            return { code: 200, message: t('Please type in password'), data: resData };
        }

        const faceResult = await this.userService.addAIFaceUser(img, name);

        // let res = {status
        //     tokenInfo: TokenInfo
        //     userInfoData: UserInfoData};

        //     0 :'请输入名字' 1:'添加成功' 2:'人脸信息与已经存在的人脸相似'
        //  3 :'人脸信息已存在'4 : '未识别到人脸，请重新拍照'
        switch (faceResult) {
            case 0:
                resData.status = 0;
                return { code: 200, message: t('Please type in user name'), data: resData };
                break;
            // case 1:
            //     return { code: 200, message: t('Add face success'), data: {faceResult: 1} };
            //     break;
            case 2:
                resData.status = 2;
                return { code: 200, message: t('Familiar with the other face'), data: resData };
                break;
            case 3:
                resData.status = 3;
                return { code: 200, message: t('Already have the same face'), data: resData };
                break;
            case 4:
                resData.status = 4;
                return { code: 200, message: t('No face recognise'), data: resData };
                break;
        }

        const result = await this.userService.register({
            username: name,
            password
        });

        let data = await this.userService.login(name, password);
        console.log(data);
        
        return { code: 200, message: t('Add face success'), data: {...resData, ...data} };
    }

    @GrpcMethod('UserService')
    async login(payload: { username: string, password: string }) {
        console.log(111111)
        const data = await this.userService.login(payload.username, payload.password);
        return { code: 200, message: t('Login success'), data };
    }

    @GrpcMethod('UserService')
    async getPunchList(payload: { userId: string, startTime: string, endTime: string }) {
        const data = await this.userService.getPunchList(payload.userId, payload.startTime, payload.endTime);
        return { code: 200, message: t('Get Success'), data };
    }

    @GrpcMethod('UserService')
    async register(payload: { registerUserInput: CreateUserInput }) {
        const result = await this.userService.register(payload.registerUserInput);
        return { code: 200, message: t('Registration success') };
    }

    @GrpcMethod('UserService')
    //todo permission
    async createPunch(payload: { createPunchInput: CreatePunchRequestInput }) {
        // console.log(111111111111, payload);
        const result = await this.userService.createPunch(payload.createPunchInput);
        return { code: 200, message: t('Create punch item success') };
    }

    @GrpcMethod('UserService')
    async createUser(payload: { createUserInput: CreateUserInput }) {
        await this.userService.createUser(payload.createUserInput);
        return { code: 200, message: t('Create user successfully') };
    }

    @GrpcMethod('UserService')
    async addUserRole(payload: { userId: number, roleId: number }) {
        await this.userService.addUserRole(payload.userId, payload.roleId);
        return { code: 200, message: t('Add user role successfully') };
    }

    @GrpcMethod('UserService')
    async deleteUserRole(payload: { userId: number, roleId: number }) {
        await this.userService.deleteUserRole(payload.userId, payload.roleId);
        return { code: 200, message: t('Delete user role successfully') };
    }

    @GrpcMethod('UserService')
    async banUser(payload: { userId: number }) {
        await this.userService.recycleOrBanUser(payload.userId, 'ban');
        return { code: 200, message: t('Ban User successfully') };
    }

    @GrpcMethod('UserService')
    async recycleUser(payload: { userId: number }) {
        await this.userService.recycleOrBanUser(payload.userId, 'recycle');
        return { code: 200, message: t('Delete user to recycle bin successfully') };
    }

    @GrpcMethod('UserService')
    async deleteRecycledUser(payload: { userId: number }) {
        await this.userService.deleteUser(payload.userId);
        return { code: 200, message: t('Delete user in the recycle bin successfully') };
    }

    @GrpcMethod('UserService')
    async revertBannedUser(payload: { userId: number }) {
        await this.userService.revertBannedOrRecycledUser(payload.userId, 'banned');
        return { code: 200, message: t('Revert banned user successfully') };
    }

    @GrpcMethod('UserService')
    async revertRecycledUser(payload: { userId: number }) {
        await this.userService.revertBannedOrRecycledUser(payload.userId, 'recycled');
        return { code: 200, message: t('Revert recycled user successfully') };
    }

    @GrpcMethod('UserService')
    async updateUserInfoById(payload: { userId: number, updateUserInput: UpdateUserInput }) {
        await this.userService.updateUserInfo(payload.userId, payload.updateUserInput);
        return { code: 200, message: t('Update user information successfully') };
    }

    @GrpcMethod('UserService')
    async updateCurrentUserInfo(payload: { userId: number, updateCurrentUserInput: UpdateUserInput }) {
        await this.userService.updateUserInfo(payload.userId, payload.updateCurrentUserInput);
        return { code: 200, message: t('Update current login user information successfully') };
    }

    @GrpcMethod('UserService')
    async findUserInfoByIds(payload: { userIds: number[] }) {
        const data = await this.userService.findUserInfoById(payload.userIds) as UserInfoData[];
        return { code: 200, message: t('Query the specified users information successfully'), data };
    }

    @GrpcMethod('UserService')
    async findCurrentUserInfo(payload: { userId: number }) {
        const data = await this.userService.findUserInfoById(payload.userId) as UserInfoData;
        return { code: 200, message: t('Query the current login user information successfully'), data };
    }

    @GrpcMethod('UserService')
    async findRegisterUserInputInfo() {
        const data = await this.userService.findOneWithInfoItemsByRoleIds([1]);
        return { code: 200, message: t('Query user registration information item successfully'), data };
    }

    @GrpcMethod('UserService')
    async findAllUsers(payload: { pageNumber: number, pageSize: number }) {
        const result = await this.userService.findAllUsers(payload.pageNumber, payload.pageSize);
        let data: UserInfoData[];
        let count: number;
        if (!(result instanceof Array)) {
            data = result.usersInfo;
            count = result.count;
        } else {
            data = result;
        }
        return { code: 200, message: t('Query all users successfully'), data, count };
    }

    @GrpcMethod('UserService')
    async findUsersInRole(payload: { roleId: number, pageNumber: number, pageSize: number }) {
        const { roleId, pageNumber, pageSize } = payload;
        const { usersInfo, count } = await this.userService.findByRoleId(roleId, pageNumber, pageSize);
        return { code: 200, message: t('Query the user under the role successfully'), data: usersInfo, count };
    }

    @GrpcMethod('UserService')
    async findUsersInOrganization(payload: { organizationId: number, pageNumber: number, pageSize: number }) {
        const { organizationId, pageNumber, pageSize } = payload;
        const { usersInfo, count } = await this.userService.findByOrganizationId(organizationId, pageNumber, pageSize);
        return { code: 200, message: t('Query users under the organization successfully'), data: usersInfo, count };
    }

    @GrpcMethod('UserService')
    async findOneWithRolesAndPermissions(payload: { username: string }) {
        const data = await this.userService.findOneWithRolesAndPermissions(payload.username);
        return { code: 200, message: t('Query users roles and permissions successfully'), data };
    }

    @GrpcMethod('UserService')
    async addPermissionToUser(payload: { userId: number, permissionId: number }) {
        await this.userService.addPermissionToUser(payload.userId, payload.permissionId);
        return { code: 200, message: t('Add permission to user successfully') };
    }

    @GrpcMethod('UserService')
    async deletePermissionOfUser(payload: { userId: number, permissionId: number }) {
        await this.userService.deletePermissionOfUser(payload.userId, payload.permissionId);
        return { code: 200, message: t('Delete permission of user successfully') };
    }
}