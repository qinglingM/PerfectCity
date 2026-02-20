import type { Dimension } from './questions20';

export interface CityProfile {
    name: string;
    w: Record<Dimension, number>;
}

export const CITIES_40: CityProfile[] = [
    { name: "上海", w: { CAREER: 0.32, QUALITY: 0.14, COST: 0.04, CULTURE: 0.16, NATURE: 0.08, URBAN: 0.26 } },
    { name: "北京", w: { CAREER: 0.30, QUALITY: 0.14, COST: 0.04, CULTURE: 0.24, NATURE: 0.10, URBAN: 0.18 } },
    { name: "深圳", w: { CAREER: 0.34, QUALITY: 0.16, COST: 0.04, CULTURE: 0.08, NATURE: 0.14, URBAN: 0.24 } },
    { name: "广州", w: { CAREER: 0.26, QUALITY: 0.18, COST: 0.08, CULTURE: 0.14, NATURE: 0.12, URBAN: 0.22 } },
    { name: "济南", w: { CAREER: 0.18, QUALITY: 0.18, COST: 0.16, CULTURE: 0.16, NATURE: 0.18, URBAN: 0.14 } },
    { name: "无锡", w: { CAREER: 0.24, QUALITY: 0.22, COST: 0.14, CULTURE: 0.14, NATURE: 0.12, URBAN: 0.14 } },
    { name: "沈阳", w: { CAREER: 0.18, QUALITY: 0.16, COST: 0.18, CULTURE: 0.12, NATURE: 0.22, URBAN: 0.14 } },
    { name: "昆明", w: { CAREER: 0.10, QUALITY: 0.28, COST: 0.16, CULTURE: 0.10, NATURE: 0.30, URBAN: 0.06 } },
    { name: "福州", w: { CAREER: 0.16, QUALITY: 0.24, COST: 0.18, CULTURE: 0.14, NATURE: 0.18, URBAN: 0.10 } },
    { name: "厦门", w: { CAREER: 0.12, QUALITY: 0.26, COST: 0.14, CULTURE: 0.16, NATURE: 0.18, URBAN: 0.14 } },
    { name: "温州", w: { CAREER: 0.30, QUALITY: 0.16, COST: 0.16, CULTURE: 0.12, NATURE: 0.16, URBAN: 0.10 } },
    { name: "石家庄", w: { CAREER: 0.16, QUALITY: 0.16, COST: 0.24, CULTURE: 0.10, NATURE: 0.20, URBAN: 0.14 } },
    { name: "大连", w: { CAREER: 0.16, QUALITY: 0.24, COST: 0.14, CULTURE: 0.12, NATURE: 0.20, URBAN: 0.14 } },
    { name: "哈尔滨", w: { CAREER: 0.14, QUALITY: 0.14, COST: 0.18, CULTURE: 0.22, NATURE: 0.22, URBAN: 0.10 } },
    { name: "金华", w: { CAREER: 0.22, QUALITY: 0.18, COST: 0.16, CULTURE: 0.12, NATURE: 0.22, URBAN: 0.10 } },
    { name: "泉州", w: { CAREER: 0.18, QUALITY: 0.18, COST: 0.12, CULTURE: 0.24, NATURE: 0.16, URBAN: 0.12 } },
    { name: "南宁", w: { CAREER: 0.14, QUALITY: 0.24, COST: 0.18, CULTURE: 0.10, NATURE: 0.22, URBAN: 0.12 } },
    { name: "长春", w: { CAREER: 0.16, QUALITY: 0.16, COST: 0.20, CULTURE: 0.12, NATURE: 0.22, URBAN: 0.14 } },
    { name: "常州", w: { CAREER: 0.22, QUALITY: 0.20, COST: 0.16, CULTURE: 0.12, NATURE: 0.16, URBAN: 0.14 } },
    { name: "南昌", w: { CAREER: 0.16, QUALITY: 0.18, COST: 0.22, CULTURE: 0.12, NATURE: 0.20, URBAN: 0.12 } },
    { name: "南通", w: { CAREER: 0.20, QUALITY: 0.20, COST: 0.16, CULTURE: 0.12, NATURE: 0.20, URBAN: 0.12 } },
    { name: "贵阳", w: { CAREER: 0.14, QUALITY: 0.24, COST: 0.18, CULTURE: 0.10, NATURE: 0.24, URBAN: 0.10 } },
    { name: "嘉兴", w: { CAREER: 0.20, QUALITY: 0.22, COST: 0.16, CULTURE: 0.12, NATURE: 0.16, URBAN: 0.14 } },
    { name: "徐州", w: { CAREER: 0.18, QUALITY: 0.18, COST: 0.22, CULTURE: 0.12, NATURE: 0.18, URBAN: 0.12 } },
    { name: "惠州", w: { CAREER: 0.14, QUALITY: 0.26, COST: 0.18, CULTURE: 0.12, NATURE: 0.22, URBAN: 0.08 } },
    { name: "太原", w: { CAREER: 0.16, QUALITY: 0.16, COST: 0.22, CULTURE: 0.14, NATURE: 0.20, URBAN: 0.12 } },
    { name: "烟台", w: { CAREER: 0.14, QUALITY: 0.24, COST: 0.18, CULTURE: 0.12, NATURE: 0.20, URBAN: 0.12 } },
    { name: "临沂", w: { CAREER: 0.14, QUALITY: 0.18, COST: 0.28, CULTURE: 0.10, NATURE: 0.16, URBAN: 0.14 } },
    { name: "保定", w: { CAREER: 0.16, QUALITY: 0.18, COST: 0.22, CULTURE: 0.12, NATURE: 0.20, URBAN: 0.12 } },
    { name: "台州", w: { CAREER: 0.22, QUALITY: 0.18, COST: 0.16, CULTURE: 0.10, NATURE: 0.22, URBAN: 0.12 } },
    { name: "绍兴", w: { CAREER: 0.18, QUALITY: 0.20, COST: 0.14, CULTURE: 0.26, NATURE: 0.12, URBAN: 0.10 } },
    { name: "珠海", w: { CAREER: 0.14, QUALITY: 0.30, COST: 0.14, CULTURE: 0.10, NATURE: 0.22, URBAN: 0.10 } },
    { name: "洛阳", w: { CAREER: 0.10, QUALITY: 0.18, COST: 0.18, CULTURE: 0.30, NATURE: 0.14, URBAN: 0.10 } },
    { name: "潍坊", w: { CAREER: 0.16, QUALITY: 0.16, COST: 0.22, CULTURE: 0.16, NATURE: 0.20, URBAN: 0.10 } },
    { name: "乌鲁木齐", w: { CAREER: 0.16, QUALITY: 0.16, COST: 0.16, CULTURE: 0.14, NATURE: 0.24, URBAN: 0.14 } },
    { name: "兰州", w: { CAREER: 0.16, QUALITY: 0.14, COST: 0.20, CULTURE: 0.14, NATURE: 0.22, URBAN: 0.14 } },
    { name: "连云港", w: { CAREER: 0.14, QUALITY: 0.16, COST: 0.22, CULTURE: 0.10, NATURE: 0.22, URBAN: 0.16 } },
    { name: "三亚", w: { CAREER: 0.10, QUALITY: 0.26, COST: 0.06, CULTURE: 0.06, NATURE: 0.42, URBAN: 0.10 } },
    { name: "宜昌", w: { CAREER: 0.16, QUALITY: 0.20, COST: 0.18, CULTURE: 0.12, NATURE: 0.22, URBAN: 0.12 } },
    { name: "威海", w: { CAREER: 0.10, QUALITY: 0.28, COST: 0.18, CULTURE: 0.10, NATURE: 0.22, URBAN: 0.12 } }
];
