
function showCongratulationsModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;">
            <div style="background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.3); color: black;">
                Congratulations! You've solved the problem! 🥳
                <button id="closeModalButton" style="margin-top: 10px; padding: 1rem; color: white; background-color: blue;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
  
    // Add the event listener to the button
   
    document.addEventListener('click', function (event) {
      if (event.target.id === 'closeModalButton') {
        modal.remove();
      }
    });
  }
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'userSolvedProblem') {
      showCongratulationsModal();
    }
  });