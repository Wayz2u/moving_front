<img src="https://capsule-render.vercel.app/api?type=waving&color=auto&height=200&section=header&text=Capstone23_Moving&fontSize=50" />


## 🧑‍🤝‍🧑 Contributor

| 학번 | 이름 |
|----------|------|
| 20182213 | 김명진 |
| 20182153 | 정시온 |
| 20182601 | 임재확 |


### Coding Convention
```
Language : JavaScript
FrameWork : React
```

### Code of Conduct

## 🕰️ Project Duration(Beta)

 * September 1 ~ December 15


## 📌 Prerequiste

<img src="https://img.shields.io/badge/React(v18.2.0)-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/npm(9.5.1)-CB3837?style=for-the-badge&logo=npm&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/>


```
@mui/material (for dialogs, buttons, and UIs) "^5.13.0"  
```


## 💻 Initial Project Setting

### **You must have to install npm to develop tests.**


### How to use

* git clone 
```
$ git clone https://github.com/Wayz2u/moving_front
```

* install npm
```
$ npm install
```


* if you want to start at local settings.
```
$ npm start 
```

* connecting Webpage & DataBase.
```
https://your-own-database-url/${slideNumber}.json
```


* how to Deploy
```
1. create AWS account
2. push project to your git Account
3. link Aws Account & Git Account
4. go to Aws Amplify console.
5. click 'Connect App' to connect pushed project
6. go to 'build settings'
7. change 'amplify.yaml' using under code below (just copy & paste) 

version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --legacy-peer-deps
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*

8. Deploy

```

### How to access Specific page in local
* http://localhost:3000/slide/{slidenumber} 
* http://localhost:3000/sheet/{sheetnumber} 


### How to access Specific page using Amplify
* http://your-amplify-url/slide/{slidenumber} 
* http://your-amplify-url/sheet/{sheetnumber} 



### 🍎 Executable Environment (When test by local)

* MacOS environment 





