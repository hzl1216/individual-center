var exec = require('child_process').exec;
function exec_python(path,args,callback1,callback2){
    let exec_l = 'nohup python ' + path;
    if(args['inputparams'][0]['name'] != ""){
    for(var i=0;i<args['inputparams'].length;i++)
    {
        exec_l += '  --'+args['inputparams'][i]['name']+'='+args['inputparams'][i]['value'];
    }
    }
    if(args['outparams'][0]['name'] != ""){
    for(var i=0;i<args['outparams'].length;i++)
    {
        exec_l += '  --'+args['outparams'][i]['name']+'='+args['outparams'][i]['value'];
    }
    }
    exec_l+= ' >'+args.log+ ' 2>&1 &'
    console.log(exec_l)
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            callback1(stderr,exec_l,args.log)
        }else{
            callback2(stdout,exec_l,args.log)
        }
    });

}
function exec_R(path,args,callback1,callback2){
    let exec_l = 'nohup Rscript ' + path;
    if(args['inputparams'][0]['name'] != ""){
    for(var i=0;i<args['inputparams'].length;i++)
    {
        exec_l += '  --'+args['inputparams'][i]['name']+'='+args['inputparams'][i]['value'];
    }
    }
    if(args['outparams'][0]['name'] != ""){
    for(var i=0;i<args['outparams'].length;i++)
    {
        exec_l += '  --'+args['outparams'][i]['name']+'='+args['outparams'][i]['value'];
    }
    }
    exec_l+= ' >'+args.log+ ' 2>&1 &'
    console.log(exec_l)
    exec(exec_l,function(error,stdout,stderr){
        if(error) {
            callback1(stderr,exec_l,args.log)
        }else{
            callback2(stdout,exec_l,args.log)
        }
    });

}
module.exports = {
    exec_python,
    exec_R
  };