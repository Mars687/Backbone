   

## 为 tita中屏蔽首字母是否大写的问题 修改了一下方法

function getOwn(obj, prop) {
    var fistChart = prop.charAt(0);
    var newProp = fistChart.toUpperCase() + prop.substr(1,prop.length);
    if(!hasProp(obj, prop)&&!hasProp(obj, newProp)){
        return false;
    }else{
        if(hasProp(obj, prop)){
            return obj[prop];
        }else{
           return obj[newProp];
        }             
    }
}