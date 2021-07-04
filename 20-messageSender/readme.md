# 메모용


## 기존 전송한 메시지를 수정하여 메시지를 작성
```
let test = {
    "content": "<@" + body.msg.authorID + "> 11",
    "tts": false,
    "embeds": [],
};
discord.init(body).edit(test);
```

## 기존 전송한 메시지를 삭제후 메시지를 작성
- 주의) 작성 후 14일이 지난 메시지는 삭제 불가
```
let test = {
    "content": "<@" + body.msg.authorID + "> 11",
    "tts": false,
    "embeds": [],
};
discord.init(body).delete().send(test);
```

## 채널내의 메시지를 대량삭제(최소1개 ~ 최대 100개)
- 주의) 작성 후 14일이 지난 메시지는 삭제 불가
```
discord.init(body).cleanChannelsMessages({limit:100});
```