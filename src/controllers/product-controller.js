
const repository = require('../repositories/product-repository');


exports.post = async (req, res) => {
    try {
        let data = {id: req.body.id, name: req.body.name, price: req.body.price}

        await repository.post(data); 

        res.status(201).send({
            message: 'Product added successfully',
            data: data
        });
    } catch (error) {
        res.status(500).send({
            message: 'Failed processing request',
            erro: error.toString()
        });
    }

};

exports.getById = async(req, res) => {
    try {
        const id = req.params.productId;
        const data = await repository.getById(id);
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(404).send({message: 'Product not found'});
        }
    } catch (error) {
        res.status(500).send({
            message: 'Failed processing request',
            erro: error.toString()
        });
    }

};

exports.delete = async(req, res) => {
    try {
        await repository.delete(req.params.productId);
        res.status(200).send({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Failed processing request',
            erro: error.toString()
        });
    }
};