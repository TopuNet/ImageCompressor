function imgLoad(imgSrc,imgName,callback) {
	var img=new Image();
	img.src=imgSrc;
	if(img.complete)
	{
	    imgLoaded(img, $(imgName), callback, false);
	}
	else
	{
		img.onload=function()
		{
		    imgLoaded(img, $(imgName), callback, false);
		}
	}
} 

function imgLoad(imgSrc, imgName, callback, changeSize) {
    var img = new Image();
    img.src = imgSrc;
    if (img.complete) {
        imgLoaded(img, $(imgName), callback, changeSize);
    }
    else {
        img.onload = function () {
            imgLoaded(img, $(imgName), callback, changeSize);
        }
    }
}

function imgLoaded(img, imgName, callback, changeSize) {
    $(imgName).attr("src", img.src);
    if (changeSize) {
        $(imgName).attr("width", img.width);
        $(imgName).attr("height", img.height);
        $(imgName).css("width", img.width);
        $(imgName).css("height", img.height);
    }
    callback();
}


//==scroll screen and show Img==
function screen_showImg(img_obj, loading_Pics, Pics) {
    $(img_obj).each(function () {
        var top1 = $(this).offset().top;
        var top2 = top1 + parseInt($(this).css("height").replace("px", ""));
        var top = $(window).scrollTop();
        var h = $(window).height();

        if (top1 < top + h && top2 > top && ($(this).attr("src") == null || $(this).attr("src") == "")) {
            $(this).attr("src", loading_Pics);
            imgLoad(Pics[$(img_obj).index($(this))], $(this)
                        , function () {
                            screen_showImg(img_obj, loading_Pics, Pics);
                        }
                        , true);
        }
    });
}