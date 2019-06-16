/**
 * mainFunc.gs
 *
 * メイン
 *
 */

// reminderメイン
// Line側に書き込むと動く。
function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  
  // メッセージ記録
  var umArray = userMessage.split('\n');
  console.log('post:' + umArray);

  var retStr = 'そのまま'
  // 操作呼び出し
  if (umArray[0] == '登録') {
    addSchedule(umArray)
    retStr = '登録完了\n' + getAllSchedule(2)
  } else if(umArray[0] == '削除') {
    rmSchedule(umArray)
    retStr = '削除完了\n' + getAllSchedule(2)
  } else if(umArray[0] == '確認') {
    retStr = getAllSchedule(2)
    if(retStr == '') {
      retStr = '予定なし'
    }
  } else if(umArray[0] == '使い方') {
    retStr = '使い方\nそれぞれ以下のように入力します。\n\n'
    retStr = retStr + '・予定登録\n登録\n登録したい予定1\n登録したい予定2\n...\n\n'
    retStr = retStr + '・予定削除\n削除\n削除したい予定番号1,削除したい予定番号2,...\n\n'
    retStr = retStr + '・予定確認\n確認'
  } else {
    // なし
  }
  
  UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('REPLY_URL'), {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN'),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': retStr,
      }],
    }),
    });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function doPush(pushText) {
  
  UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('REPLY_URL'), {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN'),
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': PropertiesService.getScriptProperties().getProperty('USER_ID'),
      'messages': [{
        'type': 'text',
        'text': pushText,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

// 予定登録
function addSchedule(addSchedules) {
  console.log('登録:' + addSchedules)
  for (var i in addSchedules) {
    if(i == 0) {
      continue
    }
    insertSchedule(addSchedules[i],new Date(),'1日')
  }
}

// 予定削除
function rmSchedule(umArray) {
  console.log('削除:' + umArray)
  var delNums = umArray[1].split(',');  
  delNums.sort(function(a, b){
    return b - a;
  });
  for (var i in delNums) {
    deleteSchedule(delNums[i])
  }  
}

// テスト用
function testPush() {
 doPush(getAllScheduleSimple()); 
}
