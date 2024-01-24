# Falta el node_modules que no se puede subir al GitHub por ser demasiado grande

## Terminal commands

$ docker exec -it mymongo bash
$ mongosh
$ use appdb

## MongoDB commands

db.users.find()
db.users.insertOne({name: "Sally", age: 19, address: { street: "987 North St" }, hobbies: ["Running"] })
db.users.insertMany([{ name: "Jill" }, { name: "Mike" }])
db.users.find().sort({ name: 1 }).limit(2)                          //find everything, sort by name, show first two results
db.users.find({ name: "Kyle" })                                     //find name=Kyle, show everything
db.users.find({ name: "Kyle" }, { name: 1, age: 1, _id: 0 })        //find name=Kyle, show name and age
db.users.find({ name: { $ne: "Sally" }  })                          //find all names Not Equal to Sally
db.users.find({ age: { $gt: 13  }  })                               //find all ages Greater Than 13
db.users.find({ name: { $in: ["Kyle", "Sally"] } } )                //find if name in list
db.users.find({ age: { $exists: true } } )                          //find if age exists
db.users.find({ age: { $gte: 20, $lte: 40} })                       //find if age is Greater or Equal to 20 AND Less or Equal to 40
db.users.find({ $or: [ {age: {$lte: 20} }, {name: "Kyle"} ] })      //find if age is Less or Equal to 20 OR name is Kyle
db.users.find({ age: { $not:  {$lte: 20} }  })                      //find if age is NOT Less or Equal to 20
db.users.find({ $expr: { $gt: ["$debt", "$balance"] }})             //find id column debt is Greater Than column balance
db.users.find({ "address.street": "123 Main St" })
db.users.findOne({ age: { $lte: 40 } })
db.users.countDocuments({ age: {$lte: 50 }})
db.users.updateOne({ age: 26}, { $set: { age: 27 } })
db.users.updateOne({ name: "Sally"}, { $inc: { age: 3 } })
db.users.updateOne({ name: "Sally"}. { $push: { hobbies: "Swimming" }})
db.users.updateany({ address: { $exists: true } }, { $unset: { address: "" }} )
