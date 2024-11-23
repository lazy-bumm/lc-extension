// let problemSolved = false;

console.log("jjjjjjjjjjjjjjjjjjj");

// let arrUrl = ["https://leetcode.com/problems/tweet-counts-per-frequency/",
// "https://leetcode.com/problems/two-sum/",
// "https://youtube.com"];

// let randomProblem = "https://youtube.com/";

// const normalizeUrl=(url)=>{
//   return url.endsWith('/')?url:url+'/';
// }
// function getNewRules() {
//   return setRule(randomProblem);
// }

// async function setRule(newUrl) {

//   const url=normalizeUrl(newUrl)
//   let newRule = {
//     id: 1,
//     priority: 1,
//     action: { type: "redirect", redirect: { url:url} },
//     condition: {
//       urlFilter: "://*/*",
//       resourceTypes: ["main_frame"],
//     },
//   };
//   try {
//     await chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: [1],
//       addRules:[newRule]
//     });
//     console.log('Redirect rule updated');
//   } catch (error) {
//     console.error('Error updating redirect rule:', error);
//   }
// }

// const update= async()=>{
//   var randomNumber = Math.floor(Math.random()*arrUrl.length)
//   var newUrl=arrUrl[randomNumber]
//   await setRule(newUrl)
// }

//   update();

// Get arrays containing new and old rules

// Use the arrays to update the dynamic rules

let arrUrl = [
  "https://leetcode.com/problems/3sum/",
  "https://leetcode.com/problems/two-sum/",
];

let problemSolved = false;
let quesInfo;
const isSubmissionSuccessURL = (url) =>
  url.includes("/submissions/detail/") && url.includes("/check/");

const sendSolvedMssg = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "userSolvedProblem" });
  });
};

async function getDailyLeetCodeQuestion() {
  try {
    const response = await fetch("https://alfa-leetcode-api.vercel.app/daily"); // Replace with the URL of the daily question
    const data = await response.json();

    //console.log(data);
    quesInfo = data;
    console.log(quesInfo);
    console.log("Daily LeetCode Question:", quesInfo.questionTitle);

    await chrome.storage.local.set({
      quesUrl: 'https://leetcode.com/contest/weekly-contest-393/problems/kth-smallest-amount-with-single-denomination-combination/',
      quesName: quesInfo.questionTitle,
      date: quesInfo.date,
    });
  } catch (error) {
    console.error("Error fetching daily LeetCode question:", error);
  }
}

const checkIfUserSolvedProblem = async (details) => {
  suburl = details.url;
  let isProblemSolved = await chrome.storage.local.get(["problemSolved"]);
  console.log(isProblemSolved.problemSolved);
  if (isSubmissionSuccessURL(suburl) && !isProblemSolved.problemSolved) {
    try {
      const response = await fetch(suburl);
      const data = await response.json();

      if (
        data.status_msg === "Accepted" &&
        data.state === "SUCCESS" 
        // && data.question_id === quesInfo.questionId
      ) {
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [1],
        });
        if (!isProblemSolved.problemSolved) {
          if (!problemSolved) sendSolvedMssg();
          problemSolved = true;
          chrome.storage.local.set({ problemSolved: true });
          console.log("solved first time");
        }
      }
    } catch (error) {
      console.error("Error in checkUserSolvedProblem:", error);
    }
  }
};

const update = async () => {
  // restore the default rule if the extension is installed or updated
  await getDailyLeetCodeQuestion();
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRules.map((rule) => rule.id),
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: "redirect",
          redirect: { url: quesInfo.questionLink },
        },
        condition: {
          urlFilter: "*://*/*",
          excludedDomains: [
            "leetcode.com",
            "www.leetcode.com",
            "developer.chrome.com",
          ],
          resourceTypes: ["main_frame"],
        },
      },
    ],
  });
};

async function createAlarm() {
  const alarm = await chrome.alarms.get("addQues");
  if (typeof alarm === "undefined") {
    console.log("alarm");
    await chrome.alarms.create("addQues", {
      delayInMinutes: 1,
      periodInMinutes: 3,
    });
  }
}
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  await chrome.storage.local.set({ problemSolved: problemSolved }).then(() => {
    console.log("value set");
  });

  update();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.log("alarm listening");
  problemSolved = false;
  await chrome.storage.local.set({ problemSolved: problemSolved }).then(() => {
    console.log("value set");
  });
  console.log("alarm update");
  await update();
});
// Create an alarm
createAlarm();
if (!problemSolved)
  chrome.webRequest.onCompleted.addListener(checkIfUserSolvedProblem, {
    urls: ["*://leetcode.com/submissions/detail/*/check/"],
  });
  