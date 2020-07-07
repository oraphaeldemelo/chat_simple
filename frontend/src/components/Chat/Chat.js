import React, { useState, useEffect  } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import axios from 'axios';

import './Chat.css'

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input'
import Messages from '../Messages/Messages'


let socket;

const Chat = ({ location }) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [bot, setBot] = useState(false);
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const ENDPOINT = 'http://localhost:5000';

    useEffect(() => {
        const {name, room, bot} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);
        setBot(bot);        

        if(bot === 'true'){
            axios.post(`${ENDPOINT}/bot/greetings`, {
                username: name,
                room: room
            })
            .then(async (res) => {
                const response = {user: 'Bot', text: res.data};
                
               await setMessages([...messages, response]);
            });
        } else {
            socket.emit('join', { name, room }, (error) => {
                if(error){
                    alert(error);
                }
            });
        }
        
    }, [ENDPOINT, location.search]);


    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);

        })
    }, [messages]);


    const sendMessage = async (event) => {
        event.preventDefault();

        if(message){
            if(bot === 'true'){
                const userMessage = {user: name.trim().toLowerCase(), text: message};
                await setMessages([...messages, userMessage])
                setMessage('');
                console.log(messages);
                
                axios.post(`${ENDPOINT}/bot/sendmessage/`, {
                    username: name,
                    room: room,
                    message: message
                })
                .then((res) => {
                    const response = res.data;
                    
                    //setMessages([...messages, response]);
                    console.log(messages);

                })       
            } else {
                socket.emit('sendMessage', message, () => setMessage(''));
            }
        }
    }

    return(
       <div className="outerContainer">
           <div className="container">
               <InfoBar room={room}/>
               <Messages messages={messages} name={name}/>
               <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

           </div>
       </div>

    )
}

export default Chat;