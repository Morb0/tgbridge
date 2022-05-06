# TGBridge
Telegram Bot-to-Bot communication bridge.\
User-bot resend message received from trusted peer to peer specified in message text payload.

### Example
- Bot A send message to Bridge with next message `|botB|Lorem Ipsum`.
- Bridge receive message and extract `botB` login then remove it from message text and send `botB` message `Lorem Ipsum`.
- Bot B receive message from Bridge `Lorem Ipsum`.

This makes more sense for forwarding files, since each user has a unique ID for uploaded files.

## Docker
Deploy ready container available on [DockerHub](https://hub.docker.com/r/morb0/tgbridge).

⚠️ Bots cannot write to you first, so be sure to initiate a dialog with the bot you'll be receiving messages from first. This can be done manually if you have direct access to the account or make it write to the bot itself - `|myBot|/start`. But do not forget to add the ID of yourself and the bot in the `ALLOWED_PEER_IDS` variable.\
Also, make a username for your user-bot, as bots can only write to you if you have it setup.