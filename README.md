# ImageCompressor JS插件 v1.1.3
###表单中上传图像后 裁剪 & 压缩 & 提交64base编码图像

更新说明：
-------------
1. 增加功能：图片对象（非上传文件）单独调用Compress压缩
2. 修改功能：Compress压缩方法由原先的同步返回压缩后的对象改为异步成功回调
3. 修改功能：getMimeType方法原先只能获取Base64的图片类型，改为可以获取普通图片对象的图片类型。仍为只支持jpg和png。如没有合适的类型，则返回image/jpeg
4. 后续会增加图片对象（非上传文件）单独调用方法创建裁剪框

文件结构：
-------------
1. ImageCompressor.js放入项目文件夹jq中
2. exif.js、Jcrop.gif、jquery.Jcrop.min.css、imageLoad.js 和 jquery.Jcrop.min.js 放入项目文件夹inc中

页面引用：
-------------
1. 页面底端引用最新版 /inc/Jquery.min.js#1.x.x 和 /inc/Always.js
2. Jquery后引用 /jq/ImageCompressor.js
3. ImageCompressor.js 中前两行引用exif和jqueryJcrop.min.js（如页面中本已引用这两个文件，此处可以省去引用，且尽量避免重复引用）
4. 页面<head>中引用/inc/jquery.Jcrop.min.css
5. jquery.Jcrop.min.css中搜索Jcrop.gif，是对Jcrop.gif的图片渲染，可以根据需要修改

功能配置及启用：
--------------
###监听文件域的改变，创建裁剪框。提交表单后执行裁剪、压缩后提交：
1. 页面中含有：<input type="file" id="f1" />，id名随意。
2. 页面中含有：<form action="/show" id="img_form" enctype="application/x-www-form-urlencoded" method="post" onsubmit="return ImageCompressor.canBePost">，action和id名随意。
3. form中含有：<input type="hidden" class="img64" name="img64" /> <input type="hidden" class="ext" name="ext" />，class名固定，name名随意。其中name和表单处理页的程序相关，和本插件无关。
4. 页面中含有：<img id="Crop_img_panel" />，id名随意，隐藏不显示。样式在jquery.Jcrop.min.css中
5. 页面底部调用初始化方法：
		$(function() {
	        ImageCompressor.init({
	            file_id: "f1",	//文件域的id名
	            Crop_img_id: "Crop_img_panel",	//图片装载容器（即三.4中包含的img）的id名
	            form_id:"img_form",	//form的id名，为空时指向页面中第一个form，不建议为空
	            quality: 300, //压缩至KB
	            img_p_width_px: 400, //图片容器最大宽度
	            img_p_height_px: 270, //图片容器最大高度
	            crop_target_width_px: 1000, //最终剪切目标宽度
	            crop_target_height_px: 670, //最终剪切目标高度
	            callback_fileSelect: function() {} //选择图片后的回调
	        });
	    });
###单独调用压缩方法：
	<script src="/inc/imageLoad.js" type="text/javascript"></script>
	$(function(){
        var img = new Image();
        img.src = "/views/4M.jpg";

        imgLoad(img.src, "", function() {
            var quality = 30; //压缩至KB
            ImageCompressor.Compress(img, quality, function(_img) {
                //后续操作
            });
        }, false);
	});
