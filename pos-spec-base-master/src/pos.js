'use strict';   
function printRecipt() {
    let barcodes = formatTags(tags);
    let mergedBarcodes = mergeBarcodes(barcodes);   //合并tags
    let allItems = loadAllItems();      //得到所有商品
    let promotItems = loadPromotions();     //得到打折信息
    let proItems = matchPro(mergedBarcodes,promotItems);  //匹配优惠信息
    let cartItems = matchCartItems(proItems,allItems);      //匹配商品信息
    let uncutSubtotal = caculateUncutSubtotal(cartItems);   //计算原小计
    let uncutTotal = caculateUncutTotal(uncutSubtotal);     //计算原总计
    let cutedSubtotal = caculateCutSubtotal(uncutSubtotal);     //计算优惠后的小计
    let cutedTotal = caculateCutTotal(cutedSubtotal);       //计算优惠后的总计
    let spare = caculateSpare(uncutTotal,cutedTotal);       //计算省的钱
    output();
}
function formatTags(tags) {
    let barcodes = [];
    for(let i=0;i<tags.length;i++){
        let temp =  tags[i].split('-');
        if (temp.length === 2){
            let temp1 = parseFloat(temp[1]);
            barcodes.push({barcode:temp[0],amount:temp1});
        } else {
            barcodes.push({barcode:tags[i],amount:1});
        }
    }
    return barcodes;
}

function mergeBarcodes(barcodes) {
    let mergedBarcodes = [];
    for(let i=0;i<barcodes.length;i++){
        let temp = mergedBarcodes.find(function (item) {
            return item.barcode === barcodes[i].barcode;
        });
        if(temp){
            temp.amount = temp.amount + barcodes[i].amount;
        } else {
            mergedBarcodes.push({amount:barcodes[i].amount,barcode:barcodes[i].barcode});
        }
    }
    return mergedBarcodes;
}

function matchPro(mergedBarcodes,promotItems) {
    let proItems = [];
    for(let i=0;i<mergedBarcodes.length;i++){
        let temp = mergedBarcodes.find(function (item) {
            return (item.barcode === 'ITEM000000' || item.barcode ==='ITEM000001' || item.barcode === 'ITEM000005');
        });
        if(temp){
            proItems.push(Object.assign({},{barcode:mergedBarcodes[i].barcode},{amount:mergedBarcodes[i].amount},{type:promotItems[0].type}));
        } else {
            proItems.push(Object.assign({},{barcode:mergedBarcodes[i].barcode},{amount:mergedBarcodes[i].amount},{type:-1}));
        }
    }
    return proItems;
}

function matchCartItems(proItems,allItems) {
    let cartItems = [];
    for(let i=0;i<proItems.length;i++){
        let temp = proItems.find(function (item) {
            return  item.barcode === allItems[i].barcode;
        });
        if(temp){
            cartItems.push(Object.assign({},{barcode:proItems[i].barcode},{amount:proItems[i].amount},{name:allItems[i].name},{unit:allItems[i].unit},{price:allItems[i].price},{type:proItems[i].type}));
        }
    }
    return cartItems;
}
//subtotal = price * amount
function caculateUncutSubtotal(cartItems) {
    let uncutSubtotal = cartItems;
    for(let i=0;i<cartItems.length;i++){
        uncutSubtotal.push(Object.assign({},{uncutSubtotal:(cartItems[i].price * cartItems[i].amount)}));
    }
    return uncutSubtotal;
}

function caculateUncutTotal(uncutSubtotal) {
    let uncutTotal = [];
    let temp = 0;
    for(let i=0;i<uncutSubtotal.length;i++){
        temp += uncutSubtotal.price;
    }
    uncutTotal.push({uncutTotal:temp});
    return uncutTotal;
}

function caculateCutSubtotal(uncutSubtotal) {
    let cutedSubtotal = uncutSubtotal;
    for(let i=0;i<uncutSubtotal.length;i++){
        if(cartItems[i].type === -1){
            cutedSubtotal[i].push({cutedSubtotal:cutedSubtotal[i].uncutSubtotal});
        } else {
            cutedSubtotal[i].push({cutedSubtotal:((Number(uncutSubtotal[i].amount)/3)*2 + (Number(uncutSubtotal[i].amount%3)))*uncutSubtotal[i].price});
        }
    }
    return cutedSubtotal;
}

function caculateCutTotal(cutedSubTotal) {
    let cutedTotal = [];
    let temp = 0;
    for(let i=0;i<cutedSubTotal.length;i++){
        temp += cutedSubTotal[i].cutedSubtotal;
    }
    cutedTotal.push({cutedTotal:temp});
    return cutedTotal;
}

function caculateSpare(uncutTotal,cutedTotal) {
    let spare = [];
    let temp = uncutTotal.uncutTotal - cutedTotal.cutedTotal;
    spare.push({spare:temp});
    return spare;
}

function output() {
    console.log("***<没钱赚商店>收据***");
    for(let i=0;i<cutedSubtotal.length;i++){
        console.log("名称"+cutedSubtotal[i].barcode+",数量："+cutedSubtotal[i].amount+cutedSubtotal[i].unit+",单价："+cutedSubtotal[i].price+"(元)，小计："+cutedSubtotal[i].cutedSubtotal+"(元)");
    }
    console.log("--------------------------");
    console.log("总计："+cutedTotal[0].cutedTotal+"(元)");
    console.log("节省："+spare[0].spare+"(元)");
    console.log("**************************");
}
