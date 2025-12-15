let hbs=require('hbs')
let mongoose=require('mongoose')

let bodyParser=require('body-parser')
let urlenCoded=bodyParser.urlencoded({extended:false})
let User=require('./models/User')
let Product=require('./models/product')

let express=require('express')
let app=express()

app.set('view engine','hbs')
app.use(urlenCoded);
app.use(express.json())
app.use(express.static('public'))

// let allowedEmails ='admin'




app.get('/',(req,res)=>{
    res.redirect('/reg')
})


app.get('/reg',(req,res)=>{
    res.render('reg.hbs')
})


app.get('/login',(req,res)=>{
    res.render('login.hbs')
})


app.get('/reg/:id',async (req,res)=>{
    let id=req.params.id
    let user=await User.findById(id)
    if(user) res.send(user)
    else res.sendStatus(404)
})


app.get('/main',(req,res)=>{
    res.render('start.hbs')
})


app.get('/main/:id',async (req,res)=>{
    let user = await User.findById(req.params.id);
    if (!user) {
        return res.send('Пользователь не найден');
    }
    res.render('start.hbs', { user });
})


app.get('/admin',(req,res)=>{
    res.render('admin.hbs')
    
})


// app.get('/admin/:id',async (req,res)=>{
//     let id=req.params.id
//     let products=await Product.findById(id)
//     if(products) res.send(products)
//     else res.sendStatus(404)
// })
app.get('/products.json', (req, res) => {
    res.sendFile(__dirname + '/products.json');
});

app.get('/products',(req,res)=>{
    res.render('products.hbs')
})
app.get('/products/:id',async (req,res)=>{
    let user=await User.findById(req.params.id)
    res.render('products.hbs',{user})
})
app.get('/about',(req,res)=>{
    res.render('info.hbs')
})
app.get('/about/:id',async (req,res)=>{
    let user=await User.findById(req.params.id)
    res.render('info.hbs',{user})
})
app.get('/cabinet',(req,res)=>{
    res.render('cabinet.hbs')
})
app.get('/cabinet/:id',async (req,res)=>{
    let user=await User.findById(req.params.id)
    res.render('cabinet.hbs',{user})
})
app.get('/main/scanner',(req,res)=>{
    res.render('scanner.hbs')
})
// app.get('/main/scanner/:id',async (req,res)=>{
//     let user=await User.findById(req.params.id)
//     res.render('scanner.hbs',{user})
// })
// app.get('/main/scanner/:id',async (req,res)=>{
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//         return res.status(400).send("Неверный формат ID");
//     }
//     let product=await Product.findById(req.params.id)
//     let user = await User.findById(req.params.id);
//     res.render('scanner.hbs', { user,product });
// })
app.get('/main/scanner/:id', async (req, res) => {
    let { pinkod} = req.query;
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send("Неверный формат ID");
    }
    let user = await User.findById(req.params.id);
    if (!user) return res.send("Пользователь не найден");
    let product = null; 
    if (pinkod) {
        product = await Product.findOne({ pinkod });
    }
    res.render('scanner.hbs', {
        user,
        product
    });
});


app.post('/main/scanner', urlenCoded, async (req, res) => {
    try {
        const { pinkod, userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.send("Пользователь не найден");

        if (!pinkod) {
            return res.render('scanner.hbs', {
                user,
                error: 'Введите штрих‑код'
            });
        }
        const product = await Product.findOne({ pinkod });
        if (!product) {
            return res.render('scanner.hbs', {
                user,
                error: 'Продукт не найден'
            });
        }
        return res.render('scanner.hbs', {
            user,
            product
        });
    } catch (err) {
        console.log(err);
        res.send("Ошибка сервера");
    }
});

 
app.post('/admin',urlenCoded,async (req,res)=>{
    try{
        let pinkod=req.body.pinkod
        let tovarName=req.body.tovarName
        let allergic=req.body.allergic
        let diabetic=req.body.diabetic
        let sostav=req.body.sostav
        let ecologic=req.body.ecologic
        let vredNature=req.body.vredNature
        if (!tovarName || !pinkod || !allergic || !diabetic || !sostav || !ecologic || !vredNature) {
            return res.render('admin.hbs', {
                message: 'Все поля должны быть заполнены'
            });
        }
        if (tovarName.length < 2) {
            return res.render('admin.hbs', {
                message: 'Название товара слишком короткое'
            });
        }
        const badSymbols = /[<>]/;
        if (badSymbols.test(tovarName) || badSymbols.test(sostav)) {
            return res.render('admin.hbs', {
                message: 'Недопустимые символы в данных'
            });
        }
        let products=await new Product({pinkod:pinkod,tovarName:tovarName,allergic:allergic,diabetic:diabetic,sostav:sostav,ecologic:ecologic,vredNature:vredNature})
        await products.save()
        console.log("✅ Продукт сохранён:", products);
    }catch(err){
        console.log("❌ Ошибка сохранения:", err);
    }
        return res.redirect('/admin')
}) 

app.post('/reg',urlenCoded,async (req,res)=>{
    let email=req.body.email
    let name=req.body.name
    let pass=req.body.pass
    let repass=req.body.repass
    if (!email || !name || !pass || !repass) {
        return res.render('reg.hbs', { message: 'Все поля должны быть заполнены' });
    }
    if (pass !== repass) {
        return res.render('reg.hbs', { message: 'Пароли не совпадают' });
    }
    let busyEmail = await User.findOne({ email });
    if (busyEmail) {
        return res.render('reg.hbs', { message: 'Email уже используется' });
    }
    let busyUser = await User.findOne({ name });
    if (busyUser) {
        return res.render('reg.hbs', { message: 'Имя уже используется' });
    }
    let user=await new User({email:email,name:name,pass:pass})
    await user.save()
    res.redirect('/login')
    console.log(user)
})

app.post('/login', urlenCoded, async (req, res) => {
    let { email, pass } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if (!user) {
            console.log('Пользователь с таким email не найден');
            return res.render('login.hbs', { message: 'Неверный email' });
        }
        if (user.pass !== pass) {
            console.log('Пароль неверный');
            return res.render('login.hbs', { messagee: 'Неверный пароль' });
        }
        if(user.email==='admin' || user.pass==='admin'){
            return res.redirect('/admin')
        }
        console.log('Успешный вход. ID пользователя:',user.name, user._id);
        return res.redirect(`/main/${user._id}`);
        // return res.render('start.hbs', { id: user._id });
        // return res.render('login.hbs');

    } catch (err) {
        console.log('Ошибка входа:', err);
        return res.render('login.hbs', { message: 'Ошибка сервера' });
    }
    
}); 


 
























async function main(){
    try{
        await mongoose.connect('mongodb://localhost:27017/sazar')    
        // await mongoose.connect('mongodb+srv://mamanasta777_db_user:rzf24zxDNIZaGxYD@cluster0.cfuo0rm.mongodb.net/sazar?retryWrites=true&w=majority');     

        app.listen(5000);
        console.log("the server is on");
    }catch(err){
        return console.log(err +'error')
    }
}
main() 