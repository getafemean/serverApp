const Customer = require('../models/customer');
const { ErrorHandler } = require('../helpers/errors');

const createCustomer = async (customerData) => {
    try {
        const customer = new Customer({
            name: customerData.name,
            cif: customerData.cif,
            adress: customerData.adress,
            cp: customerData.cp,
            city: customerData.city,
            contact: customerData.contact
        })
        const customerSaved = await customer.save({customer});
        return customerSaved;
    } catch(err) {
        if (err.code === 11000) {
            throw new ErrorHandler(404, 'Ya existe un cliente con ese CIF.');
        } else {
            throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
        }
    }
}

module.exports = {
    createCustomer
}