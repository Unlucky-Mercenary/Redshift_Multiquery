const csv = require('csv');
const fs = require('fs');

exports.csvOut=async function(data1,data2,filename){
    
    const stringifier1 = csv.stringify(data1,{header: true},(err,output)=>{
        fs.writeFileSync('./output/'+filename, output);
    });
    const stringifier2 = csv.stringify(data2,{header: true},(err,output)=>{
        fs.appendFileSync('./output/'+filename, output);
    });

}

exports.singleCsvOut=async function(data1,filename){
    
    const stringifier1 = csv.stringify(data1,{header: true},(err,output)=>{
        fs.writeFileSync('./output/'+filename, output);
    });
    

}