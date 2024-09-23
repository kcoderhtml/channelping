import { slackApp, slackClient } from '../index'

const command = async () => {
    slackApp.command('/createchannelping', async ({ context, payload }) => {
        // check whether the user is an admin
        if (!process.env.ADMINS?.split(',').includes(context.userId!)) {
            await context.respond({
                text: "Sorry but you aren't authorized to use this!",
            })

            return
        }

        const members = await slackClient.conversations
            .members({
                channel: payload.channel_id!,
            })
            .then((res) => res.members)

        await slackClient.chat.postEphemeral({
            channel: payload.channel_id!,
            user: context.userId!,
            text:
                'Do you want to make a ping group for ' +
                members?.length +
                ' members?',
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: 'Are you sure you want to make a ping group for 9 members?',
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
