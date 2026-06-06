# PawAge 风险、合规与边界

## 一、健康类表达风险

PawAge 会涉及宠物年龄、生命周期和健康建议，因此必须避免被理解为医疗诊断工具。

推荐定位：

> PawAge provides general wellness references based on pet age and life stage. It does not provide medical diagnosis or treatment advice.

中文理解：PawAge 只提供基于年龄和生命阶段的一般养护参考，不提供医学诊断或治疗建议。

## 二、算法风险

### 风险点

- 不同兽医组织对年龄阶段划分并不完全一致。
- 不同犬种、体型、绝育状态、生活环境都会影响衰老速度。
- UCSD 犬类表观遗传学研究不能简单泛化到所有品种和所有宠物。

### 推荐处理

- 对外使用“estimate”“reference”“life-stage guide”等词。
- 在设置页和结果页放置简短免责声明入口。
- 不承诺“精准到医学级”。
- 不使用“专家背书”除非真的有授权或可公开引用来源。

## 三、应用商店审核风险

### 可能问题

- 健康建议过度医疗化。
- 宣称能预测疾病。
- 暗示替代兽医。
- 订阅功能描述不清。
- 隐私政策没有明确本地数据边界。

### 规避方式

- 所有建议以生活方式和常识提醒为主。
- Senior 阶段可以建议体检，但不能说“防癌”“诊断关节病”等确定性结果。
- Pro 页面明确订阅权益、周期和取消方式。
- 隐私政策明确宠物资料默认本地保存。

## 四、隐私与数据边界

首发版本建议不做账号系统，不上传宠物资料。

需要在隐私说明中明确：

- 保存哪些数据：宠物名字、生日、类型、体型、头像。
- 数据保存在哪里：用户设备本地。
- 是否上传服务器：首发不上传。
- 如何删除：设置页提供清除本地数据入口。

如果后续加入云同步，需要重新设计：

- 账号系统。
- 数据加密。
- 删除账号。
- 数据导出。
- 隐私政策更新。

## 五、免责声明建议

结果页短版：

> Age and life-stage results are estimates for general wellness reference only. Always consult a veterinarian for medical concerns.

设置页长版：

> PawAge uses public pet age and life-stage references to estimate a pet's human-age equivalent and provide general wellness suggestions. Results may vary by breed, body size, genetics, lifestyle, and health condition. PawAge is not a veterinary service and does not provide diagnosis, treatment, or emergency advice.

## 六、内容边界

可以做：

- 年龄估算。
- 生命周期解释。
- 一般饮食提醒。
- 一般运动建议。
- 体检频率提醒。
- 老龄宠物观察提示。

不建议做：

- 疾病诊断。
- 药物推荐。
- 疾病概率预测。
- 治疗方案。
- 紧急医疗建议。
- 兽医认证背书，除非有真实合作。

## 七、上线前检查清单

- 所有健康建议是否都使用温和表达。
- 是否存在“诊断”“治疗”“预防疾病”等高风险词。
- 是否有隐私政策入口。
- 是否有免责声明入口。
- 是否明确说明年龄结果是估算。
- 是否能删除本地数据。
- Pro 功能是否描述清楚。
