window.onload=function () {
    var collapseBtn=document.querySelector("a.nav-link.sidebartoggler")
    collapseBtn.addEventListener("click",function () {
        document.querySelector("#main-wrapper").classList.toggle("collapseMain")
    })
    function myFunction(x) {
        if (x.matches) { // If media query matches
            document.querySelector("#main-wrapper").classList.add("collapseMain")
            document.querySelector(".left-sidebar").classList.add("aside-collpsed")
        } else {

        }
    }

    var x = window.matchMedia("(max-width: 992px)")
    myFunction(x)
    x.addListener(myFunction)
}
