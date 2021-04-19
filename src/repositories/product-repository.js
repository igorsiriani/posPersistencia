const ProductMon = require('../models/product-mongo');

const sqlConn = require('../../db.js');

const redis = require('promise-redis')();
const redisCli = redis.createClient();

exports.post = async(data) => {
    await sqlConn.getConnection().then(promiseConnection => {
        var conn = promiseConnection.connection;
        conn.beginTransaction( (err) => {
            if (err) {
                conn.rollback(function() {
                    conn.release();
                });
            } else {
                conn.query(`INSERT INTO product(id, name, price) VALUES (${data.id}, '${data.name}', ${data.price})`, (err, results) => {
                    if (err) {
                        conn.rollback(function() {
                            conn.release();
                        });
                    } else {
                        conn.commit(function(err) {
                            if (err) {
                                conn.rollback(function() {
                                    conn.release();
                                });
                            } else {
                                conn.release();
                            }
                        });
                    }
                })
            }
       });
    })
    const productMon = new ProductMon(data);
    await productMon.save();
}

exports.getById = async(id) => {
    let res = await redisCli.get(`${id}`);
    if (!res) {
        res = await ProductMon.find({ id: id });
        redisCli.set(`${id}`, JSON.stringify(res), 'EX', 300);

        return res;
    } else {
        return JSON.parse(res);
    }
    
}

exports.delete = async(id) => {
    await sqlConn.getConnection().then(promiseConnection => {
        var conn = promiseConnection.connection;
        conn.beginTransaction( (err) => {
            if (err) {
                conn.rollback(function() {
                    conn.release();
                });
            } else {
                conn.query(`DELETE FROM product WHERE id=` + id, (err, results) => {
                    if (err) {
                        conn.rollback(function() {
                            conn.release();
                        });
                    } else {
                        conn.commit(function(err) {
                            if (err) {
                                conn.rollback(function() {
                                    conn.release();
                                });
                            } else {
                                conn.release();
                            }
                        });
                    }
                })
            }
       });
    })
    await ProductMon.findOneAndDelete({ id: id });
    await redisCli.del(`${id}`);
}