var exec = require('child_process').exec;
function exec_python(path,args,callback1,callback2){
    let exec_l = 'python ' + path;

    for(let key in args){
        exec_l += '  --'+key+'='+args[key]
    }
    console.log(exec_l)
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            callback1(stderr)
        }else{
            callback2(stdout);
        }
    });

}
function exec_R(path,args,callback1,callback2){
    let exec_l = 'Rscript ' + path;
    for(let key in args){
        exec_l += '  --'+key+'='+args[key]
    }
    console.log(exec_l)
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            callback1(stderr)
        }else{
            callback2(stdout);
        }
    });

}
module.exports = {
    exec_python,
    exec_R
  };