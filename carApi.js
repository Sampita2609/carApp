let express=require("express");
let app=express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept");
    next();
});
var port=process.env.PORT||2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));

let {carData}=require("./carData");
let {cars}=require("./carData");

app.get("/cars",function(req,res){
    let minprice=+req.query.minprice;
    let maxprice=+req.query.maxprice;
    let fuel=req.query.fuel;
    let type=req.query.type;
    let sort=req.query.sort;
    let arr1=cars;
    if(minprice) arr1=arr1.filter((c)=>c.price>=minprice);
    if(maxprice) arr1=arr1.filter((c)=>c.price<=maxprice);
    if(fuel) arr1=arr1.filter((c)=>carData.find((c1)=>c1.model===c.model?c1.fuel===fuel:""));
    if(type) arr1=arr1.filter((c)=>carData.find((c1)=>c1.model===c.model?c1.type===type:""));
    if(sort==="kms") arr1=arr1.sort((c1,c2)=>c1.kms-c2.kms);
    if(sort==="price") arr1=arr1.sort((c1,c2)=>c1.price-c2.price);
    if(sort==="year") arr1=arr1.sort((c1,c2)=>c1.year-c2.year);
    res.send(arr1);
});

app.post("/cars",function(req,res){
    let body=req.body;
    cars.push(body);
    res.send(body)
})
app.get("/cars/:id",function(req,res){
    let id=req.params.id;
    let index=cars.findIndex((c)=>c.id===id);
    if(index>=0) res.send(cars[index]);
    else res.status(404).send("Car not Found")
})
app.put("/cars/:id",function(req,res){
    let id=req.params.id;
    let body=req.body
    console.log(body)
    let index=cars.findIndex((c1)=>c1.id===id);
    if(index>=0){
        cars[index]=body
        res.send(body)
    }
    else res.status(404).send("Car not Found")
})

app.delete("/cars/:id",function(req,res){
    let id=req.params.id;
    let index=cars.findIndex((c1)=>c1.id===id);
    if(index>=0) {
        let deletedData=cars.splice(index,1);
        res.send(deletedData)
    }
    else res.status(404).send("Car not Found")
})

app.get("/carmaster",function(req,res){
    res.send(carData)
})