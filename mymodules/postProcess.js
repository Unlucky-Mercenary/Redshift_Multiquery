const Snowflake = require('snowflake-promise').Snowflake;
const config=require('../config/config.js');
const exe=require('./execute.js');
const csv=require('./csvOut');


    //実行
      exports.postProcess = async (fileName,database,sessionId)=> {
        //コネクション確立
        const connection = new Snowflake({
            account: config.ACCOUNTNAME,
            username: config.USERNAME,
            password: config.PASSWORD,
            warehouse:'KAYANO_DATA',
            database:database
            }
            );
        await connection.connect();
        
        //処理実行
        
        const query1='select * from table(information_schema.QUERY_HISTORY_BY_SESSION(session_id=>:1)) where CLUSTER_NUMBER IS NOT NULL ;';
        const query2='select CLUSTER_NUMBER,TOTAL_ELAPSED_TIME,QUEUED_OVERLOAD_TIME,EXECUTION_TIME,COMPILATION_TIME,QUEUED_PROVISIONING_TIME from table(information_schema.QUERY_HISTORY_BY_SESSION (session_id=>:1)) where CLUSTER_NUMBER IS NOT NULL;';
        
        const data = await Promise.all([
            exe.postProcessQuery(connection,sessionId,query1), 
            exe.postProcessQuery(connection,sessionId,query2)
          ]);
        //rows1=await exe.postProcessQuery(connection,sessionId,query1); 
        //rows2=await exe.postProcessQuery(connection,sessionId,query2);

        csv.csvOut(data[0],data[1],fileName);
        //console.log(rows1);
        //console.log(rows);
    }

  