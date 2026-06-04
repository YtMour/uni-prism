# FitCal Android 自有证书

用途：HBuilderX 自定义调试基座 / Android 云打包。

## 打包参数

- 证书文件：`FitCal-android-release.jks`
- 证书别名：`fitcal`
- 证书密码：`S5k8LyvuFNamY3aS=dwa_9CDfQwkxjxa`
- 私钥密码：`VuqBr4fmqMC3VJ!C=E!jmhLfeBa$g5yp`
- 证书类型：`JKS`
- 密钥算法：`RSA 2048`
- 有效期：`36500` 天
- 所有者：`CN=FitCal, OU=Development, O=UniPrism, L=Shanghai, ST=Shanghai, C=CN`

## 证书指纹

- SHA1：`BC:02:F3:72:04:CE:06:B0:7C:6A:E9:A4:6E:17:3D:27:9F:5C:C9:2B`
- SHA256：`B1:35:BA:24:52:D7:AE:CE:87:A5:70:46:DB:4F:58:76:79:E1:66:6B:97:04:5B:1B:C2:23:36:88:DF:4B:0D:01`

## HBuilderX 使用

在 Android 云打包或生成自定义调试基座时，选择“使用自有证书”，然后填写：

- 证书文件：选择项目根目录下的 `FitCal-android-release.jks`
- 证书别名：`fitcal`
- 证书密码：`S5k8LyvuFNamY3aS=dwa_9CDfQwkxjxa`
- 私钥密码：`VuqBr4fmqMC3VJ!C=E!jmhLfeBa$g5yp`

## Git 排除

证书文件本身已通过 BMI 项目内 `.gitignore` 和最外层仓库 `.gitignore` 排除：

```gitignore
*.jks
BMI/*.jks
```

当前证书适合测试、自定义基座和开发验证使用。正式发布前如果继续使用这份证书，需要离线备份 `FitCal-android-release.jks` 和本页密码；同一个已发布 App 后续升级必须继续使用同一签名证书。
