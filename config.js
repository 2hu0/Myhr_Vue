let proxyObj ={};
proxyObj['/ws'] ={
    ws:true,
    target:"ws://localhost:8081"
};
proxyObj['/'] = {
    ws:false,
    target:'http://localhost:8888',
    changeOrigin:true,
    pathRewrite:{
        '^/':''
    }
}
module.exports = {
    devServer:{
        host:'localhost',
        prot:8080,
        proxy:proxyObj
    }
}