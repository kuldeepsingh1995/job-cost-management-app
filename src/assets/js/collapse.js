
export function myTest() {

    let clsp = document.getElementById("aside-collapse");
    let logo = document.getElementById("logo-i");
    let pageWrapper=document.getElementsByClassName("page-wrapper")[0];
    if(clsp){
        clsp.classList.toggle("aside-collpsed")
    }
    if(logo){
        logo.classList.toggle("c-logo")
    }
    let header = document.getElementById("n-header");
    if (clsp.classList.contains("aside-collpsed")) {
        clsp.style.width = "0px";
        header.style.width = "0px"
        pageWrapper.style.marginLeft = "0px"
        logo.src = "../assets/images/logo-c.png"
    } else {
        clsp.style.width = "240px";
        header.style.width = "240px"
        pageWrapper.style.marginLeft = "240px"
        logo.src = "../assets/images/logo.png"
    }
    
}


 export function check(){
    // if (window.matchMedia("(max-width: 768px)").matches) {
    //    myTest()
    // }
}
