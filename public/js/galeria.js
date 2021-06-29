const filterItem = document.querySelector(".items-galeria");
const filterImg = document.querySelectorAll(".galeria .image-galeria");

window.onload = ()=>{ 
  filterItem.onclick = (selectedItem)=>{ 
    if(selectedItem.target.classList.contains("item-galeria")){ 
      filterItem.querySelector(".active-galeria").classList.remove("active-galeria"); 
      selectedItem.target.classList.add("active-galeria"); 
      let filterName = selectedItem.target.getAttribute("data-name"); 
      filterImg.forEach((image) => {
        let filterImges = image.getAttribute("data-name");
        if((filterImges == filterName) || (filterName == "all")){
          image.classList.remove("hide"); 
          image.classList.add("show"); 
        }else{
          image.classList.add("hide"); 
          image.classList.remove("show");
        }
      });
    }
  }
  for (let i = 0; i < filterImg.length; i++) {
    filterImg[i].setAttribute("onclick", "preview(this)"); 
  }
}


const previewBox = document.querySelector(".preview-box-galeria"),
categoryName = previewBox.querySelector(".title-galeria p"),
previewImg = previewBox.querySelector("img"),
closeIcon = previewBox.querySelector(".icon-galeria"),
shadow = document.querySelector(".shadow-galeria");

function preview(element){

  document.querySelector("body").style.overflow = "hidden";
  let selectedPrevImg = element.querySelector("img").src; 
  let selectedImgCategory = element.getAttribute("data-name"); 
  previewImg.src = selectedPrevImg; 
  categoryName.textContent = selectedImgCategory; 
  previewBox.classList.add("show"); 
  shadow.classList.add("show"); 

  closeIcon.onclick = ()=>{ 
    previewBox.classList.remove("show"); 
    shadow.classList.remove("show"); 
    document.querySelector("body").style.overflow = "auto"; 
  }
  
}