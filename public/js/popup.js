function showDetail(path){
  window.open(`/posts/${path}`,"admin_detail","width=800, height=500,top=400");
}

function showPopup(path){
  console.log(path);
  window.open(`/posts/${path}/destroy`,"admin_delete","width=400, height=200,top=400");
}

// detail -> 배송지 선택
function showDestination(){
  window.open("/destination_select","a","width=1200,height=500,top=500");
}


// 배송지 새로 생성
function showNewDestination(){
  window.open("/destination_create","new","width=800,height=500,top=400");
}

// 배송지 수정

function EditDestination(){
  window.open("/destination_create","new","width=800,height=500,top=400");
}
