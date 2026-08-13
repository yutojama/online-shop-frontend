/* get attributes from products */
import fs from "fs";
import path from "path";
import products from "./products.js";

const prodsImage = getAttribute(products);
const prodsDeleteId = deleteIdFromProducts(prodsImage);
const prodsNoQuantity = nullifyQuantity(prodsDeleteId);
const prodsNoDiscount = deleteDiscount(prodsNoQuantity)
saveProducts(prodsNoDiscount);

function getAttribute(products){

    let ct = 1;
    
    let att = products.map((prod)=>{
        // return prod.description;

        prod.image = `/images/prod_${String(ct++).padStart(3,'0')}`;
        return prod;
    })

    const folder = "../../public/images";
    const files = fs.readdirSync(folder);

    files.forEach((file, index) => {
        /* get the file format */
        //products[index].image += path.extname(file);

        /* get absolute path */
        att[index].image = path.resolve(file);
    });

    return products;
}

function deleteIdFromProducts(products){
    const prods = products.map((prod)=>{
        const { id, ...newProd} = prod;
        return newProd;
    })
    return prods;
}

function nullifyQuantity(products){
    return products.map((prod)=>{
        prod.quantity = 0;
        return prod;
    })
}

function deleteDiscount(products){
    return products.map((prod)=>{
        Math.random()>0.5&&(delete prod.discountPrice)
        return prod;
    })
}

function saveProducts(products){
    
    fs.writeFileSync(
        "products.json",
        JSON.stringify(products,null,2)
    )

}