const { users } = require("../config/mongoCollections")
const connection = require("../config/mongoConnection")
const ObjectID = require("mongodb").ObjectID
const bcrypt = require("bcrypt")
const saltRounds = 10

const closeDB = async () => {
  const db = await connection()
  await db.serverConfig.close()
}

const validation = (username, password) => {
    if(!username || !password) {
        throw new Error('Both username and password must be supplied.')
    }

    const alphaNumericRegex = /^[a-z0-9]+$/i
    const noWhiteSpacesRegex = /^\S*$/

    if(!alphaNumericRegex.test(username)) {
        throw new Error('Username must consist of no spaces and only alphanumeric characters.')
    }

    if(!noWhiteSpacesRegex.test(password)) {
        throw new Error('Password must not contain any white spaces.')
    }

    if(username.length < 4) {
        throw new Error('Username must be at least 4 characters long.')
    }

    if(password.length < 6) {
        throw new Error('password must be at least 6 characters long.')
    }
}

const createUser = async (username, password) => {
    validation(username, password)

    const lowerCasedUsername = username.toLowerCase()

    bcrypt.hash(password, saltRounds, async (err, hash) => {

        if(err) {
            throw new Error('Error creating hash.')
        }

        const newUser = {
            username: lowerCasedUsername,
            password: hash
        }

        const usersCollection = await users()
        const insertInfo = await usersCollection.insertOne(newUser)

        if(insertInfo.insertedCount === 0) {
            throw new Error('Unable to add new user.')
        }

    })

    return { userInserted: true }
}

const checkUser = async (username, password) => {
    validation(username, password)

    const lowerCasedUsername = username.toLowerCase()

    const usersCollection = await users()
    const user = await usersCollection.findOne({username: lowerCasedUsername})

    hash = user.password

    const passwordMatches = await bcrypt.compare(password, hash)

    if(!passwordMatches) {
        throw new Error('Either the username or password is invalid')
    }

    return { authenticated: true }
}

const main = async () => {
    // await createUser("cszablewskipaz", "password")
    // console.log(await checkUser("cszablewskipaz", "password"))
}

// main()

module.exports = {
    createUser,
    checkUser
}
