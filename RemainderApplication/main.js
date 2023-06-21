const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Notify } = require('electron-notifications');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

ipcMain.on('setReminder', (event, reminder) => {
  const { date, time, activity } = reminder;

  const now = new Date();
  const selectedDateTime = new Date(`${date}T${time}`);
  const timeDifference = selectedDateTime.getTime() - now.getTime();

  if (timeDifference > 0) {
    setTimeout(() => {
      const notification = new Notify({
        title: 'Reminder',
        text: `It's time to ${activity} on ${getDateFromDateTime(selectedDateTime)}`,
        sound: 'ping'
      });

      notification.show();
    }, timeDifference);
  }
});

function getDateFromDateTime(dateTime) {
  const options = { weekday: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(dateTime);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
