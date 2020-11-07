# Zerojudge Apis

可以用來抓取使用者的AC題目，可以一次查詢多個使用者。
因Zerojudge需要驗證，所以需要手動提供session（但Zerojudge有時登入不需要reCAPTCHA，這時候會自動取得session）。

```bash
https://asia-east2-quickstart-1583673940423.cloudfunctions.net
/getUserACListWithSession?userIds[]=1&userIds[]=2&sessionId=VRWRGREG
```