
window.addEventListener("load",async()=>{
    let questionName=await chrome.storage.local.get(["quesName"]);
    let quesStatus=await chrome.storage.local.get(["problemSolved"])
    const name=document.getElementById('quesName');
    const status=document.getElementById('quesStatus');
    //  console.log(questionName);
    //  console.log(isQuesSolved);
    name.textContent=questionName.quesName;
    if(quesStatus.problemSolved){
        status.textContent="Congrats you are done for today"
    }
    else status.textContent="Keep At It...."
})
