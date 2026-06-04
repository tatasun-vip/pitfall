export type WorldId = 'campus' | 'travel' | 'work' | 'home' | 'shop' | 'beauty';

export type PitfallCard = {
  avatar: string;
  risk: string;
  title: string;
  body: string;
  tags: string[];
  original: string;
  translation: string;
  alternative: string;
};

export type PitfallWorld = {
  id: WorldId;
  label: string;
  subtitle: string;
  note: string;
  accent: string;
  cards: PitfallCard[];
};

export const worlds: PitfallWorld[] = [
  {
    id: 'campus',
    label: '校园',
    subtitle: '录取 / 合同 / 退款',
    note: '把口头承诺变成可核对时间线。',
    accent: '#e60023',
    cards: [
      {
        avatar: '学',
        risk: '86% 风险',
        title: '留学“保录取”没有写进合同',
        body: '聊天承诺、合同条款、退款邮件三方对照。',
        tags: ['合同', '中英翻译', '4 条替代'],
        original: 'Guaranteed admission was promised in chat, but not written into the contract.',
        translation: '聊天里承诺保录取，但合同正文没有写入。',
        alternative: '查看可退款周期更清楚的 4 个项目。'
      },
      {
        avatar: '课',
        risk: '72% 风险',
        title: '试听课后自动续费，取消入口藏得很深',
        body: '扣费截图、课程协议、客服回复做成一页清单。',
        tags: ['账单', '求材料', '模板信'],
        original: 'Cancellation requires written notice thirty days before renewal.',
        translation: '取消需要在续费前 30 天书面通知。',
        alternative: '复制退款沟通模板。'
      }
    ]
  },
  {
    id: 'travel',
    label: '旅行',
    subtitle: '菜单 / 账单 / 住宿',
    note: '菜单、账单、交通、住宿，先看原文再付款。',
    accent: '#3157ff',
    cards: [
      {
        avatar: '旅',
        risk: '79% 风险',
        title: 'coperto / servizio 是隐藏收费吗？',
        body: '拍菜单后逐句解释当地收费词，结账前减少语言信息差。',
        tags: ['菜单 OCR', '意中互译', '当地解释'],
        original: 'Coperto €3 per person, servizio 12% not included.',
        translation: '每人餐位费 3 欧，服务费 12% 未包含。',
        alternative: '收藏 6 家费用透明餐厅。'
      },
      {
        avatar: '住',
        risk: '83% 风险',
        title: '民宿清洁费和城市税在最后一步出现',
        body: '保留预订页快照，拆出平台费用、房东费用和本地税。',
        tags: ['网页留档', '账单', '替代路线'],
        original: 'Cleaning fee and city tax are charged at check-in.',
        translation: '清洁费和城市税在入住时另行收取。',
        alternative: '切换到总价透明筛选。'
      }
    ]
  },
  {
    id: 'work',
    label: '职场',
    subtitle: 'Offer / 培训 / 社保',
    note: '岗位、薪资、培训、试用期，把模糊承诺拆成清单。',
    accent: '#17110f',
    cards: [
      {
        avatar: '职',
        risk: '91% 风险',
        title: '第一份工作变成培训贷',
        body: '招聘页、面试话术、贷款合同三方对照，先看主体关系。',
        tags: ['合同', '讨论房间', '清醒清单'],
        original: 'Training cost can be financed by partner institution.',
        translation: '培训费用可由合作机构分期支付。',
        alternative: '查看无培训贷岗位清单。'
      },
      {
        avatar: '薪',
        risk: '77% 风险',
        title: 'Offer 写综合薪资，底薪比例很低',
        body: '把薪资结构、试用期、社保、公积金拆成可问清单。',
        tags: ['Offer', '模板问题', '求回应'],
        original: 'Total compensation includes base, bonus and flexible benefits.',
        translation: '总薪资包含底薪、奖金和弹性福利。',
        alternative: '生成入职前追问清单。'
      }
    ]
  },
  {
    id: 'home',
    label: '租住',
    subtitle: '押金 / 维修 / 退租',
    note: '押金、维修、退租、合同条款，每一步都留下材料。',
    accent: '#0e9f64',
    cards: [
      {
        avatar: '租',
        risk: '82% 风险',
        title: '押金扣费与退租清单不一致',
        body: '入住/退租照片时间戳，合同扣费条款逐句翻译。',
        tags: ['照片', '合同', '模板信'],
        original: 'Deductions may include cleaning, repainting and key replacement.',
        translation: '扣费可能包含清洁、重新粉刷和钥匙更换。',
        alternative: '下载退租拍照清单。'
      },
      {
        avatar: '修',
        risk: '69% 风险',
        title: '维修责任模糊，房东口头承诺失效',
        body: '维修前后图片、聊天记录、合同责任条款归档。',
        tags: ['打码', '同城房间', '回应'],
        original: 'Minor maintenance is tenant responsibility unless otherwise stated.',
        translation: '除非另有说明，小型维修由租客负责。',
        alternative: '生成维修责任追问模板。'
      }
    ]
  },
  {
    id: 'shop',
    label: '跨境',
    subtitle: '预售 / 税费 / 售后',
    note: '预售、税费、物流、售后主体，页面留档 + 多语对照。',
    accent: '#7c4dff',
    cards: [
      {
        avatar: '购',
        risk: '74% 风险',
        title: '跨境预售售后主体不清',
        body: '原网页快照 + 译文并列，防止页面改口。',
        tags: ['页面留档', '多语', '替代'],
        original: 'Seller of record may differ from the marketplace operator.',
        translation: '实际销售主体可能不同于平台运营方。',
        alternative: '查看主体清晰的替代商家。'
      },
      {
        avatar: '税',
        risk: '71% 风险',
        title: '低价商品结算后税费翻倍',
        body: '拆出商品价、运费、关税、平台服务费。',
        tags: ['账单', '计算器', '纠错'],
        original: 'Import duties and handling fee are collected separately.',
        translation: '进口关税和处理费将另行收取。',
        alternative: '打开到手价计算器。'
      }
    ]
  },
  {
    id: 'beauty',
    label: '美业',
    subtitle: '告知 / 复诊 / 效果',
    note: '术前告知、效果承诺、复诊记录，高敏内容严格打码。',
    accent: '#b80f26',
    cards: [
      {
        avatar: '美',
        risk: '88% 风险',
        title: '术前告知不足，效果承诺过满',
        body: '高敏行业默认分级展示，隐私与肖像自动打码。',
        tags: ['严格审核', '回应', '替代机构'],
        original: 'Results may vary and require follow-up treatment.',
        translation: '效果可能因人而异，且可能需要后续治疗。',
        alternative: '查看告知更清晰的机构。'
      },
      {
        avatar: '医',
        risk: '76% 风险',
        title: '套餐名不同，实际项目被拆分收费',
        body: '对照项目单、付款记录、术前沟通和复诊记录。',
        tags: ['材料分级', '隐私', '讨论'],
        original: 'Package excludes disposable tools and aftercare medication.',
        translation: '套餐不包含一次性工具和术后护理药品。',
        alternative: '生成术前费用确认清单。'
      }
    ]
  }
];
