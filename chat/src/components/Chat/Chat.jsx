import React, { useEffect, useState } from 'react'
import queryString from 'query-string'
import { io } from "socket.io-client";
import { useLocation } from 'react-router-dom'

let socket;

const Chat = () => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const location = useLocation();
  const endpoint = 'http://localhost:5000'

  console.log(name, room)
  
  useEffect(() => {
    const { name, room } = queryString.parse(location.search)

    socket = io(endpoint)
  
    setName(name)
    setRoom(room)
  
    // console.log(socket)

    socket.emit('join', { name, room }, () => { })

    return () => {
      socket.emit('disconnected')
      socket.off()
    }
  
  }, [endpoint, location.search])


  
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message])
    })
  }, [message])
  
  //sendMessage function


  const sendMessage = (e) => { 
    e.preventDefault();

    if(message){
      socket.emit('sendMessage' ,message ,() => setMessage(''))
    }
  }


  console.log(message,messages)

  return (
    <div className='outerContainer'>
      <div className='container'>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" ? sendMessage(e) : null}
        />
      </div>
    </div>
  )
}

export default Chat