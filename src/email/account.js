const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'siddheshjuhukar@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app ${name}`
    })
}

const sendCancellationemail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'siddheshjuhukar@gmail.com',
        subject: 'Thank you for using our app',
        text: `Thank you for using our app ${name}. Is there any feedback you would like to provide regarding your experience with us`
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancellationemail
}