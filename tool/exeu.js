var exec = require('child_process').exec;
function exec_python(path,args){
    let exec_l = 'python ' + path;
    args.forEach(key => {
        exec_l += '  --'+key+'='+args[key]
        
    });
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            console.info(stderr);
        }else{
            console.log(stdout);
        }
    });

}
function exec_R(path,args){
    let exec_l = 'Rscript ' + path;
    args.forEach(key => {
        exec_l += '  --'+key+'='+args[key]
        
    });
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            console.info(stderr);
        }else{
            console.log(stdout);
        }
    });

}
module.exports = {
    exec_python,
    exec_R
  };