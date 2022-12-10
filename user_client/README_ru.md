## <a name="clientphp"></a> Клиентский блок

* [Начальная настройка](#startuserclient)
* [События клиентского блока](#eventuser)
* [Телеграм-бот](#usertlgrm)

### <a name="startuserclient"> Начальная настройка
Для старта работы требуется заполнить конфигурационные файлы `js/const.js`:
#### `js/const.js`
```js
//URL папки с административной панелью
const DOMEN = 'http://test.com/';

//Название логотипа компании
const LOGO_COMPANY = 'socketgram.io.min.png';

//URL сервера чата
const DOMEN_SERVER = 'https://your.domen.com/';
```
Также требуется установить значения `sessionStorage`(можно путём Ajax-запроса):
```js
sessionStorage.setItem("id", "Идентификатор клиента (к примеру: 123)");
sessionStorage.setItem("room", "Хэш комнаты");
```
Страница выглядит следующем образом:
<img src="../docs/client.PNG" align="center">

### <a name="eventuser"> События клиентского блока

Клиентская панель обрабатывает следующие события:
```js
socket.on('new message', (
    {
        username: username,         //Идентификатор пользователя (К примеру: 123)
        message: message,           //Сообщение
        label: label,               //Идентификатор сообщения
        date: date,                 //Время и дата отправки
        adm: login_admin            //Имя администратора(если сообщение написано клиентом, параметр равен 0)
    }) => {});                      //Сообщение от админа/пользователя
```
```js
socket.on('new message history', (
    {
        username: username,         //Идентификатор пользователя (К примеру: 123)
        message: message,           //Сообщение
        label: label,               //Идентификатор сообщения
        date: date,                 //Время и дата отправки
        adm: login_admin            //Имя администратора(если сообщение написано клиентом, параметр равен 0)
    }) => {});                      //Подгрузка истории сообщений
```
```js
socket.on('drop history button',() => {}); //Удаление кнопки подгрузки истории сообщений
```
```js
socket.on('add history button',() => {}); //Добавление кнопки подгрузки истории сообщений
```

### <a name="usertlgrm"> Телеграм-бот

Вызов `/start` запускает телеграм-бота:
<br>
<img src="../docs/t1.jpg" width="300px">

Нажав `Contacts`, выводятся контакты компании:
<br>
<img src="../docs/t2.jpg" width="300px">

Нажав `Log in to PA`, начинается процесс авторизации:
<br>
<img src="../docs/t3.jpg" width="300px">

При неверном логине/пароле приходит следующее сообщение:
<br>
<img src="../docs/t4.jpg" width="300px">

При корректной авторизации изменяется меню:
<br>
<img src="../docs/t5.jpg" width="300px">

Чтобы написать в техподдержку, нужно нажать кнопку `Write a message to technical support`:
<br>
<img src="../docs/t6.jpg" width="300px">
<img src="../docs/t7.jpg" width="300px">

Ответ от админиистратора выглядит следующим образом:
<br>
<img src="../docs/t8.jpg" width="300px">