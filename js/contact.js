const contactForm = document.getElementById("contact-form"),
      contactMessage = document.getElementById("contact-message")

const sendEmail = (e) => {
    e.preventDefault()

    // serviceID -templateID - #form - publickey
    emailjs.sendForm('service_vqq5c6d','template_a01p3rm','#contact-form','tfyCqI7QBFidv3MIR')
        .then(()=>{
            // show sent message
            contactMessage.textContent = 'Message sent successfully'
            // Remove message after five seconds
            setTimeout(()=>{
                contactMessage.textContent = ''
            }, 5000)

            // clear input fields
            contactForm.reset()
        }, ()=>{
            // show error messages 
            contactMessage.textContent = 'Message not sent x'
        })
    }
contactForm.addEventListener('submit', sendEmail)
