const cors = require('cors')
require('dotenv').config()
const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express();
const { MongoClient, ObjectId, LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb')
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.stripe);
const port = process.env.PORT||3001; // Choose your desired port

const dbName = 'Ticketbook'

const saltRounds = 10

const client = new MongoClient(process.env.db_url);
console.log("done")

app.use(bodyParser.json());
app.use(cors())

// Endpoint to receive the payment intent from client

app.post('/api/checkout/submit', async (req, res) => {
    let { amount, payment_method_id, email, username, title, author,img } = req.body;
    const customer = await stripe.customers.create({
        email,
        name: username
    })

    try {
        // Create a PaymentIntent with the amount and currency
        await client.connect()
        const db = client.db(dbName)
        let authors = []
        let titles = []
        let images=[]
        if (!title || !author) {
            const collection = db.collection(username)
            const data = await collection.find({}).toArray()
            // console.log(data)
            let count = 0
            data.forEach(item => {
                titles[count] = item.title
                authors[count] = item.author
                images[count]=item.img
                count++
            })
            console.log(titles)
            console.log(authors)
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr',
            payment_method: payment_method_id,
            confirmation_method: 'manual',
            confirm: true,
            return_url: 'http://localhost:3000',
            customer: customer.id,
            metadata: {
                email: email,
                name: username,
                title: titles.join(', ')||title,
                author: authors.join(', ')||author,
                img:images.join(', ')||img
            }
        });

        const paymentData = {
            book_name: paymentIntent.metadata.title,
            author: paymentIntent.metadata.author,
            img:paymentIntent.metadata.img,
            id: paymentIntent.id,
            payment_method_id: paymentIntent.payment_method,
            payment_method: paymentIntent.payment_method_types[0],
            status: paymentIntent.status,
            currency: paymentIntent.currency,
            amount: paymentIntent.amount / 100,
            customer_id: paymentIntent.customer,
            customer_name: paymentIntent.metadata.name,
            customer_email: paymentIntent.metadata.email,
            createdDate: Date.now(),
        }

        collection = db.collection('Payment_Data')
        await collection.insertOne(paymentData)

        console.log("data", paymentData)

        // Send the PaymentIntent client secret to the client
        // console.log(paymentIntent)
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
    finally {
        await client.close()
    }
});

app.get('/getmovies', async function (req, res) {
    try {
        const { title, author } = req.body
        await client.connect();
        const db = client.db(dbName)
        const collection = db.collection('movies');
        const data = await collection.find().toArray()
        res.status(200).send(data)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
    finally {
        await client.close()
    }
})

app.post('/addmovies', async function (req, res) {
    try {
        const { title, time, description, price, cast, url1, url2, genre,language,director } = req.body
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('movies')
        await collection.insertOne({ title: title, time: time, price: price, dirctor: director, description: description, url1: url1, url2: url2, genre: genre,language:language,cast:cast})
        res.status(200).send('movies added successfully')
    }
    catch {
        res.status(400).send('Internal Server Error')
    }
    finally {
        await client.close()
    }
})

app.get('/moviedata', async function (req, res) {
    try {
        const id = req.query
        const obj_id = new ObjectId(id)
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('movies')
        let data = await collection.findOne({ _id: obj_id })
        res.status(200).send(data)
    }
    catch {
        res.status(400).send('Internal server error')
    }
    finally {
        await client.close()
    }
})


app.post('/login', async function (req, res) {
    const { username, password } = req.body
    try {
        if (username != "" && password != "" && username != undefined && password != undefined) {
            await client.connect()
            const db = client.db(dbName)
            const collection = db.collection('userdata')
            const data = await collection.findOne({ username: username })
            if (!data) {
                return res.status(404).send('Username Does Not Match')
            }
            bcrypt.compare(password, data.password, async function (err, result) {
                if (err) {
                    return res.status(404).send(err.message)
                }
                if (result) {
                    let token = jwt.sign(username, process.env.jwt_secret_key)
                    await client.connect()
                    const db = client.db(dbName)
                    const collection = db.collection('auth-token')
                    await collection.insertOne({ email: data.email, username: username, token: token })
                    await client.close()
                    res.status(200).json({ email: data.email, username: data.username, token });
                }
                else if (!result) {
                    res.status(404).send('Password does not match')
                }
            })
        }
        else {
            return res.status(404).send('Fields Cannot be empty')
        }
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
    finally {
        await client.close();
    }
})

app.post('/signup', async function (req, res) {
    try {
        const { email, username, password } = req.body
        if (email !== "" && username !== "" && password != "") {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (err) {
                    return res.status(400).send(err.message)
                }
                if (hash) {
                    await client.connect()
                    const db = client.db(dbName)
                    const collection = db.collection('userdata')
                    const data = await collection.findOne({ username: username })
                    if (data) {
                        return res.status(200).send('User Already Exists')
                    }
                    else {
                        await collection.insertOne({ email: email, username: username, password: hash })
                        res.status(200).send('Data Saved Successfully')
                    }
                }
            })
        }
        else {
            return res.status(404).send('Fields Cannot be empty')
        }
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
    finally {
        await client.close();
    }
})


app.post('/checkauth', async function (req, res) {
    try {
        const token = req.body.token
        if (token != "" && token != undefined) {
            await client.connect()
            const db = client.db(dbName)
            const collection = db.collection('auth-token')
            let data = await collection.findOne({ token: token })
            if (data) {
                jwt.verify(token, 'cat', async function (err, decoded) {
                    if (decoded) {
                        return res.status(200).send(data.username)
                    }
                    if (err) {
                        return res.status(404).send(err.message)
                    }
                })
            }
            else {
                return res.status(404).send('Data Not Found')
            }
        }
    }
    catch (err) {
        return res.status(400).send('Internal Server Error')
    }
    finally {
        await client.close()
    }
})

app.post('/search', async function (req, res) {
    try {
        // console.log('function called')
        let search = req.body.search
        // console.log(search)
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('movies')
        let data = await collection.findOne({ title: { $regex: search, $options: 'i' } })
        if (data) {
            res.status(200).send(data)
        }
        else {
            res.status(404).send('No movie Found')
        }
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
    finally {
        await client.close()
    }
})


app.post('/moviedate', async function (req, res) {
    try {
        let date = req.body.pincode
        // console.log(pincode);
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection('moviedate')
        let data = await collection.findOne({ date: date })
        if (data) {
            res.status(200).send(data)
        }
        else {
            res.status(201).send("No Tickets available")
        }
    }
    catch (err) {
        return res.status(400).send(err.message)
    }
    finally {
        await client.close()
    }
})


app.post("/addtocart/save", async function (req, res) {
    let { user, data } = req.body
    console.log(user)
    console.log(data)
    if (data && user) {
        try {
            await client.connect()
            const db = client.db(dbName)
            const collection = db.collection(user)
            let result = await collection.findOne({ movieid: data._id })
            if (result) {
                await collection.updateOne({ movieid: data._id }, { $set: { "quantity": result.quantity + 1 } })
                return res.status(200).send(`Quantity Increased to ${result.quantity + 1}`)
            }
            else {
                await collection.insertOne({ username: user, movieid: data._id, author: data.author, title: data.title, price: data.price, img: data.url1, "quantity": 1 })
            }
            res.status(200).send('Item Added Successfully')
        }
        catch (err) {
            console.log(err)
            return res.status(400).send(err)
        }
        finally {
            // await client.close()
        }
    }
})

app.post('/addtocart', async function (req, res) {
    try {
        const { user } = req.body
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(user)
        let data = await collection.find({ username: user }).toArray()
        res.status(200).send(data)
    }
    catch (err) {
        return res.status(400).send(err)
    }
    finally {
        await client.close()
    }
})


app.post('/updatequantity', async function (req, res) {
    try {
        const { count, id, user } = req.body
        // console.log('called')
        const objid = ObjectId.createFromHexString(id)
        // console.log(objid)
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(user)
        await collection.updateOne({ _id: objid }, { $set: { "quantity": count } })
        res.status(200).send('Quantity Updated Successfully')
    }
    catch (err) {
        return res.status(400).send(err)
    }
    finally {
        await client.close()
    }
})

app.post('/removecart', async function (req, res) {
    try {
        const { id, user } = req.body
        const objid = ObjectId.createFromHexString(id)
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(user)
        await collection.findOneAndDelete({ _id: objid })
        return res.status(200).send('Item Removed Successfully')
    }
    catch (err) {
        return res.status(400).send(err)
    }
    finally {
        // await client.close()
    }
})


app.post('/bill', async function (req, res) {
    try {
        const { user } = req.body
        // console.log(user)
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(user)
        let data = await collection.find({}).toArray()
        res.status(200).send(data)
        // console.log(data)
    }
    catch(err) {
        res.status(400).send(err)
    }
    finally {
        await client.close();
    }
})



app.post('/recentorder',async function(req,res){
    try{
        await client.connect()
        const db=client.db(dbName)
        const collection=db.collection('Payment_Data')
        let data=await collection.find({}).sort({$natural:-1}).limit(1).toArray()
        data.forEach(item=>{
            console.log(item.movie_name)
            images=item.img.split(',')
        })
        // console.log(images)

        res.status(200).send(data)
    }
    catch(err){
        res.status(400).send(err)
    }
    finally{
        await client.close()
    }
})


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
