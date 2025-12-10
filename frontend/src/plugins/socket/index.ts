import { IUserOnlineList } from './../../common/interfaces';
import localStorageTokenService from '@/common/tokenService';
import { userModule } from '@/modules/user/store/user.store';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { ElNotification } from 'element-plus';
import { IMessageDetail } from '@/modules/course/constants/course.interfaces';
const BE_API = process.env.VUE_APP_API_URL as string;

class SocketIo {
    private socket: Socket;

    constructor() {
        this.init();
    }

    init() {
        this.socket = io(BE_API, {
            extraHeaders: {
                token: localStorageTokenService.getAccessToken() || '',
            },
        });
        this.socket.on('connect', () => {
            console.log('Socket Connected');
        });

        this.socket.on('disconnect', function () {
            console.log('Socket disconnected');
        });

        this.listenEvent('users', (data: { users: IUserOnlineList[] }) => {
            userModule.setUserOnlineList(data.users);
        });

        this.listenEvent<{ title: string; description: string }>(
            'notification',
            (data) => {
                ElNotification({
                    type: 'info',
                    title: data.title,
                    message: data.description,
                    position: 'bottom-right',
                });
                userModule.setIncreaseNotification();
            },
        );
    }
    listenEvent<T>(name: string, cb: (data: T) => void) {
        this.socket.on(name, cb);
    }

    emitEvent<T>(name: string, data: T) {
        this.socket.emit(name, data);
    }

    disconnect() {
        this.socket.removeAllListeners;
        this.socket.close();
        this.socket.disconnect();
    }

    getSocket() {
        return this.socket;
    }

    setAccessToken(accessToken: string) {
        (this.socket.io.opts.extraHeaders as any).token = accessToken;
        this.socket.connect();
    }

    joinRoom(courseId: number) {
        this.emitEvent('join-room', {
            courseId,
            avatar: userModule.userData.avatar,
        });
    }

    listenChat(cb: (data: IMessageDetail) => void) {
        this.listenEvent('chat', cb);
    }

    chatRealtime(courseId: number, sourceId: number, comment: string) {
        this.emitEvent('chat', {
            courseId: `${courseId}`,
            sourceId,
            comment: comment,
        });
    }

    sendNotification(userId: string, title: string, description: string) {
        const newNotification = {
            userId,
            title,
            description,
        };

        this.emitEvent('notification', newNotification);
    }
}
const socketInstance = new SocketIo();

export default socketInstance;
