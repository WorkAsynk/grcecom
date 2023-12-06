const createOrder= async (req, res) => {
    (async () => {
      try {
        await db.collection("deliveryOrder").doc("/" + req.body.orderId + "/")
            .create({
              orderId: req.body.orderId,
              location: req.body.location,
              status: "pending",
            });
        return res.status(200).send("Order Created Sucessfully");
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
  };
module.exports = createOrder;