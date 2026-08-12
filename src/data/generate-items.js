/* generate item data from products */
import fs from "fs";
import products from "./products.js";

generateItems(products);

function generateItems(products) {
    const items = [];
    let id = 1;
    const sizes = ["S", "M", "L", "XL"];

    products.forEach((product)=>{
        
        const sizeAmount = [0,0,0,0];
        for(let i=0;i<product.amountRemain;i++){
            const randomSize = Math.floor(Math.random() * sizes.length);
            sizeAmount[randomSize]++;
        }

        for(let i=0;i<sizeAmount.length;i++){
            items.push({
                id: id++,
                product_id: product.id,
                amountRemain: sizeAmount[i],
                size: sizes[i]
            })
        }

    });

    fs.writeFileSync(
        "items.json",
        JSON.stringify(items,null,2)
    )
}