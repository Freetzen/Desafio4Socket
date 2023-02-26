import fs from "fs";



class Producto {
    constructor(title, description, price, thumbnail, code, stock,status,category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.status = status;
        this.category = category;
    }
}


const producto1 = new Producto("Pubg", "acción", 600, true, ["src/public/images/games/p2.jpg"], "PB2", 20);
const producto2 = new Producto("Counter Strike 2", "accion", 900, true, ["src/public/images/games/cs2.jpg"], "CS2", 180);
const producto3 = new Producto("Resident Evil 8", "terror", 1000, true, ["src/public/images/games/re8.jpg"], "RE8", 100);
const producto4 = new Producto("Destiny 3", "accion", 1400, true, ["src/public/images/games/destiny3.png"], "D3", 200);

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    checkArchivo = ()=>{
        return fs.existsSync(this.path)       
    }
    crearArchivo = async () => {
        await fs.promises.writeFile(this.path, "[]")
    }
    addProduct = async (newProduct) => {
        let i=0;
        let cantidadCampos=8;
        for (const campo in newProduct){
            i++
        }
        if (i==cantidadCampos){
            if (newProduct.status===true && newProduct.category.length>0 && newProduct.title.length > 0 && newProduct.description.length > 0 && toString(newProduct.price).length > 0  && newProduct.code.length > 0 && toString(newProduct.stock).length > 0) {
                let contenido = await fs.promises.readFile(this.path, "utf-8");
                let arrayProductos = JSON.parse(contenido);
                if (arrayProductos.filter(product => product.code == newProduct.code).length > 0) {
                    return "Ya existe el producto";
                }
                else 
                {
                    let contenido = await fs.promises.readFile(this.path, "utf-8");
                    let aux = JSON.parse(contenido);
                    if (aux.length>0){
                        const idAutoincremental = aux[aux.length-1].id+1; //Esto para que sea incremental dependiendo del ultimo elemento
                        aux.push({ id: idAutoincremental, ...newProduct });
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto Agregado"
                    }
                    else{
                        const idAutoincremental = 1;
                        aux.push({ id: idAutoincremental, ...newProduct });
                        await fs.promises.writeFile(this.path, JSON.stringify(aux));
                        return "Producto agregado"
                    }
    
                }
            } else {
                return "No puede tener campos vacios"
            }
        }else{
            return `Falta o sobra al menos 1 campo (deben ser ${cantidadCampos})`
        }
       
    }

    getAllProducts= async()=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        return aux;   
    }
    updateProduct = async({id, title, description, price, thumbnail, code, stock, status, category})  => {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) {
            let pos = aux.findIndex(product => product.id === id)
            if (title!=undefined){
                if (title.length>0)
                {
                    aux[pos].title = title;
                }
            }
            if (description!=undefined){
                if (description.length>0)
                {
                    aux[pos].description = description;
                }
            }
            if (price!=undefined){
                if (price.length>0)
                {
                    aux[pos].price = parseFloat(price);
                }
            }
            if (thumbnail!=undefined){
                if (thumbnail.length>0)
                {
                    aux[pos].thumbnail = thumbnail;
                }
            }
            if (aux.some(prod => prod.code==code)){
                return "No puede poner un codigo que ya existe"
            }else if(code!=undefined){
                if (code.length>0)
                {
                    aux[pos].code = code;
                }
            }
            if (stock!=undefined){
                if (stock.length>0)
                {
                    aux[pos].stock = parseInt(stock);
                }
            }        
            if (status!=undefined){
                if (status==false)
                {
                    aux[pos].status = false;
                }else{
                    aux[pos].status = true;
                }
            }
            if (category!=undefined){
                if (category.length>0)
                {
                    aux[pos].category = category;
                }
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(aux))
            return "Producto actualizado exitosamente";
        } else {
            return  "Producto no encontrado para actualizar"
        }
    
    }
    getProductById= async(id)=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')  
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) 
        {
            let pos = aux.findIndex(product => product.id === id)
            return aux[pos];
        }else{
            return null
        }        
    }

    deleteProductById= async(id)=> {
        let contenido = await fs.promises.readFile(this.path, 'utf-8')
        let aux = JSON.parse(contenido)
        if(aux.some(product=> product.id === id)) 
        {
            const arraySinElIdSeleccionado = aux.filter(product => product.id != id);
            await fs.promises.writeFile(this.path, JSON.stringify(arraySinElIdSeleccionado))
            return "Producto eliminado exitosamente";           
        }else{
            return "No se encontró el producto que desea eliminar"
        }        
    }
        
    cargarArchivo = async () => {
        //tests pedidos y adicionales:
        await this.crearArchivo(); //Es para que si no tiene el array vacio al inicio se lo ponga así evitamos errores, y para asegurarnos que existe el archivo
        await this.addProduct(producto1);
        await this.addProduct(producto2);
        await this.addProduct(producto3);
        await this.addProduct(producto4);

    }

}
// const manager = new ProductManager('../models/products.json');
// const tests = async()=>{
//     await manager.updateProduct({id:1,title:"2",description:"3",price:"4",thumbnail:["5"],code:"6",stock:"7",status:false,category:"9"})
// };

// tests();




// tests()

