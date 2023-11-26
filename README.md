# usermanager

## Project setup
```
yarn install
```

### Cai dat mongoDB
```
https://www.youtube.com/watch?v=RmPp69cwNgg
ip:127.0.0.1:27017
```

### Compiles and minifies for production
```
yarn build
```

### khoi dong server 
```
cd server 
yarn start
```

### tao moi account dung postman hoac thunder client cua vsc
```
trong file :C:\UserManager\UserManager\usermanager\server\routes\index.ts
-mo comment cho doan code them user tu dong 96~107
-comment dong 215~226
-yarn build 
-yarn start
url:http://localhost:3000/api/user/
method:post
body:
{
   "username": "username1",
   "password": "abcabc",
   "role":"admin",
}
-sau khi tao account xong thi 
-mo comment cho doan code them user tu dong 215~226
-comment dong 96~107
```

### khoi dong client
-cd src
-yarn serve
-khoi dong client voi localhost:8080
-dang nhap bang account vua tao 
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
# UserManager
