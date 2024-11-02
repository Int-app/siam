export interface ListItem {
  avatar?: string
  title: string
  datetime?: string
  description?: string
  status?: "primary" | "success" | "info" | "warning" | "danger"
  extra?: string
}

export const notifyData: ListItem[] = [
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
    title: "日本年金機構からのお知らせ",
    datetime: "最新号",
    description:
      "日本年金機構からのお知らせ」の最新号をご覧いただけます。"
  },
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png",
    title: "かんぽ生命のご契約者さま",
    datetime: "2023年度",
    description: "保険金等のお支払い状況"
  }
]

export const messageData: ListItem[] = [
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "保険金・給付金・年金",
    description: "Q【保険金】 入院保険金・手術保険金・放射線治療保険金を請求したい。",
    datetime: "2024-06-05"
  },
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "契約（保障）内容の確認・変更",
    description: "Q【契約】契約についての手続方法を知りたい。",
    datetime: "2024-07-06"
  },
  {
    avatar: "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "保険料",
    description: "Q【保険料】 口座の残高不足等で引落とされなかった。対処方法を知りたい。",
    datetime: "2024-04-16"
  }
]

export const todoData: ListItem[] = [
  {
    title: "保険のご加入・お見積り",
    description: "保険の仕組み・商品説明",
    extra: "相談中",
    status: "info"
  },
  {
    title: "ご契約内容の確認・変更",
    description: "契約変更（減額、払済、期間短縮）",
    extra: "進行中",
    status: "primary"
  },
  {
    title: "保険金のご請求",
    description: "保険金ご請求に関する照会",
    extra: "遅延",
    status: "danger"
  }
]
