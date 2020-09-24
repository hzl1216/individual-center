var exec = require('child_process').exec;
function exec_python(path,args){
    let exec_l = 'python ' + path;

    for(let key in args){
        exec_l += '  --'+key+'='+args[key]
    }
    console.log(exec_l)
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
    for(let key in args){
        exec_l += '  --'+key+'='+args[key]
    }
    console.log(exec_l)
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            console.info(stderr);
        }else{
            console.log(stdout);
        }
    });

}
exec_python('1.py',{
    type: 'R'
})
module.exports = {
    exec_python,
    exec_R
  };