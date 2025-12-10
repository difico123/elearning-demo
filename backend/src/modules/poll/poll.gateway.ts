import { Logger, UseFilters } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { CommentType } from 'database/constant';
import { Namespace } from 'socket.io';
import { WsCatchAllFilter } from 'src/common/filter/ws-catch-all-filter';
import { SocketWithAuth } from 'src/common/interfaces';
import { mysqlTimeStamp } from 'src/common/ultils';
import { PollService } from './poll.service';

@UseFilters(new WsCatchAllFilter())
@WebSocketGateway({
  namespace: '',
  cors: {
    origin: '*',
  },
})
export class PollGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollGateway.name);
  constructor(private readonly pollsService: PollService) {}

  @WebSocketServer() io: Namespace;

  // Gateway initialized (provided in module and instantiated)
  afterInit(): void {
    this.logger.log(`Websocket Gateway initialized.`);
  }

  async handleConnection(client: SocketWithAuth) {
    const sockets = this.io.sockets;

    const { id, userID, username, email, role } = client;
    this.logger.debug(
      `Socket connected with userID: ${userID}, pollID: ${email}, and name: "${username}"`,
    );
    await client.join(userID);
    this.logger.log(`WS Client with id: ${id} connected!`);

    client.on(
      'join-room',
      async ({ courseId, avatar }: { courseId: number; avatar?: string }) => {
        let index = this.pollsService.userIndex(userID);
        if (index !== -1) {
          await client.join(`${courseId}`);
          avatar && this.pollsService.setAvatar(userID, avatar);
          this.logger.debug(`${username} joined course ${courseId}`);
        }
        return `joined course ${courseId}`;
      },
    );

    client.on(
      'notification',
      async (data: { userId: string; title: string; description: string }) => {
        let { userId, title, description } = data;
        if (userId) {
          this.logger.debug(`Number of connected sockets: ${users.length}`);
          let newNotification = {
            title,
            description,
            userID,
            email,
            username,
          };
          client.broadcast
            .to(data?.userId)
            .emit('notification', newNotification);
        }
      },
    );

    client.on(
      'chat',
      async (data: {
        courseId: string;
        sourceId: string;
        comment: string;
        type?: CommentType;
      }) => {
        let { courseId, type = CommentType.topic, comment, sourceId } = data;
        let { email, image, role, username } =
          this.pollsService.getUser(userID);

        let chat = {
          id: new Date().getTime(),
          userId: userID,
          sourceId,
          type,
          comment,
          time: mysqlTimeStamp(new Date()),
          isBad: 0,
          isBlock: 0,
          username: username,
          email,
          role,
          avatar: image,
        };

        this.logger.debug(`${username} chatted course ${courseId}`);
        this.io.to(courseId).emit('chat', chat);
      },
    );

    let user = {
      id,
      userID,
      email,
      username,
      role,
    };
    let users = this.pollsService.joinPoll(user);

    this.io.emit('users', {
      users,
    });

    this.logger.debug(`Number of connected sockets: ${users.length}`);
  }

  @SubscribeMessage('events')
  async events(@MessageBody() data: number): Promise<number> {
    this.io.emit('events', data);
    return data;
  }

  async handleDisconnect(client: SocketWithAuth) {
    let users = this.pollsService.userLeave(client.userID);
    this.io.emit('users', {
      users,
    });

    this.logger.debug(
      `Socket Disconnected with userID: ${client.userID}, pollID: ${client.email}, and name: "${client.username}"`,
    );
    this.logger.debug(`Number of connected sockets: ${users.length}`);
  }
}
