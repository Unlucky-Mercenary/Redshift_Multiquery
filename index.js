const pg = require('pg'); // pgパッケージの読み込み
const config=require('./config/config');
const exe=require('./mymodules/execute')
const output=require('./mymodules/csvOut')


const main = async ()=> {
console.log("trying to connect...");
//接続
const client = new pg.Client(config.CONSTRING);
try{
   await  client.connect()
   console.error('Connect!');
} catch(err){
    console.error('接続エラーです');
    console.error(err);
}
//キャッシュオフ
await exe.exeSingleQuery(client,"SET enable_result_cache_for_session = off;");
//クエリフェッチ
const query="SELECT * FROM nation";
const query2="select l_returnflag, l_linestatus,sum(l_quantity) as sum_qty,sum(l_extendedprice) as sum_base_price,sum(l_extendedprice * (1-l_discount)) as sum_disc_price,sum(l_extendedprice * (1-l_discount) * (1+l_tax)) as sum_charge,avg(l_quantity) as avg_qty,avg(l_extendedprice) as avg_price,avg(l_discount) as avg_disc,count(*) as count_order from lineitem where l_shipdate <= dateadd(day, -90, to_date('1998-12-01','YYYY-MM-DD')) group by l_returnflag, l_linestatus order by l_returnflag, l_linestatus;";
let rows;
try{
    results=await exe.exeMultiQuery(client,4,query2)
    //rows=await exe.exeSingleQuery(client,"select n_naionkey from nation");
}catch(err){
    console.error('クエリエラーです');
    console.log(err);
} 

//結果情報取得
//xid=await exe.exeSingleQuery(client,"SELECT MAX(query) as query from stl_query_metrics");
//console.log(xid.rows);
pId=await exe.exeSingleQuery(client,"SELECT pid FROM stl_query order by query desc limit 1");
console.log(pId.rows[0].pid);
data_query="SELECT DATEDIFF(microsecond, stl_query.starttime, stl_query.endtime) AS exetime,total_exec_time,querytxt  FROM stl_query LEFT OUTER JOIN stl_wlm_query ON stl_wlm_query.query=stl_query.query WHERE pid = " + pId.rows[0].pid 
data=await exe.exeSingleQuery(client,data_query);
console.log(data.rows[0])
console.log(data.rows[1])
await client.end()
output.singleCsvOut(data.rows,'result.csv');

}


main();