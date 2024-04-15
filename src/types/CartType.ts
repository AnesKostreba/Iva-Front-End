export default interface CartType {
    cartId: number;
    userId: number;
    createdAt: string;
    user: any;
    cartArticles: {
        carArticleId: number;
        articleId: number;
        quantity: number;
        article:{
            articleId: number;
            name: string;
            category: {
                categoryId: number;
                name: string;
            }
        articlePrices:{
            articlePriceId: number;
            price: number;
        }[]
        }
    }[];
}

    // [
        // {
        //     "carArticleId": 27,
        //     "": 22,
        //     "": 1,
        //     "": 4,
        //     "article": {
        //         "articleId": 1,
        //         "": "ACME HD11 1024GB",
        //         "categoryId": 5,
        //         "excerpt": "Neki kratak tekst 2....",
        //         "description": "Neki malo duži tekst o proizvodu 2.",
        //         "status": "visible",
        //         "isPromoted": 1,
        //         "createdAt": "2023-12-02T10:20:38.000Z",
        //         "": {
        //             "": 5,
        //             "name": "Hard diskovi",
        //             "imagePath": "neka/putanja/hdd.png",
        //             "parentCategoryId": 4
        //         },
//                 "": [
//                     {
//                         "articlePriceId": 1,
//                         "articleId": 1,
//                         "price": "45.00",
//                         "createdAt": "2023-12-02T11:03:11.000Z"
//                     },
//                     {
//                         "articlePriceId": 2,
//                         "articleId": 1,
//                         "price": "43.56",
//                         "createdAt": "2023-12-02T11:03:33.000Z"
//                     },
//                     {
//                         "articlePriceId": 43,
//                         "articleId": 1,
//                         "price": "0.00",
//                         "createdAt": "2023-12-14T11:20:59.000Z"
//                     },
//                     {
//                         "articlePriceId": 44,
//                         "articleId": 1,
//                         "price": "0.00",
//                         "createdAt": "2023-12-14T11:24:44.000Z"
//                     },
//                     {
//                         "articlePriceId": 45,
//                         "articleId": 1,
//                         "price": "0.00",
//                         "createdAt": "2023-12-14T11:25:02.000Z"
//                     },
//                     {
//                         "articlePriceId": 46,
//                         "articleId": 1,
//                         "price": "0.00",
//                         "createdAt": "2023-12-14T11:25:08.000Z"
//                     },
//                     {
//                         "articlePriceId": 47,
//                         "articleId": 1,
//                         "price": "0.00",
//                         "createdAt": "2023-12-14T11:25:18.000Z"
//                     },
//                     {
//                         "articlePriceId": 48,
//                         "articleId": 1,
//                         "price": "0.00",
//                         "createdAt": "2023-12-14T11:26:23.000Z"
//                     },
//                     {
//                         "articlePriceId": 57,
//                         "articleId": 1,
//                         "price": "111.55",
//                         "createdAt": "2023-12-14T11:44:14.000Z"
//                     }
//                 ]
//             }
//         }
//     ]
// }
// }