<!-- omit in toc -->
# Channel Ping!

A quick bot I made to create a slack ping group for all the members of the channel in which the command is run.

## Getting Started

Just follow the directions in [DOCS.md](DOCS.md) but the tldr is clone the repo run `bun install` and then start it with a systemd service 

## Production

Deploying The Tavern in a production environment is pretty easy. Simply use a systemctl service file to manage the bot (i totaly would have used docker but i was burned by docker-prisma interactions in the past and so now I'm sticking to systemd services lol):

```ini
[Unit]
Description=ChannelPing
DefaultDependencies=no
After=network-online.target

[Service]
Type=exec
WorkingDirectory=/home/kierank/channelping
ExecStart=bun run index.ts
TimeoutStartSec=0
Restart=on-failure
RestartSec=1s

[Install]
WantedBy=default.target
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

_© 2024 Kieran Klukas_  
_Licensed under [AGPL 3.0](LICENSE.md)_