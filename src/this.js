//node环境下的this

/**
 * 普通函数下的this
 */
function foo1() {
    console.log("======== foo1")
    // 在普通函数中的this总是代表它的直接调用者
    // 在默认情况下，this指的是window(浏览器环境)/global(node环境)
    console.log(this == global, "this == global") //true
}

// ❌与浏览器表现不一致
// node中输出   `false 'foo1 == global.foo1'`。global.foo1为undefined
// 浏览器中输出  `true "foo1 == window.foo1"`
console.log(foo1 == global.foo1, "foo1 == global.foo1")
foo1() // foo1作为全局函数，挂载在global对象下，foo1()等价与global.foo1()

function foo2() {
    var outter_this = this //根据foo1()的测试可知这里的this为global对象
    setTimeout(function () {
        console.log("======== foo2")
        var inner_this = this
        //❌与浏览器表现不一致
        //node中输出   false 'inner_this == global'。inner_this为Timeout对象
        //浏览器中输出  true "inner_this == window"
        console.log(inner_this == global, "inner_this == global") //false
        console.log(outter_this == inner_this, "outter_this == inner_this") //false
        // console.log(inner_this) //Timeout {...}
    }, 100)
}
foo2()

/**
 * 严格模式下全局函数的this表现与非严格模式下不一致
 * 严格模式下全局函数的this为undefined
 * 非严格模式下全局函数的this为global
 */
function foo3() {
    'use strict'
    console.log("======== foo3")
    //结果与foo1()不同，因为严格来讲，foo3方法并没有定义在global/window对象中，不符合原则1.普通函数下的this为宿主对象
    console.log(this) //undefined
}
foo3()

var foo4 = {
    timeout: function () {
        var outter_this = this
        setTimeout(function () {
            var inner_this = this
            console.log("======== foo4.timeout()")
            console.log(outter_this == foo4, "outter_this == foo4") //true 'outter_this == foo4'
            //node中inner_this为Timeout
            //浏览器中inner_this为Window
            console.log(inner_this == foo4, "inner_this == foo4") //false 'inner_this == foo4'。 
        }, 100)
    }
}
//根据原则1.普通函数下的this为宿主对象
//foo4对象定义了timeout方法，是它的宿主对象，即this == foo4
//window(浏览器环境)/Timeout(node环境)对象定义了setTimeout，是它的宿主对象，即this == window/Timeout
foo4.timeout()