import { slackApp } from '../index'

const cancel = async () => {
    slackApp.action('cancel', async ({ context }) => {
        await context.respond!({
            text: 'You have chosen not to create a channel ping group!',
        })
    })
}

export default cancel
