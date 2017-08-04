/*************************** event操作 ***************************/

function addEvent(elm, evType, fn, useCapture)
{
    if (elm.addEventListener) 
    {
        elm.addEventListener(evType, fn, useCapture);
        return true;
    }
    else if (elm.attachEvent) 
    {
        var r = elm.attachEvent("on" + evType, fn);
        return r;
    }
    else
    {
        elm['on' + evType] = fn;
    }
}

function removeEvent(elm, evType, fn, useCapture)
{
    if (elm.removeEventListener)
    {
        elm.removeEventListener(evType, fn, useCapture); //DOM2.0
        return true;
    } 
    else if (elm.detachEvent)
    {
        var r = elm.detachEvent("on" + evType, fn); //IE5+
        return r;
    }
}

function forbiddenEvent(event)
{
    event = event || window.event;
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;
}

/*************************** event操作 ***************************/


/***************************** AJAX *****************************/

// 创建XMLHttpRequest对象
var xmlhttp;
if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
} else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

// 
function getData(method, url, queryString, fnc) { //获取JSON数据
    // 发送请求，异步True
    xmlhttp.open(method, url, true);
    // 添加http头
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    // 
    xmlhttp.send(queryString);
    // 
    xmlhttp.onreadystatechange = fnc;
}

/***************************** AJAX *****************************/


/************************* send message *************************/

// delete
function deleteInf(event)
{
    var obj = event.target;
    
    // 向后台申请delete操作，同时刷新data
    getData("DELETE", "http://121.42.29.120:8989/info/delete/" + obj.parentNode.parentNode.getAttribute('id'), null, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var data = JSON.parse(xmlhttp.responseText);
                if(data.status === 0) obj.parentNode.parentNode.parentNode.removeChild(obj.parentNode.parentNode);
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });

}

// add / edit
function updateInf(event) {
        // 定义变量
    var obj = event.target,
        parent = obj.parentNode.parentNode,
        queryString = "",
        // 定位基本信息
        name = parent.querySelector('input[name="name"]'),
        number = parent.querySelector('input[name="number"]'),
        phone = parent.querySelector('input[name="phone"]'),
        // 正则表达式过滤
        // emailPattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/,
        numberPattern = /^[U][2][0]\d{7}$/,
        phonePattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    
    if (!name.value) 
    {
        alert('请输入姓名');
        name.focus();
    } 
    else if (!number.value) 
    {
        alert('请输入学号');
        number.focus();
    } 
    else if (!numberPattern.test(number.value)) 
    {
        alert('请输入有效的学号');
        number.focus();
    } 
    else if (!phone.value) 
    {
        alert('请输入手机号码');
        phone.focus();
    } 
    else if (!phonePattern.test(phone.value)) 
    {
        alert('请输入有效的手机号码');
        phone.focus();
    } 
    // 全部检验通过
    else 
    {
        queryString = "id=" + parent.getAttribute('id') + "&name=" + name.value + "&number=" + number.value + "&phone=" + phone.value;
        getData("PUT", "http://121.42.29.120:8989/info/modify", queryString, function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var data = JSON.parse(xmlhttp.responseText);
                    obj.style.display = "none";
                    obj.previousElementSibling.style.display = "inline-block";
                    hideInputs(parent);
                } else {
                    console.log("发生错误" + xmlhttp.status);
                }
            }
        });
    }
}

// getAll
function getAllInf() {
    getData("GET", "http://121.42.29.120:8989/info/list", null, function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var data = JSON.parse(xmlhttp.responseText).data;
                var wrap = document.createDocumentFragment();
                for (var i = 0; i < data.length; i++) {
                    createInfList(data[i], wrap);
                }
                document.querySelector("ul.container").appendChild(wrap);
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}

/************************* send message *************************/


/***************************** HTML *****************************/

// 向html文档中添加一行<li>
function createInfList(data, parent) {
    // <li>
    var list = document.createElement('li');            // 创建<li>
    
    if (parent.lastchild.className == 'inf')            // set className
        list.className = "inf alt";
    else
        list.className = "inf";
    
    list.setAttribute('id', data.id);                   // 指定ID
    
    // <span title="name">
    var name = document.createElement('span');          // 创建<span>
    name.title = "name";
    name.innerText = data.name;
    
    list.appendChild(name);
    
    // <input type="text" name="name" placeholder="姓名" />
    var nameInput = document.createElement('input');
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.setAttribute('placeholder', '姓名');
    
    list.appendChild(nameInput);
    
    // <span title="number">
    var number = document.createElement('span');
    number.title = "number";
    number.innerText = data.number;
    
    list.appendChild(number);
    
    // <input type="text" name="number" placeholder="学号" />
    var numberInput = document.createElement('input');
    numberInput.type = "text";
    numberInput.name = "number";
    numberInput.setAttribute('placeholder', '学号');
    
    list.appendChild(numberInput);
    
    // <span title="phone">
    var phone = document.createElement('span');
    phone.title = "phone";
    phone.innerText = data.phone;
    
    list.appendChild(phone);

    // <input type="text" name="phone" placeholder="电话" />
    var phoneInput = document.createElement('input');
    phoneInput.type = "text";
    phoneInput.name = "phone";
    phoneInput.setAttribute('placeholder', '手机号码');
    
    list.appendChild(phoneInput);
    
    // <div class="operation">
    var operation = document.createElement('div');
    operation.className = "operation";
    
    // <div class="edit/delete/save inline-block">
    var edit = document.createElement('div');
    var delete_div = document.createElement('div');
    var save = document.createElement('div');
    
    edit.className = "edit inline-block";
    delete_div.className = "delete inline-block";
    save.className = "save inline-block";
    
    operation.appendChild(edit);
    operation.appendChild(save);
    operation.appendChild(delete_div);
    
    list.appendChild(operation);
    
    
    parent.appendChild(list);
    
    // 添加监听事件
    addEvent(delete_div, "click", function(event) {
        deleteInf(event);
    }, false);
    addEvent(edit, "click", function(event) {
        editInf(event);
        forbiddenEvent(event);
    }, false);
    addEvent(save,"click",function (eventq) {
        updateInf(event);
    },false);
}

/****************** seperate pages *******************/



/****************** seperate pages *******************/

/********************* 输入框操作 *********************/

// edit
function editInf(event) {
    var obj = event.target;
    // 隐藏edit图标
    obj.style.display = "none";
    // 显示save图标
    obj.nextElementSibling.style.display = "inline-block";
    // 显示输入框，obj.parentNode.parentNode即为当前行节点
    showInputs(obj.parentNode.parentNode);
}

/* 
 * 三步显示输入框：
 *         input.style.display = "inline-block"  显示input块
 *         span.style.display = "none"  隐藏span块
 *         input.value = span.innerText  设置input的初始值
 */
function showInputs(parent) {
    parent.querySelector('input[name="name"]').style.display = "inline-block";
    parent.querySelector('span[title="name"]').style.display = "none";
    parent.querySelector('input[name="name"]').value = parent.querySelector('span[title="name"]').innerText;
    
    parent.querySelector('input[name="number"]').style.display = "inline-block";
    parent.querySelector('span[title="number"]').style.display = "none";
    parent.querySelector('input[name="number"]').value = parent.querySelector('span[title="number"]').innerText;
    
    parent.querySelector('input[name="phone"]').style.display = "inline-block";
    parent.querySelector('span[title="phone"]').style.display = "none";
    parent.querySelector('input[name="phone"]').value = parent.querySelector('span[title="phone"]').innerText;
}

/*
 * 与show正好相反
 */
function hideInputs(parent) {
    parent.querySelector('input[name="name"]').style.display = "none";
    parent.querySelector('span[title="name"]').style.display = "inline-block";
    parent.querySelector('span[title="name"]').innerText = parent.querySelector('input[name="name"]').value;
    
    parent.querySelector('input[name="number"]').style.display = "none";
    parent.querySelector('span[title="number"]').style.display = "inline-block";
    parent.querySelector('span[title="number"]').innerText = parent.querySelector('input[name="number"]').value;
    
    parent.querySelector('input[name="phone"]').style.display = "none";
    parent.querySelector('span[title="phone"]').style.display = "inline-block";
    parent.querySelector('span[title="phone"]').innerText = parent.querySelector('input[name="phone"]').value;
}

/********************* 输入框操作 *********************/

/********************* add form *********************/

function showAddForm() {
    document.forms.addInf.style.opacity = "1";
    document.forms.addInf.style.top = "35%";
}

function hideAddForm() {
    document.forms.addInf.style.opacity = "0";
    document.forms.addInf.style.top = "-10%";
}

// get the form information
// this is an universal function to get JSON information
function getFormQueryString(frmName) {
    var form = document.forms[frmName];
    var i, queryString = "",
        and = "";
    var item; // for each form's object
    var itemValue; // store each form object's value
    for (i = 0; i < form.length; i++) 
    {
        item = form[i]; // get form's each object
        if (item.name !== '') 
        {
            if (item.type == 'select-one') 
            {
                itemValue = item.options[item.selectedIndex].value;
            } 
            else if (item.type == 'checkbox' || item.type == 'radio') 
            {
                if (item.checked === false) 
                {
                    continue;
                }
                itemValue = item.value;
            } 
            else if (item.type == 'file') 
            {
                continue; //跳过FILE
            } 
            else if (item.type == 'button' || item.type == 'submit' || item.type == 'reset' || item.type == 'image') 
            { // ignore this type
                continue;
            } 
            else 
            {
                itemValue = item.value;
            }
            //itemValue = encodeURIComponent(itemValue);
            queryString += and + item.name + '=' + itemValue;
            and = "&";
        }
    }
    return queryString;
}

// click add
addEvent(document.getElementById('add'), "click", function(event) {
    showAddForm();
    forbiddenEvent(event);
}, false);
// click close
addEvent(document.querySelector('div.close'), "click", function(event) {
    hideAddForm();
    forbiddenEvent(event);
}, false);
// click submit
addEvent(document.forms.addInf, "submit", function(event) {
    var form = document.forms.addInf,
        numberPattern = /^[U][2][0]\d{7}$/,
        phonePattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
    // 对提交的表单做判断，判断无误则
    if (!form.name.value) {
        alert('请输入姓名');
        form.name.focus();
    } else if (!form.number.value) {
        alert('请输入学号');
        form.number.focus();
    } else if (!numberPattern.test(form.number.value)) {
        alert('请输入正确的学号');
        form.number.focus();
    } else if (!form.phone.value) {
        alert('请输入手机号码');
        form.phone.focus();
    } else if (!phonePattern.test(form.phone.value)) {
        alert('请输入正确的手机号码');
        form.phone.focus();
    } else {
        console.log('jkhjkhjk');
        getData("POST", "http://121.42.29.120:8989/info/add", getFormQueryString('addInf'), function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var data = JSON.parse(xmlhttp.responseText);
                    if(data.status === 0) window.location.href = "";
                } else {
                    console.log("发生错误" + xmlhttp.status);
                }
            }
        });
    }
    forbiddenEvent(event);
}, false);

getAllInf();

/********************* add form *********************/

/***************************** HTML *****************************/

