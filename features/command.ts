import { slackApp, slackClient } from '../index'

const command = async () => {
    slackApp.command('/createchannelping', async ({ context, payload }) => {
        // check whether the user is an admin
        if (!process.env.ADMINS?.split(',').includes(context.userId!)) {
            // check if they are a channel manager for this channel
            const channelInfo = await slackClient.conversations.info({
                channel: payload.channel_id!,
            })

            if (channelInfo.channel?.creator !== context.userId!) {
                await context.respond({
                    text: "Sorry but you aren't authorized to use this!",
                })

                return
            }
        }

        async function fetchMembers(channel: string) {
            let allMembers: string[] = []
            let nextCursor

            do {
                const response = await slackClient.conversations.members({
                    channel,
                    cursor: nextCursor,
                })

                allMembers = allMembers.concat(response.members!)
                nextCursor = response.response_metadata?.next_cursor
            } while (nextCursor)

            return allMembers
        }

        const members = (await fetchMembers(payload.channel_id!)).length

        await slackClient.chat.postEphemeral({
            channel: payload.channel_id!,
            user: context.userId!,
            text: `Do you want to make a ping group for ${members} members?`,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `Are you sure you want to make a ping group for ${members} members?`,
                    },
                },
                {
                    type: 'divider',
                },
                {
                    type: 'actions',
                    elements: [
                        {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Yes',
                            },
                            value: 'yes',
                            action_id: 'createchannelping',
                        },
                        {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'No',
                            },
                            value: 'no',
                            action_id: 'cancel',
                        },
                    ],
                },
            ],
        })
    })
}

export default command
