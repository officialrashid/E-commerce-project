const mongoClient=require('mongodb').MongoClient

const state={

    db:null
}
module.exports.connect=function(done){
    const url='mongodb+srv://rashid:muhdr123@cluster0.zihpmvk.mongodb.net/?retryWrites=true&w=majority';
    const dbname='dbAlldatas';

    mongoClient.connect(url,(err,data)=>{

        if(err) return done(err)
        state.db=data.db(dbname)
    })
    done()

}   

module.exports.get=function(){

    return state.db
}