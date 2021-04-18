const ProductMon = require('../models/product-mongo');

const sqlConn = require('../../db.js');

const redis = require('promise-redis')();
const redisCli = redis.createClient();

exports.post = async(data) => {
    await sqlConn.query(`INSERT INTO product(id, name, price) VALUES (${data.id}, '${data.name}', ${data.price})`);

    const productMon = new ProductMon(data);
    await productMon.save();
}

exports.getById = async(id) => {
    let res = await redisCli.get(`${id}`);
    console.log(res);
    if (!res) {
        res = await ProductMon.find({ id: id });
        redisCli.set(`${id}`, JSON.stringify(res), 'EX', 300);

        return res;
    } else {
        return JSON.parse(res);
    }
    
}

exports.delete = async(id) => {
    await ProductMon.findOneAndDelete({ id: id });
    await sqlConn.query(`DELETE FROM product WHERE id=` + id);
    await redisCli.del(`${id}`);
}