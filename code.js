/* What should the add-on do after it is installed */
function onInstall() {
  onOpen();
  
  // Deletes all triggers in the current project.
 var triggers = ScriptApp.getProjectTriggers();
 for (var i = 0; i < triggers.length; i++) {
   ScriptApp.deleteTrigger(triggers[i]);
 }
  
  
    ScriptApp.newTrigger("checkToClose")
  .timeBased()
  .everyDays(1)
  .create();
  
}

/* What should the add-on do when a document is opened */
function onOpen() {
 FormApp.getUi()
  .createAddonMenu() // Add a new option in the Google Docs Add-ons Menu
  .addItem("Set End Date", "showSidebar")
  .addToUi();  // Run the showSidebar function when someone clicks the menu
  

  
}

/* Show a 300px sidebar with the HTML from googlemaps.html */
function showSidebar() {
  var html = HtmlService.createTemplateFromFile("acceptingSwap")
    .evaluate()
    .setTitle("Schedule form close"); // The title shows in the sidebar
  FormApp.getUi().showSidebar(html);
  
 
}



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

/* This Google Script function does all the magic. */
function setEndDate(val){
  var scriptProperties = PropertiesService.getScriptProperties();

   scriptProperties.setProperty("End Date", val);
   scriptProperties.setProperty("formID", FormApp.getActiveForm().getId());

  
  checkToClose()
  
  
 

}

// check the date to see if the form should be open or closed.
// This is the function to run on a trigger. 
function checkToClose(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var endDay = scriptProperties.getProperty("End Date");
  Logger.log("END DATE: " + endDay);
  var now =formatDate(new Date());
  Logger.log("TODAY: " + now);
  var formID =  scriptProperties.getProperty("formID");
  form= FormApp.openById(formID);
  
  if(now >= endDay){
    form.setAcceptingResponses(false);
}
  else{
    form.setAcceptingResponses(true);
  }
  
}



// This function posts all properties to the log. 
function testProperties(){
    var scriptProperties = PropertiesService.getScriptProperties();

   var data = scriptProperties.getProperties();
  for (var key in data) {
  Logger.log('Key: %s, Value: %s', key, data[key]);
  }
}
