const $siteList = $('.siteList');
const $site = $('.site');
const $addButton = $('.addButton');
const $inpWd = $('.search>input[name=wd]');
let xHasMapStr = localStorage.getItem('x');
let xHasMap = JSON.parse(xHasMapStr);
const hasMap = xHasMap || [
    {url:'https://www.bilibili.com',logo:'B',logoType:'text'},
    {url:'https://www.zhihu.com',logo:'Z',logoType:'text'}
];

const simplifyUrl =(str) => {
    return str.replace('http://','')
        .replace('https://','')
        .replace('www.','')
        .replace('/\/.*/','')
}
const render = ()=>{
    $siteList.find('.site').remove();
    hasMap.forEach((node,index)=>{
        let link = simplifyUrl(node.url);
        let $li = $(`
        <li class="site">
            <div class="delete">
                <i class="iconfont icon-chahao1"></i>
            </div>
            <a href="`+node.url+`">
                <div class="logo">`+node.logo+`</div>
                <div class="link">`+link+`</div>
            </a>
        </li>`)
        $addButton.before($li);
        $li.on('click','.delete',(e)=>{
            e.stopPropagation();
            hasMap.splice(index,1);
            render();
        })
    });
}
render();


$addButton.on('click',()=>{
    let url = window.prompt('请输入要添加的网址！') || '';
    url = url && url.trim();
    let logo = url;
    if(url && url.indexOf('http') !== 0){
        url = 'https://'+url;
    }
    logo = simplifyUrl(logo).substring(0,1);
    if(logo){
        hasMap.push({
            url:url,
            logo:logo,
            logoType:'text'
        })
    }
    render();
    let hasMapStr = JSON.stringify(hasMap);
    localStorage.setItem('x',hasMapStr);
})

$inpWd.on('focus',()=>{
    $(document).unbind('keyup');
})

$inpWd.on('blur',()=>{
    if($inpWd.val()){
        $('.sub').attr('type','submit');
    }
    $(document).on('keyup',(e)=>{keyUp(e)});
})
//当输入框失去焦点的时候才能通过键盘事件跳转
$(document).on('keyup',(e)=>{keyUp(e)});
function keyUp(e){
    let key = e.key;
    for(let i = 0; i < hasMap.length; i++){
        if(hasMap[i].logo === key || hasMap[i].logo === key.toUpperCase()){
            window.open(hasMap[i].url,'_self');
        }
    }
}

// 移动端长按触发delete显示
let timeOutEvent = 0;
function longPress(node){
    // node.find('.delete').css('display','block');
    node.parentNode.parentNode.firstElementChild.style.display = 'block';
}
let s = true;
$siteList.on({
    touchstart:(e)=>{
        s = true;
        timeOutEvent = setTimeout(function(){
            longPress(e.target);
            s = false;
        },1000);
        e.preventDefault();
    },
    touchmove:()=>{
        clearTimeout(timeOutEvent);
        timeOutEvent = 0;
    },
    touchend:(e)=>{
        clearTimeout(timeOutEvent);
        if(s){
            e.target.click();
        }
    }
})

/*触摸delete以外的元素，将delete隐藏 */
document.addEventListener('touchstart', (e) => {
})
let a = document.getElementsByClassName('delete')[0]
let arr = []
arr.push(a)	 // 先推入当前元素
getParent(a) // 执行递归
arr.push(window) // 最后再加一个window
function getParent(obj) {
    if (obj.parentNode) { // 往树的上层追溯，直到最上层
        arr.push(obj.parentNode)
    } else {
        return
	}
    getParent(obj.parentNode) // 递归追溯源头
}
let ObjStatus = document.getElementsByClassName('status')[0]
document.addEventListener('touchstart', (e) => {
    let t = document.getElementsByClassName('demo')[0] // 最外层元素
    if (!e.path.includes(t)) {
        $siteList.find('.delete').css('display','none');
	}
})