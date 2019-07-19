var checkoutHandler = StripeCheckout.configure({
    key: "pk_test_7YrdOo8o9DKU9SMK95W5bvXb00ePCRqAAI",
    locale: "auto"
});

var button = document.getElementById("buttonCheckout");
button.addEventListener("click", function(ev) {
    ev.preventDefault();
    const description = $('#stripe-payment-description').val() || 'payment description';

    checkoutHandler.open({
        name: "Sample Store",
        description: "Example Purchase",
        token: handleToken
    });
});

function handleToken(token) {
    fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(token)
    })
    .then(output => {
        console.log('finished stripe payment');
        $('#stripe-payment-alert-message').append(`
            <div class="alert alert-success"  role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                Payment successful! You should receive an email confirmation.
            </div>
        `);
    })

    // var dbId = $('#buttonCheckout').data('dbid');
    // console.log(dbId);

    // fetch("/charge", {
    //     method: "POST",
    //     headers: {"Content-Type": "application/json"},
    //     body: JSON.stringify(token)
    //   })
    //   .then(response => {
    //     if (!response.ok)
    //       throw response;
    //     return response.json();
    //   })
    //   .then(output => {
    //     console.log("Purchase succeeded:", output);
    //   })
    //   .catch(err => {
    //     console.log("Purchase failed:", err);
    //   })
  }