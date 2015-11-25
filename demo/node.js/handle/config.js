/*
 *@ 高京
 *@ 20150824 
 *@ 全局配置文件，添加属性的话，请先确认没有功能类同的属性存在
 */
var express = require("express");
var multer = require("multer");
var func = require("./functions.js");
var uuid = require('node-uuid');
var config = require('./config.js');
var fs = require('fs'); //文件操作模块，updateMember用


exports.session_secret = "9d6v5e428g7t6q2a"; //session密钥
// exports.host = "192.168.1.58"; //接口调用主机地址
// exports.port = 8120; //端口号
exports.host = "trqadmin.x3b.net.cn"; //接口调用主机地址
exports.port = 80; //端口号
exports.cookieName_Member = "TouRongQuan2015_Member"; //登录用的cookie名称
exports.Conference_Cstatus = ["", "进展中", "已结束"]; //活动会议状态
exports.cookies_key = [2, 5, 6, 8, 9, 10, 11, 15, 16, 17, 18, 19, 20, 22, 25, 29]; //从cookies中取出密码的16位秘钥数组(内部值不能大于32,且从小到大排序)
exports.cookies_str = "9d6V5e428M7t6q2a9d6v5e428g7t6q2a"; //定义在cookies中为密码加密的32位随机变量
exports.ImageDomain = "http://static.x3b.net.cn/"; //数据库中读取的图片的域名前缀

/*
 *@ 高京
 *@ 20151109
 *@ Advertise，异步更新方法：config.updateAdvertise(callback_success)
 */
exports.Advertise = null; //(Advertise)


/*
 *@ 高京
 *@ 20151106
 *@ 发送邮件服务器信息 [QQ邮箱账号,密码]，异步更新方法：config.updateMailServer(callback_success)
 */
exports.mail_server = null; //(Init)

/*
 *@ 高京
 *@ 20151106
 *@ 信息反馈接收邮箱，异步更新方法：config.updateMailReceive(callback_success)
 */
exports.mail_receive = null; //(Init)


/*
 *@ 陈斌
 *@ 20151104
 *@ 主页行业缓存，异步更新方法：config.updateTrade(callback_success)
 */
exports.Trade = null; //行业
/*
 *@ 陈斌
 *@ 20151104
 *@ 主页职业缓存，异步更新方法：config.updateProfession(callback_success)
 */
exports.Profession = null; //职业

/*
 *@ 马龙军
 *@ 20151107
 *@ 所属类型查询，异步更新方法：config.updateItems_Sort(callback_success)
 */
exports.Items_Sort = null;
/*
 *@ 马龙军
 *@ 20151107
 *@ 辅导机构查询，异步更新方法：config.updateGuidance(callback_success)
 */
exports.Guidance = null;
/*
 *@ 马龙军
 *@ 20151107
 *@ 转让方式查询，异步更新方法：config.updateTransfer_Way(callback_success)
 */
exports.Transfer_Way = null;
/*
 *@ 马龙军
 *@ 20151107
 *@ 省份查询，异步更新方法：config.updateProvince(callback_success)
 */
exports.Province = null;
/*
 *@ 马龙军
 *@ 20151107
 *@ 项目介绍板块表查询，异步更新方法：config.updateItems_Sections(callback_success)
 */
exports.Items_Sections = null;

/*
 *@ 高京
 *@ 20151104
 *@ 二级页右侧最新资讯缓存，异步更新方法：config.updateSecondNews(callback_success)
 */
exports.SecondNews = null; //(Article)

/*
 *@ 高京
 *@ 20151029
 *@ seo缓存，异步更新方法：config.updateSEO(callback_success)
 */
exports.seo = {
    ieTitle: null, //标题 - 副标题(Init)
    seoKeywords: null, //关键字(Init)
    seoDescription: null //描述(Init)
};

/*
 *@ 陈斌
 *@ 20151029
 *@ footer缓存，异步更新方法：config.updateFooter(callback_success)
 */
exports.footer = {
    WebName: null,//	网站名称
    CodeTime: null,// 找回密码识别码有效时间
    email: null,// 信息反馈邮箱地址(1)
    investment: null, //底部合作投资机构(Article)
    media: null, //合作媒体(Article)
    organization: null, //合作机构(Article)
    links: null, //友情链接(Article)
    AboutUs: null, //关于我们(Article)
    HelpCenter: null, //帮助中心(Article)
    tel: null, //客服热线(Init)
    qq: null, //客服QQ(Init)
    copyright: null, //版权(Info)
    Rcode: null //二维码(Advertise)
};




/*
 *@ 高京
 *@ 20151029
 *@ 【同步】获得seo绑定，返回数组{ieTitle,seoKeywords,seoDescription}
 *@ ieTitle_ex：不为空时，返回ieTitle_ex - config.seo.ieTitle；否则返回config.seo.ieTitle
 *@ seoKeywords：不为空时返回seoKeywords；否则返回config.seo.seoKeywords
 *@ seoDescription：不为空时返回seoDescription；否则返回config.seo.seoDescription
 */
exports.getSEO = function(ieTitle_ex, seoKeywords, seoDescription) {

    var arr = [config.seo.ieTitle, config.seo.seoKeywords, config.seo.seoDescription];

    if (ieTitle_ex != undefined && ieTitle_ex != "")
        arr[0] = ieTitle_ex + " - " + config.seo.ieTitle;
    if (seoKeywords != undefined && seoKeywords != "")
        arr[1] = seoKeywords;
    if (seoDescription != undefined && seoDescription != "")
        arr[2] = seoDescription;

    return arr;
}



/*
 *@ 高京
 *@ 20151104
 *@ 【异步】更新二级页右侧最新资讯缓存
 */
exports.updateSecondNews = function(req, res, next) {

    var n = 0;

    var updating = function() {
        if (++n < 1)
            return;
        next();
    };

    var updateSecondeNews_Init = function() {
        
        if (config.SecondeNews != null) {
            updating();
            return;
        }

        var Json_Params = func.JsonUnicode({
            "s_Aid": "",
            "s_Alive": "1",
            "s_d1": "",
            "s_d2": "",
            "s_Keywords": "",
            "s_Kind": "1",
            "s_Order": ""
        });

        var Json_Pages = func.JsonUnicode({
            "p_c": "",
            "p_First": "",
            "p_inputHeight": "",
            "p_Last": "",
            "p_method": "",
            "p_Next": "",
            "p_Page": "",
            "p_pageName": "",
            "p_PageStyle": "",
            "p_Pname": "",
            "p_Previous": "",
            "p_Ps": "15",
            "p_sk": "",
            "p_Tp": ""
        });
        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {

            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ",\"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";

            var ajax_para = JSON.parse(ajax_para_str);

            func.DoREST(config.host, config.port, "/Handler/Article.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                if (data.error.toLowerCase() == "success") {
                    config.SecondNews = data.list;
                } else {
                    console.log("\n updateSecondeNews_Init:" + JSON.stringify(data));
                }
                updating();
            }, function(e) {
                console.log("\n updateSecondeNews_Init_e:");
                console.log(e);
                updating();
            });
        });
    };

    updateSecondeNews_Init();
};


/*
 *@ 高京
 *@ 20151029
 *@ 【异步】更新SEO缓存
 */
exports.updateSEO = function(callback_success) {

    var n = 0;
    var updating = function() {
        if (++n < 1)
            return;
        callback_success();
    };

    var updateSEO_Init = function() {

        if (config.seo.ieTitle != null) {
            updating();
            return;
        }

        var Json_Params = func.JsonUnicode({
            "s_not_Iid": ""
        });
        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        ParamsJsonObj_str = ParamsJsonObj_str.replace("}{", ",");
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {

            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + " , \"sign_valid\": " + sign_valid + " }";

            var ajax_para = JSON.parse(ajax_para_str);

            // 调用接口
            func.DoREST(config.host, config.port, "/Handler/Init.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                if (data.error == "SUCCESS" || data.error == "success") {
                    config.seo.ieTitle = data.list[0].Iinfo + " - " + data.list[2].Iinfo;
                    config.seo.seoKeywords = data.list[3].Iinfo;
                    config.seo.seoDescription = data.list[4].Iinfo;
                } else {
                    console.log("\n updateSEO_Init:" + JSON.stringify(data));
                }
                updating();
            }, function(e) {
                console.log("\n updateSEO_Init:" + e);
                updating();
            });
        });
    };

    updateSEO_Init();
};


/*
 *@ 陈斌
 *@ 20151029
 *@ 【异步】更新footer缓存
 */
exports.updateFooter = function(callback_success) {
    var n = 0;
    var _i;

    var updating = function() {
        if (++n < 9)
            return;
        callback_success();
    };

    var updateFooter_Article = function(kind) {
        switch (kind) {
            case 2:
                if (config.footer.investment != null) {
                    updating();
                    return;
                }
                break;
            case 3:
                if (config.footer.meida != null) {
                    updating();
                    return;
                }
                break;
            case 4:
                if (config.footer.organization != null) {
                    updating();
                    return;
                }
                break;
            case 5:
                if (config.footer.links != null) {
                    updating();
                    return;
                }
                break;
            case 6:
                if (config.footer.AboutUs != null) {
                    updating();
                    return;
                }
                break;
            case 7:
                if (config.footer.HelpCenter != null) {
                    updating();
                    return;
                }
                break;
        }
        var Json_Params = func.JsonUnicode({
            "s_Aid": "",
            "s_Alive": "1",
            "s_d1": "",
            "s_d2": "",
            "s_Keywords": "",
            "s_Kind": kind.toString(),
            "s_Order": ""
        });
        var Json_Pages = func.JsonUnicode({
            "p_c": "",
            "p_First": "",
            "p_inputHeight": "",
            "p_Last": "",
            "p_method": "",
            "p_Next": "",
            "p_Page": "1",
            "p_pageName": "",
            "p_PageStyle": "",
            "p_Pname": "",
            "p_Previous": "",
            "p_Ps": "9",
            "p_sk": "",
            "p_Tp": ""
        });

        switch (kind) {
            case 5:
                Json_Pages.p_Ps = "18";
                break;
            case 6:
                Json_Pages.p_Ps = "5";
                break;
            case 7:
                Json_Pages.p_Ps = "5";
                break;
        }
        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";

            var ajax_para = JSON.parse(ajax_para_str);
            //调用接口
            func.DoREST(config.host, config.port, "/Handler/Article.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                if (data.error == "SUCCESS" || data.error == "success") {
                    switch (kind) {
                        case 2:
                            config.footer.investment = data.list;
                            break;
                        case 3:
                            config.footer.media = data.list;
                            break;
                        case 4:
                            config.footer.organization = data.list;
                            break;
                        case 5:
                            config.footer.links = data.list;
                            break;
                        case 6:
                            config.footer.AboutUs = data.list;
                            break;
                        case 7:
                            config.footer.HelpCenter = data.list;
                            break;
                    }
                } else {
                    console.log("\n updateFooter_Article(" + kind + "):" + JSON.stringify(data));
                }
                updating();
            }, function(e) {
                console.log("\n updateFooter_Article:" + e);
                updating();
            });

        });
    };

    var updateFooter_Info = function() {

        if (config.footer.copyright != null) {
            updating();
            return;
        }
        var Json_Params = func.JsonUnicode({
            "s_Iid": "1"
        });
        var Json_Pages = func.JsonUnicode({
            "p_c": "",
            "p_First": "",
            "p_inputHeight": "",
            "p_Last": "",
            "p_method": "",
            "p_Next": "",
            "p_Page": "",
            "p_pageName": "",
            "p_PageStyle": "",
            "p_Pname": "",
            "p_Previous": "",
            "p_Ps": "",
            "p_sk": "",
            "p_Tp": ""
        });
        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";

            var ajax_para = JSON.parse(ajax_para_str);

            //调用接口
            func.DoREST(config.host, config.port, "/Handler/Info.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                if (data.error == "SUCCESS" || data.error == "success") {
                    config.footer.copyright = data.list[0].Iinfo;
                } else {
                    console.log("\n updateFooter_Info:" + JSON.stringify(data));
                }
                updating();
            }, function(e) {
                console.log("\n updateFooter_Info:" + e);
                updating();
            });
        });
    };

    var updateFooter_Init = function() {

        if (config.footer.tel != null) {
            updating();
            return;
        }
        var Json_Params = func.JsonUnicode({
            "s_not_Iid": "2,3,4,5,6,100,101,102,103"
        });
        var Json_Pages = func.JsonUnicode({
            "p_c": "",
            "p_First": "",
            "p_inputHeight": "",
            "p_Last": "",
            "p_method": "",
            "p_Next": "",
            "p_Page": "",
            "p_pageName": "",
            "p_PageStyle": "",
            "p_Pname": "",
            "p_Previous": "",
            "p_Ps": "",
            "p_sk": "",
            "p_Tp": ""
        });
        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";
            var ajax_para = JSON.parse(ajax_para_str);

            //调用接口
            func.DoREST(config.host, config.port, "/Handler/Init.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                if (data.error == "SUCCESS" || data.error == "success") {
                    config.footer.WebName = data.list[0].Iinfo;
                    config.footer.tel = data.list[1].Iinfo;
                    config.footer.qq = data.list[2].Iinfo;
                    config.footer.email = data.list[3].Iinfo;
                    config.footer.CodeTime = data.list[4].Iinfo;
                } else {
                    console.log("\n updateFooter_Init:" + JSON.stringify(data));
                }
                updating();
            }, function(e) {
                console.log("\n updateFooter_Init:" + e);
                updating();
            });
        });
    };

    var updateFooter_Advertise = function() {

        if (config.footer.Rcode != null) {
            updating();
            return;
        }

        config.updateAdvertise(function() {
            config.footer.Rcode = config.Advertise[0].Pic1;
            updating();
        });
    };


    for (_i = 2; _i <= 7; _i++)
        updateFooter_Article(_i);
    updateFooter_Info();
    updateFooter_Init();
    updateFooter_Advertise();
};

/*
 *@ 陈斌
 *@ 20151102
 *@ 【异步】更新行业缓存
 */
exports.updateTrade = function(login_member, req, res, callback) {

    var n = 0;

    var updating = function() {
        if (++n < 1)
            return;
        callback(login_member);
    };

    /*
     *陈斌
     *20151030
     *1.注册页行业关注 2.添加发布项目及修改项目
     */
    var update_Trade = function() {
        if (config.Trade == null) {
            var Json_Params = func.JsonUnicode({
                "s_Alive": "1",
                "s_IsContain_Business": "",
                "s_IsContain_Investor": "",
                "s_IsContain_Items": "",
                "s_Keywords": "",
                "s_Order": "",
                "s_Tid": ""
            });
            var Json_Pages = func.JsonUnicode({
                "p_c": "",
                "p_First": "",
                "p_inputHeight": "",
                "p_Last": "",
                "p_method": "",
                "p_Next": "",
                "p_Page": "",
                "p_pageName": "",
                "p_PageStyle": "",
                "p_Pname": "",
                "p_Previous": "",
                "p_Ps": "",
                "p_sk": "",
                "p_Tp": ""
            });
            var ParamsJsonObj_str = JSON.stringify(Json_Params);
            var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
            //生成签名
            func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
                var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";
                var ajax_para = JSON.parse(ajax_para_str);

                //调用接口
                func.DoREST(config.host, config.port, "/Handler/Trade.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                    if (data.error == "SUCCESS" || data.error == "success") {
                        config.Trade = data.list;

                    } else {
                        console.log("\n get_Trade:" + JSON.stringify(data));
                    }
                    updating();
                }, function(e) {
                    console.log("\n get_Trade:" + e);
                    updating();
                });

            });
        } else {
            updating();
        }
    };
    update_Trade();
};

/*
 *@ 陈斌
 *@ 20151102
 *@ 【异步】更新职业缓存
 */
exports.updateProfession = function(login_member, req, res, callback) {

    var n = 0;

    var updating = function() {
        if (++n < 1)
            return;
        callback(login_member);
    };

    /*
     *陈斌
     *20151030
     *1.注册页行业关注
     */
    var update_Profession = function() {
        if (config.Profession == null) {
            var Json_Params = func.JsonUnicode({
                "s_Alive": "1",
                "s_Keywords": "",
                "s_Order": "",
                "s_Pid": ""
            });
            var Json_Pages = func.JsonUnicode({
                "p_c": "",
                "p_First": "",
                "p_inputHeight": "",
                "p_Last": "",
                "p_method": "",
                "p_Next": "",
                "p_Page": "",
                "p_pageName": "",
                "p_PageStyle": "",
                "p_Pname": "",
                "p_Previous": "",
                "p_Ps": "",
                "p_sk": "",
                "p_Tp": ""
            });
            var ParamsJsonObj_str = JSON.stringify(Json_Params);
            var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
            //生成签名
            func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
                var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";

                var ajax_para = JSON.parse(ajax_para_str);
                //调用接口
                func.DoREST(config.host, config.port, "/Handler/Profession.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                    if (data.error == "SUCCESS" || data.error == "success") {
                        config.Profession = data.list;

                    } else {
                        console.log("\n get_Trade:" + JSON.stringify(data));
                    }
                    updating();
                }, function(e) {
                    console.log("\n get_Trade:" + e);
                    updating();
                });

            });
        } else {
            updating();
        }
    };
    update_Profession();
};
/*
 *@ 高京
 *@ 20150911
 *@【同步】设定multer上传目录及规则
 */
exports.multer_diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "UploadFile/temp/");
    },
    filename: function(req, file, cb) {
        var ext = func.GetExtension(file.originalname);
        // var d = new Date().toLocaleDateString().replace(/-/g, "");
        // var r = func.CreateRandomStr(10, 1);
        // cb(null, d + "_" + r + "." + ext);
        var filename = uuid.v4();
        cb(null, filename + "." + ext);
    }
});

/*
 *@ 陈斌
 *@ 20151102
 *@ 【异步】更新获取cookies中会员信息的中间件,返回登录者的所有信息（例如data.Mobile,data.Mid）
 */
exports.updateMember = function(req, res, next) {

    //获取cookies
    var member = func.GetCookies(req);
    member = JSON.parse(member);

    var Json_Params = func.JsonUnicode({
        "d_Alive": "1",
        "d_Email": "",
        "d_isDel": "2",
        "d_Mid": member.Mid,
        "d_Mobile": "",
        "d_Passwd": member.Passwd,
        "d_Verified": ""
    });
    var ParamsJsonObj_str = JSON.stringify(Json_Params);
    var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
    //生成签名
    func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
        var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + " , \"sign_valid\": " + sign_valid + " }";

        var ajax_para = JSON.parse(ajax_para_str);

        //调用接口
        func.DoREST(config.host, config.port, "/Handler/Members.ashx?act=select_detail" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
            if (data.error == "SUCCESS" || data.error == "success") {
                next(data);
            } else {
                console.log("\nconfig 742 get_Member_here:" + JSON.stringify(data));
                next(data);
            }

        }, function(e) {
            console.log("\nconfig 747 get_Member_e:");
            console.log(e);
            next(e);

        });

    });

};
/*
 *@高京
 *@20150911
 *@【同步】设定multer文件过滤
 */
exports.multer_fileFilter = function(req, file, cb) {
    var ext = func.GetExtension(file.originalname).toLowerCase();
    if (ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "png" || ext == "bmp") {
        cb(null, true);
    } else {
        cb(null, false);
    }

};

/*
 *@ 高京
 *@ 20151106
 *@ 【异步】更新发送邮件服务器信息
 */
exports.updateMailServer = function(callback_success) {
    if (config.mail_server == null) {

        var Json_Params = func.JsonUnicode({
            "s_Iid": "6"
        });

        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);

        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {

            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + " , \"sign_valid\": " + sign_valid + " }";

            var ajax_para = JSON.parse(ajax_para_str);

            func.DoREST(config.host, config.port, "/Handler/Init.ashx?act=select_detail" + "&r=" + Math.random(), "POST", ajax_para, function(data) {

                if (data.error.toLowerCase() == "success") {
                    config.mail_server = data.detail.Iinfo;
                } else {
                    console.log("\n /config/updateMailServer:" + JSON.stringify(data));
                }
                callback_success();
            }, function(e) {
                console.log("\n /config/updateMailServer_e:");
                console.log(e);
                callback_success();
            });

        });
    } else
        callback_success();
}

/*
 *@ 高京
 *@ 20151106
 *@ 【异步】更新信息反馈接收邮箱
 */
exports.updateMailReceive = function(callback_success) {

    if (exports.mail_receive == null) {

        var Json_Params = func.JsonUnicode({
            "s_Iid": "9"
        });

        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);

        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {

            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + " , \"sign_valid\": " + sign_valid + " }";

            var ajax_para = JSON.parse(ajax_para_str);

            func.DoREST(config.host, config.port, "/Handler/Init.ashx?act=select_detail" + "&r=" + Math.random(), "POST", ajax_para, function(data) {

                if (data.error.toLowerCase() == "success") {
                    config.mail_receive = data.detail.Iinfo;
                } else {
                    console.log("\n /config/updateMailReceive:" + JSON.stringify(data));
                }
                callback_success();
            }, function(e) {
                console.log("\n /config/updateMailReceive_e:");
                console.log(e);
                callback_success();
            });

        });
    } else
        callback_success();
}

/*
 *@ 高京
 *@ 20151109
 *@ 【异步】更新Advertise
 */
exports.updateAdvertise = function(callback_success) {

    var n = 0;

    var updating = function() {
        if (++n < 1)
            return;
        callback_success();
    };

    var updateAdvertise = function() {

        if (config.Advertise != null) {
            updating();
            return;
        }

        var Json_Params = func.JsonUnicode({
            "s_Aid": ""
        });

        var ParamsJsonObj_str = JSON.stringify(Json_Params);
        var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
        //生成签名
        func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {

            var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + " , \"sign_valid\": " + sign_valid + " }";

            var ajax_para = JSON.parse(ajax_para_str);

            func.DoREST(config.host, config.port, "/Handler/Advertise.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {

                if (data.error.toLowerCase() == "success") {
                    config.Advertise = data.list;
                } else {
                    console.log("\n updateAdvertise:" + JSON.stringify(data));
                }
                updating();
            }, function(e) {
                console.log("\n updateAdvertise_e:");
                console.log(e);
                updating();
            });
        });
    };

    updateAdvertise();
};

/*
 *@ 马龙军
 *@ 20151107
 *@ 【异步】更新项目类型缓存
 */
exports.updateItems_Sort = function(login_member, req, res, callback) {
    var n = 0;
    var updating = function() {
        if (++n < 1)
            return;
        callback(login_member);
    };

    var update_Items_Sort = function() {
        if (config.Items_Sort == null) {
            var Json_Params = func.JsonUnicode({
                "s_Alive": "1",
                "s_IsContain_Items": "",
                "s_Isid": "",
                "s_Keywords": "",
                "s_Order": ""
            });
            var Json_Pages = func.JsonUnicode({
                "p_c": "",
                "p_First": "",
                "p_inputHeight": "",
                "p_Last": "",
                "p_method": "",
                "p_Next": "",
                "p_Page": "",
                "p_pageName": "",
                "p_PageStyle": "",
                "p_Pname": "",
                "p_Previous": "",
                "p_Ps": "",
                "p_sk": "",
                "p_Tp": ""
            });
            var ParamsJsonObj_str = JSON.stringify(Json_Params);
            var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
            //生成签名
            func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
                var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";
                var ajax_para = JSON.parse(ajax_para_str);

                //调用接口
                func.DoREST(config.host, config.port, "/Handler/Items_Sort.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                    if (data.error == "SUCCESS" || data.error == "success") {
                        config.Items_Sort = data.list;

                    } else {
                        console.log("\n get_Items_Sort:" + JSON.stringify(data));
                    }
                    updating();
                }, function(e) {
                    console.log("\n get_Items_Sort:" + e);
                    updating();
                });

            });
        } else {
            updating();
        }
    };
    //执行方法
    update_Items_Sort();
};

/*
 *@ 马龙军
 *@ 20151107
 *@ 【异步】更新项目辅导机构缓存
 */
exports.updateGuidance = function(login_member, req, res, callback) {
    // console.log("项目辅导机构" + login_member.detail);

    var n = 0;
    var updating = function() {
        if (++n < 1)
            return;
        callback(login_member);
    };

    var update_Guidance = function() {
        if (config.Guidance == null) {
            var Json_Params = func.JsonUnicode({
                "s_Alive": "1",
                "s_Gid": "",
                "s_Keywords": "",
                "s_Order": " "
            });
            var Json_Pages = func.JsonUnicode({
                "p_c": "",
                "p_First": "",
                "p_inputHeight": "",
                "p_Last": "",
                "p_method": "",
                "p_Next": "",
                "p_Page": "",
                "p_pageName": "",
                "p_PageStyle": "",
                "p_Pname": "",
                "p_Previous": "",
                "p_Ps": "",
                "p_sk": "",
                "p_Tp": ""
            });
            var ParamsJsonObj_str = JSON.stringify(Json_Params);
            var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
            //生成签名
            func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
                var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";
                var ajax_para = JSON.parse(ajax_para_str);

                //调用接口
                func.DoREST(config.host, config.port, "/Handler/Guidance.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                    if (data.error == "SUCCESS" || data.error == "success") {
                        config.Guidance = data.list;

                    } else {
                        console.log("\n get_Guidance:" + JSON.stringify(data));
                    }
                    updating();
                }, function(e) {
                    console.log("\n get_Guidance:" + e);
                    updating();
                });

            });
        } else {
            updating();
        }
    };
    //执行方法
    update_Guidance();
};

/*
 *@ 马龙军
 *@ 20151107
 *@ 【异步】更新项目转让方式缓存
 */
exports.updateTransfer_Way = function(login_member, req, res, callback) {
    var n = 0;
    var updating = function() {
        if (++n < 1)
            return;
        callback(login_member);
    };

    var update_Transfer_Way = function() {
        if (config.Transfer_Way == null) {
            var Json_Params = func.JsonUnicode({
                "s_Alive": "1",
                "s_Keywords": "",
                "s_Order": "",
                "s_Twid": ""
            });
            var Json_Pages = func.JsonUnicode({
                "p_c": "",
                "p_First": "",
                "p_inputHeight": "",
                "p_Last": "",
                "p_method": "",
                "p_Next": "",
                "p_Page": "",
                "p_pageName": "",
                "p_PageStyle": "",
                "p_Pname": "",
                "p_Previous": "",
                "p_Ps": "",
                "p_sk": "",
                "p_Tp": ""
            });
            var ParamsJsonObj_str = JSON.stringify(Json_Params);
            var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
            //生成签名
            func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
                var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";
                var ajax_para = JSON.parse(ajax_para_str);

                //调用接口
                func.DoREST(config.host, config.port, "/Handler/Transfer_Way.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                    if (data.error == "SUCCESS" || data.error == "success") {
                        config.Transfer_Way = data.list;
                    } else {
                        console.log("\n get_Transfer_Way:" + JSON.stringify(data));
                    }
                    updating();
                }, function(e) {
                    console.log("\n get_Transfer_Way:" + e);
                    updating();
                });

            });
        } else {
            updating();
        }
    };
    //执行方法
    update_Transfer_Way();
};

/*
 *@ 马龙军
 *@ 20151107
 *@ 【异步】更新全部省缓存
 */
exports.updateProvince = function(login_member, req, res, callback) {
    var n = 0;
    var updating = function() {
        if (++n < 1)
            return;
        callback(login_member);
    };

    var update_TradeProvince = function() {
        if (config.Province == null) {
            var Json_Params = func.JsonUnicode({
                "s_Alive": "1",
                "s_CityID": "",
                "s_FatherID": "-1",
                "s_IsContain_Business": "",
                "s_IsContain_Conference": "",
                "s_IsContain_Investor": "",
                "s_IsContain_Items": "",
                "s_Keywords": "",
                "s_Order": "",
                "s_Tcid": ""
            });
            var Json_Pages = func.JsonUnicode({
                "p_c": "",
                "p_First": "",
                "p_inputHeight": "",
                "p_Last": "",
                "p_method": "",
                "p_Next": "",
                "p_Page": "",
                "p_pageName": "",
                "p_PageStyle": "",
                "p_Pname": "",
                "p_Previous": "",
                "p_Ps": "",
                "p_sk": "",
                "p_Tp": ""
            });
            var ParamsJsonObj_str = JSON.stringify(Json_Params);
            var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
            //生成签名
            func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
                var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";
                var ajax_para = JSON.parse(ajax_para_str);

                //调用接口
                func.DoREST(config.host, config.port, "/Handler/Pcc.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                    if (data.error == "SUCCESS" || data.error == "success") {
                        config.Province = data.list;

                    } else {
                        console.log("\n get_Province:" + JSON.stringify(data));
                    }
                    updating();
                }, function(e) {
                    console.log("\n get_Province:" + e);
                    updating();
                });

            });
        } else {
            updating();
        }
    };
    //执行方法
    update_TradeProvince();
};

/*
 *@ 马龙军
 *@ 20151107
 *@ 【异步】更新项目介绍板块表缓存
 */
exports.updateItems_Sections = function(login_member, req, res, callback) {
    var n = 0;
    var updating = function() {
        if (++n < 1)
            return;
        callback(login_member);
    };

    var update_Items_Sections = function() {
        if (config.Items_Sections == null) {
            var Json_Params = func.JsonUnicode({
                "s_Alive": "1",
                "s_Isid": "",
                "s_Keywords": "",
                "s_Order": ""
            });
            var Json_Pages = func.JsonUnicode({
                "p_c": "",
                "p_First": "",
                "p_inputHeight": "",
                "p_Last": "",
                "p_method": "",
                "p_Next": "",
                "p_Page": "",
                "p_pageName": "",
                "p_PageStyle": "",
                "p_Pname": "",
                "p_Previous": "",
                "p_Ps": "",
                "p_sk": "",
                "p_Tp": ""
            });
            var ParamsJsonObj_str = JSON.stringify(Json_Params);
            var ParamsJsonObj = JSON.parse(ParamsJsonObj_str);
            //生成签名
            func.CreateTopuSignature(ParamsJsonObj, function(sign_valid) {
                var ajax_para_str = "{ \"params\": " + JSON.stringify(func.JsonEscape(Json_Params)) + ", \"pages\": " + JSON.stringify(func.JsonEscape(Json_Pages)) + " , \"sign_valid\": " + sign_valid + " }";
                var ajax_para = JSON.parse(ajax_para_str);

                //调用接口
                func.DoREST(config.host, config.port, "/Handler/Items_Sections.ashx?act=select_list" + "&r=" + Math.random(), "POST", ajax_para, function(data) {
                    if (data.error == "SUCCESS" || data.error == "success") {
                        config.Items_Sections = data.list;

                    } else {
                        console.log("\n get_Province:" + JSON.stringify(data));
                    }
                    updating();
                }, function(e) {
                    console.log("\n get_Province:" + e);
                    updating();
                });

            });
        } else {
            updating();
        }
    };
    //执行方法
    update_Items_Sections();
};
