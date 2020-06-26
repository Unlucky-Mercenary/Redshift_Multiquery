//単一クエリ実行
exports.exeSingleQuery=async function(client,query) {
    const rows = await client.query(
        query
      );
    console.log(query+'実行')
    return rows;
}

//複数のクエリを流す(connection,concurrencyNum=>多重数,query多重するクエリ)
exports.exeMultiQuery=async (client,concurrencyNum,query)=>{
  const ran_arr = Array(concurrencyNum).fill(0).map(() => Math.floor(Math.random() * concurrencyNum + 1))
  return Promise.all(ran_arr.map(async (n, i) => {
      data=await client.query(
          query
        );
        console.log(i+1 + "番目の処理が完了！！" )
        return data;
     
  })) 
}


 //結果出力
 exports.postProcessQuery=async function(connection,sessionId,query) {
  bindedQuery=query.replace(':1',sessionId)
    const rows = await connection.execute(
      bindedQuery
      );
    return rows;
}


 


