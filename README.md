## Stream Server Pilot Project

## 설치

```
$ yarn
```

## 실행

```
$ yarn start
```

## 더미 파일 생성

`make-dummy.js`의 값을 적절하게 설정 후 아래 명령 실행.

```
$ node make-dummy.js
```
> Windows 환경에서만 동작함.

## 사용

아이디 리스트 가져오기

```
localhost:8080/files
```

해당 아이디 내 파일 리스트 가져오기 

```
localhost:8080/{id}/files
```

해당 아이디의 특정 파일 가져오기

```
localhost:8080/{id}?offset={offset}
```
