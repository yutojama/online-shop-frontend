import fs from "fs";
import products from "./products.js";

deleteIdFromProducts(products);

function deleteIdFromProducts(products){
    const prods = products.map((prod)=>{
        const { id, ...newProd} = prod;
        return newProd;
    })

     fs.writeFileSync(
        "result.json",
        JSON.stringify(prods,null,2)
    )
}