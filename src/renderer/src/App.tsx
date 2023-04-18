import { useEffect, useState, useRef } from 'react'
import Peer from 'peerjs'
import type { DataConnection } from 'peerjs'
import  user from './../../../resources/user.png'
import './App.css'

function App() {
  const [userId, setUserId] = useState('What is my id?')
  const [message, setMessage] = useState<Record<string, string>[]>([])
  const [connection, setConnection] = useState<DataConnection | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)

  const connectTo = useRef<HTMLInputElement>(null)
  const messageContent = useRef<HTMLInputElement>(null)

  

  useEffect(() => {
    const p = new Peer('')

    p.on('open', (id) => {
      setUserId(id)
    })

    p.on('connection', (conn) => {
      conn.on('data', (data) => {
        setMessage((prev) => [...prev, data])
      })
    })

    setPeer(p)

    return () => {
      p.disconnect()
    }
  }, [])
  
  const handleKeypress = e => {
    //it triggers by pressing the enter key
  if (e.keyCode === 13) {
    sendMessage();
  }
};

  const initializeConnection = () => {
    setConnection(peer.connect(connectTo.current?.value as string))
  }

  const sendMessage = () => {
    if (connection) {
      const data = {sender: peer.id ,data: messageContent.current?.value as string}
      connection.send(data)
      setMessage((prev) => [...prev, data])
      messageContent.current!.value = ''
    }
  }


  return (
    <div className="App">
      <div className="App-header">
        <img className="userImage" src={user} alt="user" />
        <p>{userId}</p></div>
      <div className="connectWrapper">
        <input ref={connectTo} className="connectBox" type="text" />
        <button className="connectButton" onClick={initializeConnection}>Connect</button>
      </div>
      <div className="messageWrapper">
        <input ref={messageContent} className="messageBox" type="text" onKeyDown={handleKeypress} />
        <button className="messageButton" onClick={sendMessage}>Send</button>
      </div>
      <div className="content" style={message.length == 0 ? {'visibility' : 'hidden'} : {'visibility' : 'visible'}}>
      {message.map((msg, idx) => 
      <>
        <p key={idx}>{msg.sender == peer.id ? "You: " : "Other: "}{msg.data}</p>
        <hr/>
      </>
      )}
      </div>
    </div>
  )
}

export default App
