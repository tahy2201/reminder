/**
 * noticeSchedules.gs
 *
 * 定期的に予定一覧を通知する。
 *
 */


// その日の特定の時間にトリガーを設定
function setTrigger() {
  var triggerDay = new Date();
  triggerDay.setHours(8);
  triggerDay.setMinutes(30);
  ScriptApp.newTrigger("noticeSchedule").timeBased().at(triggerDay).create();
  
  var triggerDay2 = new Date();
  triggerDay2.setHours(20);
  triggerDay2.setMinutes(0);
  ScriptApp.newTrigger("noticeSchedule").timeBased().at(triggerDay2).create();
}

// その日のトリガーを削除する関数(消さないと残る)
function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "main") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

// 実行したいスクリプト本体
function noticeSchedule() {
  deleteTrigger();
  var date = new Date();
  Logger.log('現在時刻:' + Utilities.formatDate( date, 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss'));
  doPush(getAllScheduleSimple());
}


