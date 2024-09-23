import { slackApp, slackClient } from '../index'

const createChannelPing = async () => {
    slackApp.action('createchannelping', async ({ context, payload }) => {
        // @ts-expect-error value exits but isn't recognized as existing by library
        if (payload.actions[0].value == 'no') {
            await context.respond!({
                text: 'You have chosen not to create a channel ping group!',
            })

            return
        }

        const members = await slackClient.conversations
            .members({
                channel: payload.channel?.id!,
            })
            .then((res) => res.members)

        const channelName = await slackClient.conversations
            .info({
                channel: payload.channel?.id!,
            })
            .then((res) => res.channel?.name)

        let pinggroup
        try {
            pinggroup = await slackClient.usergroups
                .create({
                    name: channelName + '-ping',
                    handle: channelName + '-ping',
                    channels: [payload.channel?.id!],
                    description: 'Channel ping group for ' + channelName,
                })
                .then((res) => res.usergroup?.id)
        } catch (e) {
            console.log(e)

            pinggroup = (await slackClient.usergroups.list()).usergroups?.find(
                (group) => group.handle == channelName + '-ping'
            )?.id
        }

        await slackClient.usergroups.users.update({
            usergroup: pinggroup!,
            users: members!,
        })

        await context.respond!({
            text: `Channel ping group <!subteam^${pinggroup}> has been created with ${members?.length} members!`,
        })
    })
}

export default createChannelPing
