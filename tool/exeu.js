var exec = require('child_process').exec;
function exec_python(path,args,callback1,callback2){
    let exec_l = 'python ' + path;

    for(let key in args['inputparams']){
        exec_l += '  --'+key+'='+args['inputparams'][key]
    }
    for(let key in args['outparams']){
        exec_l += '  --'+key+'='+args['outparams'][key]
    }
    console.log(exec_l)
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            callback1(stderr,exec_l)
        }else{
            callback2(stdout,exec_l);
        }
    });

}
function exec_R(path,args,callback1,callback2){
    let exec_l = 'Rscript ' + path;
    for(let key in args['inputparams']){
        exec_l += ' '+ args['inputparams'][key]
    }
    for(let key in args['outparams']){
        exec_l += ' '+ args['outparams'][key]
    }
    console.log(exec_l)
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            callback1(stderr,exec_l)
        }else{
            callback2(stdout,exec_l);
        }
    });

}
module.exports = {
    exec_python,
    exec_R
  };