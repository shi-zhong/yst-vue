时间轴(TimeLine)组件

1. TimeLine
   1. 时间轴组件由若干个组构成
   2. 时间轴组件存在自己的单独配置

2. Group
   1. 每个组由项(Item)构成

3. Item
   1. 项的描述，为了确定项在条中的位置，需要对项的位置进行描述
      1. 绝对定位，使用start(开始时间) last(持续值)对项进行定位
      2. 相对定位，使用target(相对主体)，offset(偏移值)， last(持续值), direction(方向)来进行定位
      3. 如何确定最后的定位
         1. 将所有的定位绝对定位化
         2. 根据开始时间将数据进行排序
         3. 分离重叠数据
         4. 生成相应的长度和偏移信息