const connection = require('../database/dbService');
    exports.calculateCOD = function(package) {
        if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
            // old
            return package.pro_price - package.service_fee;
        }
        if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
            return package.pro_price;
        }
        if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
            return -package.service_fee;
        }
        if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
            //old
            // return 0;
            //new 
            return package.pro_price;
        }
        return 0;
    },
    exports.countPackage = function(packages) {
        let total_success = 0;
        let total_unsuccess = 0;
        let total_pending = 0;
        let total_ongoing = 0;
        let i = 0;
        packages.forEach(package => {
            if(package.status === 'SUCCESS') {
                total_success = total_success + 1;
            } else if(package.status === 'UNSUCCESS') {
                total_unsuccess = total_unsuccess + 1;
            } else if(package.status === 'ON GOING') {
                total_ongoing = total_ongoing + 1;
            } else {
                total_pending = total_pending + 1;
            }
        })
        return {
            total: packages.length,
            total_success: total_success,
            total_unsuccess: total_unsuccess,
            total_pending: total_pending,
            total_ongoing: total_ongoing
        }
    }

exports.responseForDeliveryList = function(package) {
        if(package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
            package.service_fee = 0;
            return package;
        } else if(package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
            return package;
        } else if(package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
            package.service_fee = 0;
            package.pro_price;
            return package;
        } else { //(package.payment_method === 'Paid', && package.service_paid_by === 'Receiver')
            // package.pro_price = 0;
            // return package;
            return package.pro_price;
        }
}

exports.totalAmountForList = function(packages) {
    let total_amount = 0.00;
    let total_success = 0;
    let total_unsuccess = 0;
    let total_ongoing = 0;
    let delivery_man_pay;
    packages.forEach(package => {
        if (package.status === 'SUCCESS') {
            total_success = total_success + 1;
            // total_amount = total_amount + package.package_price;
            if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
                delivery_man_pay = package.pro_price;
                total_amount = total_amount + delivery_man_pay;
            }
            if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
                delivery_man_pay = package.pro_price + package.service_fee;
                total_amount = total_amount + delivery_man_pay;
            }
            if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
                delivery_man_pay = 0;
                total_amount = total_amount + delivery_man_pay;
            }
            if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
                delivery_man_pay = package.service_fee;
                total_amount = total_amount + delivery_man_pay;
            }
        } else if(package.status === 'ON GOING') {
            total_ongoing = total_ongoing + 1;
        } else {
            total_unsuccess = total_unsuccess + 1;
        }
    })

    return {
        total_package: packages.length,
        success: total_success,
        unsuccess: total_unsuccess,
        ongoing: total_ongoing,
        total_amount
    }
}

exports.getArrayOfPackage = function(array_of_package_id) {
    // return 'total length: ' + array_of_package_id.length;
    let packages = [];
    const query = `SELECT * FROM Packages WHERE package_id in (${array_of_package_id})`;
    connection.query(query, (err, result) => {
        if(err) {
            return [];
        } else {
            if(result.length === 0) {
                return [];
            } else {
                // console.log(result);
                return result;
            }
        }
    })
}