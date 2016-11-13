const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const conf = require('./config');
const path = require('path')
const url = require('url')

const socket = require('socket.io-client')('http://'+conf.cloudHost);

let mainWindow

function getIdleWindowUrl() {
  var data = url.format({
    pathname: conf.cloudHost+'/food/'+conf.deviceId,
    protocol: 'http:',
    slashes: true
  });
  console.log(data);
  return data;
}

function getAchievementWindowUrl() {
  var data = url.format({
    pathname: conf.cloudHost+'/achievement',
    protocol: 'http:',
    slashes: true
  });
  console.log(data);
  return data;
}

function getTakingWindowUrl() {
  var data = url.format({
    pathname: conf.cloudHost+'/food/'+conf.deviceId+'/user',
    protocol: 'http:',
    slashes: true
  });
  console.log(data);
  return data;
}

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(getIdleWindowUrl())

  socket.on('food-updated', () => {
    mainWindow.loadURL(getIdleWindowUrl());
  });

  socket.on('selected-food', (data) => {
    if(data.amount > 500) {
      mainWindow.loadURL(getAchievementWindowUrl());
      setTimeout(function(){
        mainWindow.loadURL(getTakingWindowUrl());
      }, 3000);
    }
  });

  socket.on('user-arrived', () => {
    mainWindow.loadURL(getTakingWindowUrl());
  });

  mainWindow.setFullScreen(true)
  
  //mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
