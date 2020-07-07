import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

import './Join.css'

const Join = (props) => {
    
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [bot, setBot] = useState(true);

    const handleAttending = (e) => {
        if(e.target.value === 'bot'){
            setBot(true);
        } else {
            setBot(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.history.push(`/chat?name=${name}&bot=${bot}&room=${room}`);
   
    }
    
    return(
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Join</h1>
                <form>
                    <div><input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} /></div>
                    <div className="attending">
                        <label>Tipo de atendimento:</label>
                        <div>
                            <input type='radio' value='bot' checked={bot} onChange={e => handleAttending(e)} /> Bot
                            <input type='radio' value='chat' checked={!bot} onChange={e => handleAttending(e)} /> Chat
                        </div>
                        
                    </div>
                    <div><input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom (event.target.value)} /></div>

                    <button className="button mt-20" onClick={handleSubmit} type="submit">Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default Join;