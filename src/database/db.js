import mongoose from "mongoose"


const DB_CONNECT = () => {
    try {

        const url = `${process.env.DB_URL}/${process.env.DB_NAME}`
        mongoose.connect(url)
            .then(() => {
                console.log("DATABASE CONNECTED....")
            })
            .catch(() => {
                console.log("DATABASE NOT CONNECTED....")
            })

    } catch (error) {
        console.log("some while connect to database")
    }
}

export default DB_CONNECT