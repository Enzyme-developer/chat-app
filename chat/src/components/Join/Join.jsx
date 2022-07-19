import React , {useState} from 'react'
import { Link } from 'react-router-dom'
import './join.css'

const Join = () => {
  const [name , setName] = useState('')
  const [room, setRoom] = useState('')
  
  return (
    <div className='join__container'>
      <div className='join__container__inner'>
        <h1 className='join__container-heading'>Join</h1>
        <div><input type='text' className='joinInput' onChange={(e) => setName(e.target.value)} placeholder='Name' /></div>
        <div><input type='text' className='joinInput mt-20' onChange={(e) => setRoom(e.target.value)} placeholder='Room' /></div>
        <Link onClick={(e) => (!name||!room) ? e.preventDefault() : null}  to={`/chat?name=${name}&room=${room}`}>
          <button className='button ' type='submit'>Sign In</button>
        </Link>
      </div>
    </div>
  )
}

export default Join