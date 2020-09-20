var XLSX =require('xlsx');
function Excelparse(path){
    var wb = XLSX.readFile(path,{type:'binary'})
    var j_data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
    console.log("程序执行完毕");

    return j_data;
};

module.exports = {
    Excelparse
  };
  