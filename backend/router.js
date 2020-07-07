const express  = require('express');
const router = express.Router();
const bot = require('./bot');

router.get('/', (req, res) => {
    res.end('Server is up and running');
})

router.post('/bot/greetings', async (req, res) => {
    const name = req.body.username;
    const room = req.body.room;

    const response = await bot.sendBot('Oi', room);    
    res.json(response)
    
});

router.post('/bot/sendmessage/', async (req, res) => {
    console.log(req.body);
    const room = req.body.room;
    const message = req.body.message;

    const response = await bot.sendBot(message, room);
    const botResponse = { name: 'Bot', message: response}
    res.json(botResponse);
})

module.exports = router;