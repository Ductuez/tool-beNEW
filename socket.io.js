import { Server } from 'socket.io'
import mqtt from 'mqtt'

let io // Global variable to store the Socket.io object

export const init = (server) => {
  try {
    io = new Server(server, {
      cors: {
        origin: '*',
      },
    })

    // Handle events when a new connection is established
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('disconnect', () => {
        console.log('A user disconnected.')
      })
    })
  } catch (error) {
    console.log('oke??', error)
  }
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized.')
  }
  return io
}
