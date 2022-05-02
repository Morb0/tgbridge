# Telegram Bridge
Telegram Bot-to-Bot communication bridge.\
User-bot resend message received from trusted peer to peer specified in message text payload.

### Example
- Bot A send message to Bridge with next message `|botB|Lorem Ipsum`.
- Bridge receive message and extract `botB` login then remove it from message text and send `botB` message `Lorem Ipsum`.
- Bot B receive message from Bridge `Lorem Ipsum`.

This makes more sense for forwarding files, since each user has a unique ID for uploaded files.