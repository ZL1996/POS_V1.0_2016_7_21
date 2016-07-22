'use strict';
describe("mergeBarcodes test",function () {
   it("mergedBarcodes should be ",function () {
       let tags = ['ITEM000001',
           'ITEM000001',
           'ITEM000001',
           'ITEM000001',
           'ITEM000001',
           'ITEM000003-2.5',
           'ITEM000005',
           'ITEM000005-2'];
       let mergedBarcodes = [{amount:5,barcode:'ITEM000001'},
           {amount:2.5,barcode:'ITEM000003'},
           {amount:3,barcode:'ITEM000005'}];
       expect(mergeBarcodes(formatTags(tags))).toEqual(mergedBarcodes);
   });
});

describe("matchPro test",function () {
    it("proItems should be ",function () {
        let promotItems = [
            {
                type: 'BUY_TWO_GET_ONE_FREE',
                barcodes: [
                    'ITEM000000',
                    'ITEM000001',
                    'ITEM000005'
                ]
            }
        ];

        let mergedBarcodes = [{amount:5,barcode:'ITEM000001'},
            {amount:2.5,barcode:'ITEM000003'},
            {amount:3,barcode:'ITEM000005'}];

        let result = [{barcode:'ITEM000001',amount:5,type:'BUY_TWO_GET_ONE_FREE'},
            {barcode:'ITEM000003',amount:2.5,type:-1},
            {barcode:'ITEM000005',amount:3,type:'BUY_TWO_GET_ONE_FREE'}];
        expect(matchPro(mergedBarcodes,promotItems)).toEqual(result);
    });
});

describe("matchCartItems test",function () {
    it("cartItems should be ",function() {
        let proItems = [{barcode:'ITEM000001',amount:5,type:'BUY_TWO_GET_ONE_FREE'},
            {barcode:'ITEM000003',amount:2.5,type:-1},
            {barcode:'ITEM000005',amount:3,type:'BUY_TWO_GET_ONE_FREE'}];
        let allItems = [
            {
                barcode: 'ITEM000000',
                name: '可口可乐',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000001',
                name: '雪碧',
                unit: '瓶',
                price: 3.00
            },
            {
                barcode: 'ITEM000002',
                name: '苹果',
                unit: '斤',
                price: 5.50
            },
            {
                barcode: 'ITEM000003',
                name: '荔枝',
                unit: '斤',
                price: 15.00
            },
            {
                barcode: 'ITEM000004',
                name: '电池',
                unit: '个',
                price: 2.00
            },
            {
                barcode: 'ITEM000005',
                name: '方便面',
                unit: '袋',
                price: 4.50
            }
        ];
        let result = [{barcode:'ITEM000001',amount:5,name:'雪碧',unit:'瓶',price:3.00,type:'BUY_TWO_GET_ONE_FREE'},
            {barcode:'ITEM000003',amount:2.5,name:'荔枝',unit:'斤',price:15.00,type:-1},
            {barcode:'ITEM000005',amount:3,name:'方便面',unit:'袋',price:4.50,type:'BUY_TWO_GET_ONE_FREE'}];
        expect(matchCartItems(proItems,allItems)).toEqual(result);
    });
});

describe("caculateUncutSubtotal test",function () {
    it("uncutSubtotal should be ",function () {
        let cartItems = [{barcode:'ITEM000001',amount:5,name:'雪碧',unit:'瓶',price:3.00,type:'BUY_TWO_GET_ONE_FREE'},
            {barcode:'ITEM000003',amount:2.5,name:'荔枝',unit:'斤',price:15.00,type:-1},
            {barcode:'ITEM000005',amount:3,name:'方便面',unit:'袋',price:4.50,type:'BUY_TWO_GET_ONE_FREE'}];
        
        let result = [{barcode:'ITEM000001',amount:5,name:'雪碧',unit:'瓶',price:3.00,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:15.00},
            {barcode:'ITEM000003',amount:2.5,name:'荔枝',unit:'斤',price:15.00,type:-1,uncutSubtotal:42.5},
            {barcode:'ITEM000005',amount:3,name:'方便面',unit:'袋',price:4.50,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:13.5}];
        expect(caculateUncutSubtotal(cartItems)).toEqual(result);
    });
});

describe("caculateUncutTotal test",function () {
    it("uncutTotal should be ", function () {
        let uncutSubtotal = [{
            barcode: 'ITEM000001',
            amount: 5,
            name: '雪碧',
            unit: '瓶',
            price: 3.00,
            type: 'BUY_TWO_GET_ONE_FREE',
            uncutSubtotal: 15.00
        },
            {barcode: 'ITEM000003', amount: 2.5, name: '荔枝', unit: '斤', price: 15.00, type: -1, uncutSubtotal: 42.5},
            {
                barcode: 'ITEM000005',
                amount: 3,
                name: '方便面',
                unit: '袋',
                price: 4.50,
                type: 'BUY_TWO_GET_ONE_FREE',
                uncutSubtotal: 13.5
            }];

        let result = [{uncutTotal: 71}];
        expect(caculateUncutTotal(uncutSubtotal)).toEqual(result);
    });
});

describe("caculateCutSubtotal test",function () {
   it("cutedSubtotal should be ",function () {
       let uncutSubtotal = [{barcode:'ITEM000001',amount:5,name:'雪碧',unit:'瓶',price:3.00,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:15.00},
           {barcode:'ITEM000003',amount:2.5,name:'荔枝',unit:'斤',price:15.00,type:-1,uncutSubtotal:42.5},
           {barcode:'ITEM000005',amount:3,name:'方便面',unit:'袋',price:4.50,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:13.5}];
       
       let result = [{barcode:'ITEM000001',amount:5,name:'雪碧',unit:'瓶',price:3.00,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:15.00,cutedSubtotal:12.00},
           {barcode:'ITEM000003',amount:2.5,name:'荔枝',unit:'斤',price:15.00,type:-1,uncutSubtotal:42.5,cutedSubtotal:42.5},
           {barcode:'ITEM000005',amount:3,name:'方便面',unit:'袋',price:4.50,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:13.5,cutedSubtotal:9.00}];
       
       expect(caculateCutSubtotal(uncutSubtotal)).toEqual(result);
   }); 
});

describe("caculateCutTotal test",function () {
    it("cutedTotal should be ",function () {
        let cutedSubTotal = [{barcode:'ITEM000001',amount:5,name:'雪碧',unit:'瓶',price:3.00,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:15.00,cutedSubtotal:12.00},
            {barcode:'ITEM000003',amount:2.5,name:'荔枝',unit:'斤',price:15.00,type:-1,uncutSubtotal:42.5,cutedSubtotal:42.5},
            {barcode:'ITEM000005',amount:3,name:'方便面',unit:'袋',price:4.50,type:'BUY_TWO_GET_ONE_FREE',uncutSubtotal:13.5,cutedSubtotal:9.00}];
        
        let result = [{cutedTotal:66.5}];
        expect(caculateCutTotal(cutedSubTotal)).toBe(result);
    });
});

describe("caculateSpare test",function () {
   it("spare should be ",function () {
       let uncutTotal = [{uncutTotal: 71}];
       let cutedTotal = [{cutedTotal:66.5}];
       let result = [{spare:4.5}];
       expect(caculateSpare(uncutTotal,cutedTotal)).toEqual(result);
   }); 
});

