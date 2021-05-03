
    exports.calculateCOD = function(package) {
        if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
            return package.pro_price - package.service_fee;
        }
        if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
            return package.pro_price;
        }
        if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
            return -package.service_fee;
        }
        if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
            return 0;
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
            package.pro_price = 0;
            return package;
        }
}