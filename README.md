# Zerojudge Apis

可以用來抓取使用者的AC題目，可以一次查詢多個使用者。
因Zerojudge需要驗證，所以需要手動提供session（但Zerojudge有時登入不需要reCAPTCHA，這時候會自動取得session）。

```bash
https://asia-east2-quickstart-1583673940423.cloudfunctions.net
/getUserACListWithSession?userIds[]=1&userIds[]=2&sessionId=VRWRGREG
```


回傳
```json
{
    "12345": ["a001", "a002", "a003"],
    "9876": ["a001", "a002"],
    "888": []
}
```

可以搭配google sheet及appscript使用。
[範例](https://docs.google.com/spreadsheets/d/1f9sJVCDZzTw9S0RsuOJFXqnwxdhq1z0PSVLUXTDmH48/edit?usp=sharing)

可參考`./appscript.js`
