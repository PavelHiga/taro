export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await $fetch('https://taro-bot-xi.vercel.app/reading-paid', {
        method: 'POST',
        body
    })
})
