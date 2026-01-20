export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    return await $fetch('https://taro-bot-xi.vercel.app/createInvoiceLink', {
        method: 'POST',
        body
    })
})
