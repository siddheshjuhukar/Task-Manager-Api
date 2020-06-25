const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if(error){
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     name: 'Siddhesh',
    //     age: 24
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Do the laundry',
    //         completed: false
    //     },
    //     {
    //         description: 'Assignments',
    //         completed: true
    //     },
    //     {
    //         description: 'Cook Dinner',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert data')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('tasks').findOne({_id: ObjectID("5ee02a2962e78702a447dd7b")}, (error, task) => {
    //     console.log(task)
    // })
    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     console.log(tasks)
    // })

    // db.collection('tasks').updateMany({ completed: false },
    //     {
    //     $set: {
    //     completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        _id: new ObjectID("5ee02a2962e78702a447dd7a")
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})