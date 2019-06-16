
function testFunc() {
  getSheetObj()
}

function testWrite(testText) {
  var date = new Date();
  SpreadsheetApp.openById(FILE_KEY).getSheetByName(SCHEDULE_SHEET_NAME).getRange(1,1)
  .setValue(testText);
}

function getSheetObj() {
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('FILE_KEY'))
     .getSheetByName(PropertiesService.getScriptProperties().getProperty('SCHEDULE_SHEET_NAME'));
}

// スケジュール取得
function getSchedule(rowNum, colmnLength) {
  var sheet =getSheetObj();
  var schedule = '';
  for(var i = 1; i <= colmnLength ; i++) {
    schedule = schedule + sheet.getRange(rowNum, i).getValue();
    if(i < colmnLength) {
      schedule = schedule + ',';
    }
  }
  return schedule;
}

// スケジュール取得(名称のみ)
function getScheduleSimple(rowNum) {
  var sheet = getSheetObj();
  return sheet.getRange(rowNum, 2).getValue();
}

/**
 * 全スケジュール取得
 * @param len 取得する項目数(前から)
 */
function getAllSchedule(len) {
  var i = 1;
  var schedules = '';
  var sheet = getSheetObj();
  while(!sheet.getRange(i,1).isBlank()){
    if(i > 1) {
      schedules = schedules +'\n';
    }
    schedules = schedules + getSchedule(i,len);
    i++;
  }
  return schedules;
}

/**
 * 全スケジュール取得(名称のみ)
 * @param len 取得する項目数(前から)
 */
function getAllScheduleSimple() {
  var i = 1;
  var schedules = '';
  var sheet = getSheetObj();
  while(!sheet.getRange(i,1).isBlank()){
    if(i > 1) {
      schedules = schedules +'\n';
    }
    schedules = schedules + getScheduleSimple(i);
    i++;
  }
  return schedules;
}

/**
* insertSchedule() スケジュール登録
*
* @param scheName スケジュール名
* @param dueDate 登録日
* @param loop 繰り返し単位
*
*/
function insertSchedule(scheName, dueDate, loop) {
  var i = 1;
  var sheet = getSheetObj();
  
  while(!sheet.getRange(i,1).isBlank()) {
    // 空行を見つけるまでループ 
    i++;
  }
  try{
    sheet.getRange(i,1).setValue('=row()');
    sheet.getRange(i,3).setValue(Utilities.formatDate(dueDate, 'Asia/Tokyo', 'yyyy/MM/dd'));
    sheet.getRange(i,4).setValue(loop);
    sheet.getRange(i,5).setValue(false);
    sheet.getRange(i,2).setValue(scheName);
  } catch(e) {
    Logger.log('シート書き込みでエラーが発生しました。');
    for(var j=1; j<=5; j++) {
      sheet.getRange(i, j).clear();
    }
  }
}

function deleteSchedule(rowNum) {
  // レコード削除
  getSheetObj().deleteRow(rowNum);
}

function editSchedule(id, scheName, dueDate, loop) {
}
