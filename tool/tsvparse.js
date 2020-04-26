const fs = require('fs');
function Tsvparse(path){
    const data = fs.readFileSync(path);
    const objects = ConvertToTable(data);
    console.log("程序执行完毕");

    return objects;
};
function ConvertToTable(data, callBack) {
    data = data.toString();
    var feature = new Array();
    var rows = new Array();
    var objects = new Array();
    rows = data.split("\n");
    for (var i = 0; i < rows.length-1; i++) {
        if(i==0){
            feature = rows[i].split("\t");
        } else {
            object = {};
            value = rows[i].split("\t");
            for (var j =0; j < feature.length; j++) {
                object[feature[j]]=value[j];
            }
            objects.push(object);
        }
    }
    return objects;
}
module.exports = {
    Tsvparse
  };
  