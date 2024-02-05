const express = require('express')

const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')

const fs = require('fs')

const app = express()
 
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser())


// Route for /login and login form submission
app.get('/login', (req, res) => {
    res.send('<form action="/login" method="post">' +
             '<label for="username"> Enter Username:</label>' +
             '<input type="text" id="username" name="username" required>' +
             '<button type="submit">Login</button></form>')
}) 
app.post('/login', (req, res) => {
    const username = req.body.username;
    res.cookie('username', username);
    res.send(`<p><a href="/message-form">Go to message form</a></p>`)
});

// Route for displaying the message form and handling message form submission
app.get('/message-form', (req, res) => {
    res.send('<form action="/send-message" method="post">' +
             '<label for="message">Message:</label>' +
             '<input type="text" id="message" name="message" required>' +
             '<button type="submit">Send</button></form>' +
             '<p>Last Messages:</p>' +
             `<div>${getMessages()}</div>`);
});
app.post('/send-message', (req, res) => {
    const username = req.cookies.username;
    const message = req.body.message;
    const messageData = `${username}: "${message}"\n`;
    fs.appendFileSync('messages.txt', messageData);
    res.redirect('/message-form');
});
 
// Route for displaying messages
app.get('/messages', (req, res) => {
    const messages = getMessages();
    res.send(messages);
});
 

app.get('/', (req, res) => {
    res.send('<p><a href="/login">Login</a></p>');
});


function getMessages() {
    try {
        const messages = fs.readFileSync('messages.txt', 'utf-8');
        return messages;
    } catch (error) {
        return '';
    }
}


app.listen(3000, () => {
console.log('Server Running');
});
