
const customerMessage = (date, type, order, name, message, needsDelivery, addresses) => {
    let orderTotal = 0
    Object.keys(order).forEach(Order => {
        orderObj = order[Order]
        orderTotal += orderObj.totalCost
    })
    let totalString = orderTotal.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    })
    const customerOrder = (order) => {
        returnString = ``
        Object.keys(order).forEach(Order => {
            orderObj = order[Order]
            returnString += ` <li class="order__box-orders--item">
            <h4 style = "margin-top: .5rem">${orderObj.amount} x ${Order} Chin Chin: $${orderObj.totalCost}</h4>
            <p style = "margin-top: 0"> Chin-chin ${orderObj.description}</p>
            </li>`
        })
        return returnString
    }
    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };

    return (
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100&display=swap" rel="stylesheet">
    </head>

    <body style = "font-family: Helvetica, Sans-Serif;
    color: rgb(90, 70, 33);
    background-color: rgb(255, 241, 214);
    padding: 1rem;">
    <section class="header">
        <h1 class="header__logo" style = "font-size: 1.6rem;
        border-bottom: 1px solid orange;
        margin-bottom: 3rem;">New Order Request  |  Crunchee Munchies</h1>
        <h2>${type === 'customOrder' ? 'Event/Party Order' : 'Standard Order'}</h2>
    </section>
    <section class="message">
        <h2 class="header__message" style = "font-size: 1rem;">Thank you ${name} for requesting an order! We have your request and will
            contact you soon!</h2>
    </section>
    <section class="order" style = "margin-bottom: 1rem;">
        <h3 class="order__header">Your order:</h3>
        <div class="order__box">
            <h4 class="order__box-header" style = "margin-bottom: .3rem">On ${date.toLocaleDateString('en-US', dateOptions)}, you ordered:</h4>
            <ul class="order__box-orders">
               ${customerOrder(order)
        }
            </ul>
            <h3 class="order__total style = "font-weight: bold;
            font-size: 1 rem;">Total Price : ${totalString}</h3>
        </div>
    </section>
    <section class="notes" style = "margin-bottom: 1rem;">
        <h4 class="notes__header" style = "margin-bottom: .3rem">Notes:</h4>
        <p class="notes__message" "margin-top: 0">${message && message != ''? message : ''}</p>
    </section>
    <section class="address">
    <h4 class="address__header">Address:</h4>
        <p class="address__message">${
            needsDelivery ? 
            addresses.address + ', ' +addresses.city + ', ' + addresses.region + ', ' + addresses.country:
            'Pickup Order'
        }</p>
    </section>
    <section class="footer">
        <h3 class="footer__header">Thank you for ordering from Crunchee Munchies</h3>
        <p>You can submit payment via e-transfer to ogbonna@shaw.ca or pay cash during pickup</p>
        ${
            type === 'customOrder' ? 
            '<p>If you selected the option for a custom label, we will reach out regarding label design. Feel free to send us pictures you want to use for the label and label design ideas by including them in a response to this email</p>' : ''
        }
        <a class="link" href = '/'>Click here to order more</a>
    </section>
</body>
<script>
</script>
<style>
    body {
        font-family: 'Montserrat';
        color: rgb(90, 70, 33);
        background-color: rgb(255, 241, 214);
        padding: 1rem;
    }
    h1 {
        font-size: 1.6rem;
        border-bottom: 1px solid orange;
        margin-bottom: 3rem;
    }
    h2 {
        font-size: 1rem;
    }
    .order__total{
        font-weight: bold;
        font-size: 1 rem;
    }
    .order__header{
        text-decoration: underline;
    }
    .order {
        margin-bottom: 4rem;
    }
</style>
</html>
        `
    )
}

module.exports = {
    customerMessage
}