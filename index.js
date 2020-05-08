const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");

// View engine
app.set("view engine", "ejs");

//Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "Afu3Hp6HXZMgj3iag76g2NIcEHRhpuwFLlrlyiaL-xfOMvXYbWDFFbk9NH1o-zZ3cmF3UXI6DlNoacof",
  client_secret:
    "EM-NrYtcyhA7oqMbmrT-UtNxYbNR-x22tCIgjbvxW4IE9v_vS9MPmljZUx9XfEFob88ghA-o6kBsG-CH",
});

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/comprar", (req, res) => {

  var pagamento = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://return.url",
      cancel_url: "http://cancel.url",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "bola",
              sku: "bola_303",
              price: "5.00",
              currency: "BRL",
              quantity: 5,
            },
          ],
        },
        amount: {
          currency: "BRL",
          total: "25.00",
        },
        description: "Esta é a melhor bola de todas.",
      },
    ],
  };

  //criar pagamento
  paypal.payment.create(pagamento,(error, payment)=> {

    if (error) {
        console.log(error)
        throw error;
    } else {
       // console.log("Create Payment Response");
      //  console.log(payment);
        for (let i = 0; i < payment.links.length; i++) {
          var p = payment.links[i];

          if(p.rel === 'approval_url'){
            res.redirect(p.href);
          }
        }
    }

  });

});

app.listen(45567, () => {
  console.log("Running!");
});
