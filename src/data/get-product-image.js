/* get attributes from products */
import fs from "fs";
import path from "path";
import products from "./products.js";

getAttribute(products);

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
        products[index].image += path.extname(file);
    });


    fs.writeFileSync(
        "products.json",
        JSON.stringify(att,null,2)
    )
}