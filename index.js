const pg = require('pg'); // pgパッケージの読み込み
const config=require('./config/config');
const exe=require('./mymodules/execute')


const main = async ()=> {
console.log("trying to connect...");
const client = new pg.Client(config.CONSTRING);
try{
   await  client.connect()
   console.error('Connect!');
} catch(err){
    console.error('接続エラーです');
    console.error(err);
}

let rows;
try{
    data=await exe.exeMultiQuery(client,2,"SELECT n_naionkey,n_name FROM nation limit 2")
    //rows=await exe.exeSingleQuery(client,"select n_naionkey from nation");
}catch(err){
    console.error('クエリエラーです');
    console.log(err);
} 


await client.end()

}


main();