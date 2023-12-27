const create_WearHouse = require('./create_wh');

const Booking_WearHouse = async (req, res) => {
    try {
        const {uid, 
            data:[
                {location, landmark, pincode, city, state, country, isdefault}
            ]
            
        }  = req.body;

  
        const warehouseData = {
            uid,
            data: [
                {
                    location,
                    landmark,
                    pincode,
                    city,
                    state,
                    country,
                    isdefault
                }
            ]
        };
        // Call create_WearHouse with the warehouse data
        const warehouseId = await create_WearHouse(warehouseData);

        // Respond with a success message
        res.status(200).json({message: 'Warehouse created successfully', warehouseId});
    }

    catch(err) {
        console.log(err);
        res.status(500).json({message: 'Something went wrong'});
    }
}
module.exports = Booking_WearHouse;