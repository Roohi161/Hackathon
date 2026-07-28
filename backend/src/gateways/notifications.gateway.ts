import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected to WebSocket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected from WebSocket: ${client.id}`);
  }

  @SubscribeMessage('joinHackathon')
  handleJoinHackathon(
    @MessageBody() hackathonId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`hackathon-${hackathonId}`);
    return { status: 'joined', room: `hackathon-${hackathonId}` };
  }

  broadcastAnnouncement(hackathonId: string, announcement: any) {
    this.server.to(`hackathon-${hackathonId}`).emit('newAnnouncement', announcement);
  }

  broadcastLeaderboardUpdate(hackathonId: string, leaderboard: any) {
    this.server.to(`hackathon-${hackathonId}`).emit('leaderboardUpdate', leaderboard);
  }
}
