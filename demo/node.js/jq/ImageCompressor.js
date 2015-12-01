includeJS("/inc/exif.js");
includeJS("/inc/jquery.Jcrop.min.js");

/*
 * 高京
 * 20151125
 * 图片剪切压缩类 v1.0.1
 */
var ImageCompressor = {
    exif: null,

    Jcrop_obj: null,
    Jcrop_c: {
        x: 0,
        y: 0,
        x2: 0,
        y2: 0,
        w: 0,
        h: 0,
        box_w: 0,
        box_h: 0
    },

    img: null,
    img64: null,

    //新图片质量（KB，压缩后）
    quality: 300,

    //表单是否可以被提交的开关
    canBePost: false,

    //设定图片容器最大尺寸
    img_p_width_px: 300,
    img_p_height_px: 400,

    //设定裁剪目标尺寸（当实际图片的裁剪后尺寸小于此尺寸时，以实际尺寸为准）
    crop_target_width_px: 900,
    crop_target_height_px: 1350,

    //设定剪裁框初始化尺寸（注意此尺寸宽高比要与目标尺寸宽高比一致），加载图片时计算
    crop_stand_width_px: 0,
    crop_stand_height_px: 0,

    //剪裁框最小尺寸
    crop_minSize_arr_px: [0, 0],

    // 选择图片后的回调方法
    callback_fileSelect: null,

    /*
     *@高京
     *@20150915
     *@初始化方法
     *@args{
     *  file_id：file控件ID。不能为空
     *  Crop_img_id：裁剪图片容器ID。不能为空
     *  form_id：表单ID。如为null，则会选择"form:eq(0)"
     *  quality：压缩至KB
     *  img_p_width_px：图片容器最大宽度
     *  img_p_height_px：图片容易最大高度
     *  crop_target_width_px：剪切目标宽度
     *  crop_target_height_px：剪切目标高度
     *  callback_fileSelect: 选择图片后的回调
     *}
     */
    init: function(args) {
        //接收参数
        if (args) {
            if (!isNaN(args.quality))
                ImageCompressor.quality = args.quality;
            if (!isNaN(args.img_p_width_px))
                ImageCompressor.img_p_width_px = args.img_p_width_px;
            if (!isNaN(args.img_p_height_px))
                ImageCompressor.img_p_height_px = args.img_p_height_px;
            if (!isNaN(args.crop_target_width_px))
                ImageCompressor.crop_target_width_px = args.crop_target_width_px;
            if (!isNaN(args.crop_target_height_px))
                ImageCompressor.crop_target_height_px = args.crop_target_height_px;
            if (args.form_id)
                args.form_id = "form:eq(0)";
            else
                args.form_id = "#" + args.form_id;
            if (args.Crop_img_id)
                ImageCompressor.Crop_img_ID = args.Crop_img_id;
            ImageCompressor.callback_fileSelect = args.callback_fileSelect;
        }

        if (!args.file_id) {
            console.log("file_id不能为空");
            return;
        }

        //监听file_id控件的修改方法（当浏览文件后调用方法）
        document.getElementById(args.file_id).addEventListener('change', ImageCompressor.handleFileSelect, false);

        $(args.form_id).submit(function() {
            if (ImageCompressor.canBePost)
                return;

            ImageCompressor.Jcrop_c.box_w = ImageCompressor.crop_target_width_px;
            ImageCompressor.Jcrop_c.box_h = ImageCompressor.crop_target_height_px;

            //不允许剪切框的下沿和图片底边重合，右沿和图片右边重合
            ImageCompressor.Jcrop_obj.h = Math.floor(ImageCompressor.Jcrop_obj.getBounds()[1]);
            if (Math.floor(ImageCompressor.Jcrop_c.y2) == ImageCompressor.Jcrop_obj.h) {
                var diff = parseInt(ImageCompressor.Jcrop_obj.h / (ImageCompressor.crop_target_height_px + 100)) + 1;
                ImageCompressor.Jcrop_c.y2 -= diff;
                ImageCompressor.Jcrop_c.h -= diff;
            }
            ImageCompressor.Jcrop_obj.w = Math.floor(ImageCompressor.Jcrop_obj.getBounds()[0]);
            if (Math.floor(ImageCompressor.Jcrop_c.x2) == ImageCompressor.Jcrop_obj.w) {
                var diff = parseInt(ImageCompressor.Jcrop_obj.w / (ImageCompressor.crop_target_width_px)) + 10;
                ImageCompressor.Jcrop_c.x2 -= diff;
                ImageCompressor.Jcrop_c.w -= diff;
            }

            //图片旋转
            var rotate_img64 = ImageCompressor.Rotate(ImageCompressor.img64, ImageCompressor.exif.PixelXDimension, ImageCompressor.exif.PixelYDimension);
            var rotate_img = new Image();
            rotate_img.src = rotate_img64;
            rotate_img.onload = function() {

                //图片裁剪
                var crop_img64 = ImageCompressor.Crop(rotate_img, ImageCompressor.Jcrop_c);
                var crop_img = new Image();
                crop_img.src = crop_img64;
                crop_img.onload = function() {
                    ImageCompressor.Compress(crop_img, ImageCompressor.quality, function(imgCompressed) {

                        $(".img64").val(imgCompressed);

                        $("#Crop_img_panel").css("max-width", "800px").css("max-height", "540px").attr("src", imgCompressed).show().css("visibility", "visible");
                        switch (ImageCompressor.img.type.toLowerCase()) {
                            case "image/png":
                                $(".ext").val("png");
                                break;
                            case "image/jpeg":
                                $(".ext").val("jpg");
                                break;
                            default:
                                return false;
                                break;
                        }

                        ImageCompressor.canBePost = true;
                        $(args.form_id).submit();
                    });
                };
            };

        });
    },

    /*
     *@高京
     *@20150915
     *@处理file控件的change事件
     */
    handleFileSelect: function(evt) {

        var files = evt.target.files;
        var files_c = files.length;
        var i = 0;

        var Compress_img = $("#" + ImageCompressor.Crop_img_ID);

        for (; i < files_c; i++) {
            ImageCompressor.img = files[i]; //原图片

            //只支持jpg及png格式图片
            if (!ImageCompressor.img.type.match(/image\/(jpg|jpeg|png)+/))
                continue;

            EXIF.getData(ImageCompressor.img, function() {
                ImageCompressor.exif = EXIF.getAllTags(this);

                //将图片转为Base64编码，并创建裁剪容器
                ImageCompressor.getImg64(ImageCompressor.img, function(_img64) {
                    ImageCompressor.img64 = _img64;

                    //初始化裁剪容器
                    if (ImageCompressor.Jcrop_obj != null) { //已有裁剪容器对象，重置图片源
                        ImageCompressor.Jcrop_obj.setImage(ImageCompressor.img64.src, function(api) {
                            setSelect(ImageCompressor.img64); //创建裁剪框
                        });
                    } else {
                        //装载并显示图片
                        Compress_img.attr("src", ImageCompressor.img64.src).show(0);

                        //初始化裁剪容器
                        Compress_img.Jcrop({
                            allowSelect: false, //允许创建新选框——no
                            // aspectRatio: crop_stand_width_px / crop_stand_height_px, //裁剪框宽高比——放在初始化结束后计算了——setSelect()
                            //minSize: [crop_stand_width_px / 10, crop_stand_height_px / 10],   //裁剪框最小尺寸——放在初始化结束后计算了——setSelect()
                            boxWidth: ImageCompressor.img_p_width_px, //容器宽度
                            boxHeight: ImageCompressor.img_p_height_px, //容器高度
                            onChange: function(c) { //监听裁剪框change事件——拖动、修改大小等一切改变

                                // 更新裁剪框对象
                                ImageCompressor.Jcrop_c = c;

                                // $(".l0").html(ImageCompressor.Jcrop_obj.getBounds()[0] + "×" + ImageCompressor.Jcrop_obj.getBounds()[1]);    //源图片尺寸
                                // $(".l0").html(ImageCompressor.exif.PixelXDimension + " × " + ImageCompressor.exif.PixelYDimension);
                                // $(".l1").html(c.x); //裁剪框x
                                // $(".l2").html(c.y); //裁剪框y
                                // $(".l3").html(c.x2); //裁剪框x2
                                // $(".l4").html(c.y2); //裁剪框y2
                                // $(".l5").html(c.w + "px × " + c.h + "px"); //裁剪框宽高
                                // $(".l6").html(ImageCompressor.exif.Orientation);

                                // 图片如果没有EXIF信息，则手动赋值Orientation、宽、高
                                if (ImageCompressor.exif.Orientation == undefined) {
                                    ImageCompressor.exif.Orientation = 1;
                                    ImageCompressor.exif.PixelXDimension = ImageCompressor.Jcrop_obj.getBounds()[0];
                                    ImageCompressor.exif.PixelYDimension = ImageCompressor.Jcrop_obj.getBounds()[1];
                                }
                            }
                        }, function() {

                            //更新裁剪容器对象
                            ImageCompressor.Jcrop_obj = this;

                            //创建裁剪框
                            setSelect(ImageCompressor.img64);

                            //回调
                            ImageCompressor.callback_fileSelect();
                        });
                    }
                });
            });
        }

        //创建选取框
        var setSelect = function(img64) {

            //图片实际显示尺寸
            var _fact_arr = ImageCompressor.Jcrop_obj.getWidgetSize();
            var _width_fact_px = _fact_arr[0];
            var _height_fact_px = _fact_arr[1];

            //图片源尺寸
            var _Origin_arr = ImageCompressor.Jcrop_obj.getBounds();
            var _width_Origin_px = _Origin_arr[0];
            var _height_Origin_px = _Origin_arr[1];

            //缩放比例
            var _ratio_width_percent = _width_Origin_px / _width_fact_px;
            var _ratio_height_percent = _height_Origin_px / _height_fact_px;
            var _ratio_percent = _ratio_width_percent >= _ratio_height_percent ? _ratio_width_percent : _ratio_height_percent;
            if (_ratio_percent < 1) //缩放比例不能小于1
                _ratio_percent = 1;

            //根据缩放比例和图片实际显示大小，获得裁剪框大小
            ImageCompressor.crop_stand_width_px = _width_fact_px / _ratio_percent;
            ImageCompressor.crop_stand_height_px = ImageCompressor.crop_stand_width_px * (ImageCompressor.crop_target_height_px / ImageCompressor.crop_target_width_px);

            //当裁剪框的宽度小于100时，扩大到100
            if (100 / ImageCompressor.crop_stand_width_px > 1) {
                ImageCompressor.crop_stand_height_px = ImageCompressor.crop_stand_height_px * (100 / ImageCompressor.crop_stand_width_px);
                ImageCompressor.crop_stand_width_px = ImageCompressor.crop_stand_width_px * (100 / ImageCompressor.crop_stand_width_px);
            }

            //如果高度小于裁剪框高度，则要继续缩小裁剪框至高度小于图片显示高度
            if (_height_fact_px < ImageCompressor.crop_stand_height_px) {
                ImageCompressor.crop_stand_height_px = _height_fact_px;
                ImageCompressor.crop_stand_width_px = ImageCompressor.crop_stand_height_px * (ImageCompressor.crop_target_width_px / ImageCompressor.crop_target_height_px);
            }

            //重置裁剪框属性
            ImageCompressor.Jcrop_obj.setOptions({
                aspectRatio: ImageCompressor.crop_stand_width_px / ImageCompressor.crop_stand_height_px,
                minSize: [ImageCompressor.crop_stand_width_px / _ratio_percent, ImageCompressor.crop_stand_height_px / _ratio_percent]
            });

            //创造裁剪框
            ImageCompressor.Jcrop_c.x = (_width_fact_px - ImageCompressor.crop_stand_width_px) / 2
            ImageCompressor.Jcrop_c.y = (_height_fact_px - ImageCompressor.crop_stand_height_px) / 2;
            ImageCompressor.Jcrop_c.x2 = ImageCompressor.Jcrop_c.x + ImageCompressor.crop_stand_width_px;
            ImageCompressor.Jcrop_c.y2 = ImageCompressor.Jcrop_c.y + ImageCompressor.crop_stand_height_px;
            ImageCompressor.Jcrop_c.w = ImageCompressor.crop_stand_width_px;
            ImageCompressor.Jcrop_c.h = ImageCompressor.crop_stand_height_px;
            ImageCompressor.Jcrop_obj.setSelect([ImageCompressor.Jcrop_c.x, ImageCompressor.Jcrop_c.y, ImageCompressor.Jcrop_c.x2, ImageCompressor.Jcrop_c.y2]);
        };
    },


    /*
     *@高京
     *@20150912
     *@【异步】执行压缩
     *@img：源图片 或 图片Base64对象
     *@quality：压缩目标质量（KB）
     *@callback_success：成功回调。function(img_src){ //img_src为压缩后的Base64码 } 
     */
    Compress: function(img, quality, callback_success) {

        var createCanvas = function(_img, ratio) {
            canvas = document.createElement("canvas");
            canvas.width = _img.width;
            canvas.height = _img.height;
            ctx = canvas.getContext("2d");
            ctx.drawImage(_img, 0, 0);
            // console.log("ratio:" + ratio + ";img.src.length:" + img.src.length + ";img1.length:" + img1.length + ";quality:" + Math.floor(img1.length * (2 / 3) / 1024 * 100) / 100);
            var _img1;

            if (ratio == undefined)
                _img1 = canvas.toDataURL(ImageCompressor.getMimeType(_img.src));
            else
                _img1 = canvas.toDataURL(ImageCompressor.getMimeType(_img.src), ratio);
            ctx = null;
            canvas = null;

            return _img1;
        };

        if (img.src.indexOf(";base64,") == -1) {
            var img1 = new Image();
            img1.src = createCanvas(img);
            img1.onload = function() {
                ImageCompressor.Compress(img1, quality, callback_success);
            };
        } else {

            //源图片质量(3/4是考虑base64编码的增量)
            var quality_old = Math.floor(img.src.length * (3 / 4) / 1024 * 100) / 100;

            //如果目标质量比源图片还要大，略过压缩，直接返回。
            // console.log("old:" + quality_old + ";new:" + quality);
            if (quality_old <= quality)
                callback_success(img.src);

            //计算目标图片的质量（Quality）
            var ratio = quality / quality_old;

            //压缩
            var img1 = createCanvas(img, ratio);
            var img = new Image();
            img.src = img1;
            img.onload = function() {

                callback_success(img1);
            };
        }

    },

    /*
     *@高京
     *@20150912
     *@获取文件的Base64，返回Base64编码的img对象
     *@img：源文件对象
     *@success_function：成功后的回调方法
     */
    getImg64: function(img, success_function) {
        var reader = new FileReader();
        var img64;
        // debugger;

        reader.onload = (function(f) {
            return function(e) {
                img64 = new Image();
                img64.src = e.target.result;
                img64.onload = function() {
                    success_function(img64);
                }
            }
        })();

        reader.readAsDataURL(img);
    },

    /*
     *@高京
     *@20150914
     *@裁剪Base64图片，返回裁剪后Base64图片
     *@img64：源图片对象
     *@Jcrop_c：裁剪参数
     */
    Crop: function(img64, Jcrop_c) {

        //判断裁剪宽高是否大于目标尺寸的画布
        if (Jcrop_c.w < Jcrop_c.box_w || Jcrop_c.h < Jcrop_c.box_h) {
            Jcrop_c.box_w = Jcrop_c.w;
            Jcrop_c.box_h = Jcrop_c.h;
        }

        //将图片绘入canvas，并进行裁剪
        var canvas = document.createElement("canvas");
        canvas.width = Jcrop_c.box_w;
        canvas.height = Jcrop_c.box_h;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img64, Jcrop_c.x, Jcrop_c.y, Jcrop_c.w, Jcrop_c.h, 0, 0, Jcrop_c.box_w, Jcrop_c.box_h);

        //将图片转为base64编码
        var crop_img64;
        crop_img64 = canvas.toDataURL(ImageCompressor.getMimeType(img64.src));

        return crop_img64;
    },

    /*
     *@高京
     *@20151007
     *@旋转Base64图片，返回旋转后Base64图片
     *@img64：源图片对象
     *@PixelX：源图片宽度
     *@PixelY：源图片高度
     */
    Rotate: function(img64, PixelX, PixelY) {

        var rotate_img64 = img64.src;

        // 创建canvas
        var canvas_rotate = document.createElement("canvas");
        canvas_rotate.width = PixelX;
        canvas_rotate.height = PixelY;

        // 根据EXIF.Orientation判断是否需要旋转
        var rotation = 0;
        switch (ImageCompressor.exif.Orientation) {

            case 1:
                rotation = 0;
                break;
            case 6:
                rotation = 90;
                break;
            case 3:
                rotation = 180;
                break;
            case 8:
                rotation = 270;
                break;
        }


        // 设置Image渲染起点
        var pos = {
            x: -canvas_rotate.width / 2,
            y: -canvas_rotate.height / 2
        };

        // 如旋转45度，则对调canvas宽高
        if (rotation % 180 != 0) {
            var _t = canvas_rotate.width;
            canvas_rotate.width = canvas_rotate.height;
            canvas_rotate.height = _t;

            // 重置Image渲染起点
            pos = {
                x: -canvas_rotate.height / 2,
                y: -canvas_rotate.width / 2
            };
        }

        // 实例化canvas→设置中心点→旋转→渲染Image
        var ctx_rotate = canvas_rotate.getContext("2d");
        ctx_rotate.translate(canvas_rotate.width / 2, canvas_rotate.height / 2);
        ctx_rotate.rotate(rotation * Math.PI / 180);
        ctx_rotate.drawImage(img64, pos.x, pos.y);

        // 将canvas图像转换为Base64格式图片
        rotate_img64 = canvas_rotate.toDataURL(ImageCompressor.getMimeType(img64.src));

        return rotate_img64;
    },

    /*
     *@高京
     *@20150914
     *@根据图片的Base64码获得mimeType（非64码则判断imgSrc的后缀），只支持jpg和png。如其他格式，则会返回image/jpeg
     *@imgSrc：图片的src
     */
    getMimeType: function(imgSrc) {

        //获得mimeType
        var mimeType = "";
        if (imgSrc.toLowerCase().match(/data:image\/jpeg;base64,/g))
            mimeType = "image/jpeg";
        else if (imgSrc.toLowerCase().match(/data:image\/png;base64,/g))
            mimeType = "image/png";
        else {
            var ext = imgSrc.substr(imgSrc.lastIndexOf(".") + 1, 3).toLowerCase();
            if (ext == "png")
                mimeType = "image/png";
            else
                mimeType = "image/jpeg";
        }

        return mimeType;
    }
};
