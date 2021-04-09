function calculateCOD(package) {
    // var total;
    // console.log(package);
    if (package.payment_method === 'COD' && package.service_paid_by === 'Transferer') {
        var total = package.pro_price;
        return total;
        // shop_get = package.pro_price - package.service_fee;
        // total_amount = total_amount + shop_get;
        // case1 = case1 + 1;
    }
    if (package.payment_method === 'COD' && package.service_paid_by === 'Receiver') {
        return package.pro_price + package.service_fee;
        // return total;
        // shop_get = package.pro_price;
        // total_amount = total_amount + shop_get;
        // case2 = case2 + 1;
    }
    if (package.payment_method === 'Paid' && package.service_paid_by === 'Transferer') {
        return 0;
        // return total;
        // shop_get = -package.service_fee;
        // total_amount = total_amount + shop_get;
        // case3 = case3 + 1;
    }
    if (package.payment_method === 'Paid' && package.service_paid_by === 'Receiver') {
        return package.service_fee;
        // return total;
        // shop_get = 0;
        // total_amount = total_amount + shop_get;
        // case4 = case4 + 1;
    }
    // console.log(package);
    // return total;
    return 0;
}

module.exports = calculateCOD;