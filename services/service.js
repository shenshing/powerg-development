
    exports.calculateCOD = function(package) {
        if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
            return package.pro_price;
        }
        if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
            return package.pro_price + package.service_fee;
        }
        if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
            // return 0;
            return -package.service_fee;
        }
        if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
            return 0;
        }
        return 0;
    },

    // module.exports = calculateCOD;
    // function codForReport(packages) {
    //     let total_amount = 0.00;
    //     let total_success = 0;
    //     let total_unsuccess = 0;
    //     let shop_get;
    //     packages.forEach(package => {
    //         if (package.status === 'SUCCESS') {
    //             total_success = total_success + 1;
    //             if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
    //                 shop_get = package.pro_price - package.service_fee;
    //                 total_amount = total_amount + shop_get;
    //             }
    //             if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
    //                 shop_get = package.pro_price;
    //                 total_amount = total_amount + shop_get;
    //             }
    //             if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
    //                 shop_get = -package.service_fee;
    //                 total_amount = total_amount + shop_get;
    //             }
    //             if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
    //                 shop_get = 0;
    //                 total_amount = total_amount + shop_get;
    //             }
    //         } else {
    //             total_unsuccess = total_unsuccess + 1;
    //         }
    //     })

    //     return {
    //         total_package: packages.length,
    //         success: total_success,
    //         unsuccess: total_unsuccess,
    //         total_amount 
    //     }
    // };


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
            // if(packages.length === i) {
                
            // }
            // i++;
        })
        return {
            total: packages.length,
            total_success: total_success,
            total_unsuccess: total_unsuccess,
            total_pending: total_pending,
            total_ongoing: total_ongoing
        }
    }


// module.exports = {countPackage, calculateCOD};
// module.exports = {
//     calculateCOD: function
// }
// module.exports = codForReport;