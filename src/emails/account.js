const sgMail = require('@sendgrid/mail')

// const sendgridAPIKey = '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'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
    to : email,
    from : 'prabhast11@gmail.com',
    subject : 'Thanks for joining in!',
    text : `Welcome to the app, ${name}, Let me know how to get along with the app `
})

}

const sendCancelEmail = (email, name) => {
    sgMail.send({
    to : email,
    from : 'prabhast11@gmail.com',
    subject : 'Thanks for joining in! But you could stay with us!',
    text : `Thanks for using our task manager app, ${name}, Let me know what we could do for you `
})

}



module.exports ={
    sendWelcomeEmail,
    sendCancelEmail
}