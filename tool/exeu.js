var exec = require('child_process').exec;
function exec_python(path,args,callback1,callback2){
    let exec_l = 'python ' + path;
    for(var i=0;i<args['inputparams'].length;i++)
    {
        exec_l += '  --'+args['inputparams'][i]['name']+'='+args['inputparams'][i]['value'];
    }
    for(var i=0;i<args['outparams'].length;i++)
    {
        exec_l += '  --'+args['outparams'][i]['name']+'='+args['outparams'][i]['value'];
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
    for(var i=0;i<args['inputparams'].length;i++)
        {
            exec_l += '  '+args['inputparams'][i]['value'];
        }
    for(var i=0;i<args['outparams'].length;i++)
        {
            exec_l += '  '+args['outparams'][i]['value'];
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