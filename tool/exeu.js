var exec = require('child_process').exec;
function exec_python(path,args,callback1,callback2){
    let exec_l = 'python ' + path;

    for(let param in args['inputparams']){
        exec_l += '  --'+param['name']+'='+param['value'];
    }
    for(let param in args['outparams']){
        exec_l += '  --'+param['name']+'='+param['value'];
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
    for(let param in args['inputparams']){
        exec_l += '  '+param['value'];
    }
    for(let param in args['outparams']){
        exec_l += '  '+param['value'];
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