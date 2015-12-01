/*
 *@高京
 *@20150909
 *@每个项目自带方法，添加方法的话：1.请先确认没有功能类同的方法可以使用（避免同一功能多个类同方法存在）；2.要尽量考虑可移植性和复用性，不要为了实现某一单一功能而增加本文件代码量；
                                   3.将调用方法写在顶部注释中；4.有新方法添加时，在群里吼一声
 */

/*
    高京
        *获得地址栏参数集，返回JSON对象
        getQueryParas() 

        *自动获得地址栏参数集，并拼接返回为地址栏字符串：a=1&b=2&c=3
        *Para：过滤掉的参数名（键），多个用|分隔，区分大小写
        transParameters(Para)

        *在页面中引用其他js文件
        *path：引用文件路径
        includeJS(path)

        *在页面中引用其他CSS文件
        *path：引用文件路径
        includeCSS(path)

        *判断是否为PC端访问，返回true/false
        isPc()
*/

/*
 *@高京
 *@20150909
 *判断是否为PC端访问，返回true/false
 */
function isPc() {
    var system = {
        win: false,
        mac: false,
        xll: false
    };

    //检测平台
    var p = navigator.platform;
    //alert(p);
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

    if (system.win || system.mac || system.xll) {
        return true;
    } else {
        return false;
    }
}

$(function() {
    /*
     *@高京
     *@20150909
     *li_click的点击事件转向方法
     */
    $(".li_click").click(function() {
        li_click($(this));
    });

    $(".ct").click(function() {
        alert("后续推出，敬请期待！");
        return false;
    });
});

/*
 *@高京
 *@20150909
 *li_click的点击事件转向方法
 */
function li_click(obj) {
    $("#link_new_window").remove();
    $("body").append("<a id=\"link_new_window\" href=\"" + $(obj).attr("url") + "\" target=\"" + $(obj).attr("target") + "\" style=\"cursor:pointer\"><span></span></a>");
    //safari
    try {
        var e = document.createEvent('MouseEvent');
        e.initEvent('click', false, false);
        var sub = document.getElementById("link_new_window");
        sub.dispatchEvent(e);
    }
    //!safari
    catch (e) {
        $("#link_new_window span").click();
    }
}

/*
 *@高京
 *@20150909
 *地址栏转向方法
 */
function linkToUrl(url, target) {
    $("#link_new_window").attr("href", url);
    $("#link_new_window").attr("target", target);
    $("#link_new_window span").click();
}


/*
 *@高京
 *@20151006
 *在页面中引用其他js文件
 */
function includeJS(path) {
    var a = document.createElement("script");
    a.type = "text/javascript";
    a.src = path;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(a);
}


/*
 *@高京
 *@20151010
 *在页面中引用css文件
 */
function includeCSS(path) {
    var a = document.createElement("link");
    a.type = "text/css";
    a.rel = "stylesheet";
    a.href = path;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(a);
}


/*
 *@高京
 *@20151023
 *获得地址栏参数集，返回JSON对象
 */
function getQueryParas() {
    var Json_obj;

    var str = getQueryParas_str(1, "");
    Json_obj = JSON.parse(str);

    return Json_obj;
}

/*
 *@高京
 *@20151023
 *自动获得地址栏参数集，并拼接为地址栏字符串：a=1&b=2&c=3
 *Para：过滤掉的参数名（键），多个用|分隔，区分大小写
 */
function transParameters(Para) {
    return getQueryParas_str(2, Para);
}


/*
 *@高京
 *@20151023
 *获得地址栏参数集，返回JSON字符串
 *Kind：拼接种类。1-JSON字符串；2-地址栏字符串
 *Para：过滤掉的参数名（键），多个用|分隔
 */
function getQueryParas_str(Kind, Para) {
    var url = location.href;
    var s = url.indexOf("?");
    var str = "";

    //将|分隔的Para替换为<><><>格式
    try {
        Para = "<" + Para.replace(/\|/g, "><") + ">";
    } catch (e) {
        console.log("e:" + e);
    }


    if (s > -1) {
        url = url.substring(s + 1);
        var e = url.indexOf("=");
        var key;
        var value;
        while (e > -1) {
            key = url.substring(0, e).replace("&", "");

            //判断获得的键名是否过滤
            if (Para.indexOf("<" + key + ">") > -1) {
                e = url.indexOf("&");
                if(e==-1)
                    break;
                url = url.substring(e + 1);
                e = url.indexOf("=");
                continue;
            }

            url = url.substring(e + 1);
            e = url.indexOf("&");
            if (e == -1)
                value = url.substring(0);
            else
                value = url.substring(0, e);
            url = url.substring(e + 1);
            e = url.indexOf("=");
            if (str != "") {
                if (Kind == 1)
                    str += ",";
                else
                    str += "&";
            }

            if (Kind == 1)
                str += "\"" + key + "\":\"" + value + "\"";
            else
                str += key.replace("&", "") + "=" + value;
        }
    }

    if (Kind == 1) {
        str = "{" + str + "}";
    }

    return str;
}
